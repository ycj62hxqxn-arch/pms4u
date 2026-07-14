import pLimit from "p-limit";
import { getFlightProvider } from "@/lib/providers/provider-factory";
import { FlightSearchRequest, FlightOffer } from "@/lib/providers/types";
import { matchOffers } from "@/lib/matching/match-offers";
import { normalizeOffer } from "@/lib/matching/normalize-offer";
import { getExchangeRate } from "@/lib/currency/exchange-rate-adapter";
import { verifyEffectiveIp } from "@/lib/proxy/verify-location";
import { createEvidenceRecord, generateEvidenceHash } from "@/lib/governance/evidence-record";
import { PROXY_ENDPOINTS } from "@/lib/proxy/proxy-config";
import { validateProxyUrl } from "@/lib/security/ssrf-protection";
import { getProxyUrlForLocation } from "@/lib/proxy/proxy-config";

export interface MatchedComparisonResult {
  locationKey: string;
  locationLabel: string;
  status: "MATCHED" | "INVALID_LOCATION" | "FAILED" | "NO_MATCH";
  verifiedIpCountry?: string;
  baselineOffer?: FlightOffer;
  regionalOffer?: FlightOffer;
  matchConfidence?: "EXACT" | "HIGH" | "MEDIUM" | "NOT_COMPARABLE";
  normalizedPrice?: number;
  normalizedCurrency?: string;
  originalPrice?: number;
  originalCurrency?: string;
  priceDifference?: number;
  priceDifferencePercent?: number;
  error?: string;
}

export interface ComparisonResult {
  comparisonId: string;
  status: "COMPLETED" | "PARTIAL" | "FAILED";
  baselineOffers: FlightOffer[];
  regionalOffersMap: Map<string, FlightOffer[]>;
  matchedResults: MatchedComparisonResult[];
  errors: Record<string, string>;
  evidenceHash: string;
  completedAt: Date;
}

/**
 * Main comparison orchestrator.
 * Runs baseline search, then regional searches concurrently.
 * Verifies IPs, matches offers, normalizes prices, and generates evidence.
 */
export async function runComparison(
  comparisonId: string,
  searchRequest: FlightSearchRequest,
  selectedLocations: string[],
  comparisonCurrency: string
): Promise<ComparisonResult> {
  const provider = getFlightProvider();
  const limitFn = pLimit(3); // Max 3 concurrent provider calls

  const result: ComparisonResult = {
    comparisonId,
    status: "FAILED",
    baselineOffers: [],
    regionalOffersMap: new Map(),
    matchedResults: [],
    errors: {},
    evidenceHash: "",
    completedAt: new Date(),
  };

  try {
    // ============ Step 1: Run baseline search (no proxy) ============
    let baselineOffers: FlightOffer[] = [];
    try {
      baselineOffers = await provider.searchFlights(searchRequest, {
        countryCode: "US",
        currency: searchRequest.preferredCurrency,
        locale: "en-US",
        pointOfSale: "US",
        requestId: `baseline-${comparisonId}`,
        locationKey: "BASELINE",
      });
      result.baselineOffers = baselineOffers;
    } catch (err) {
      result.errors["baseline"] = err instanceof Error ? err.message : "Unknown error";
    }

    if (!baselineOffers || baselineOffers.length === 0) {
      result.errors["baseline"] = "No offers found for baseline search";
      result.status = "FAILED";
      return result;
    }

    // ============ Step 2: Run regional searches concurrently ============
    const selectedLocationKeys = selectedLocations.filter((loc) => loc !== "BASELINE");

    const regionalSearchTasks = selectedLocationKeys.map((locationKey) =>
      limitFn(async () => {
        const regionConfig = PROXY_ENDPOINTS.find((p) => p.locationKey === locationKey);
        if (!regionConfig) {
          result.errors[locationKey] = `Unknown location: ${locationKey}`;
          return { locationKey, offers: [] };
        }

        try {
          const proxyUrl = getProxyUrlForLocation(regionConfig.locationKey);
          if (process.env.NETWORK_MODE === "live") {
            if (!proxyUrl) {
              result.errors[locationKey] = `Missing approved proxy for ${regionConfig.label}`;
              return { locationKey, offers: [] };
            }
            if (!validateProxyUrl(proxyUrl)) {
              result.errors[locationKey] = `Proxy rejected by security validation for ${regionConfig.label}`;
              return { locationKey, offers: [] };
            }
          }

          // Verify IP before search (mock in dev)
          const ipVerification = await verifyEffectiveIp(proxyUrl, regionConfig.countryCode);
          if (ipVerification.status !== "VERIFIED") {
            result.errors[locationKey] = `IP verification failed for ${regionConfig.label}`;
            return { locationKey, offers: [] };
          }

          const regionalOffers = await provider.searchFlights(searchRequest, {
            countryCode: regionConfig.countryCode,
            currency: searchRequest.preferredCurrency,
            locale: "en-US",
            pointOfSale: regionConfig.countryCode,
            requestId: `${locationKey}-${comparisonId}`,
            locationKey: regionConfig.locationKey,
              proxyUrl,
          });
          return { locationKey, offers: regionalOffers || [] };
        } catch (err) {
          result.errors[locationKey] = err instanceof Error ? err.message : "Unknown error";
          return { locationKey, offers: [] };
        }
      })
    );

    const regionalResults = await Promise.all(regionalSearchTasks);

    for (const { locationKey, offers } of regionalResults) {
      result.regionalOffersMap.set(locationKey, offers);
    }

    // ============ Step 3: Match offers and normalize prices ============
    const selectedBaseline = baselineOffers[0];
    const exchangeRates: Record<string, number> = {};
    
    result.matchedResults.push({
      locationKey: "BASELINE",
      locationLabel: "Baseline",
      status: "MATCHED",
      verifiedIpCountry: "US",
      baselineOffer: selectedBaseline,
      regionalOffer: selectedBaseline,
      matchConfidence: "EXACT",
      normalizedPrice: selectedBaseline.totalPrice,
      normalizedCurrency: comparisonCurrency,
      originalPrice: selectedBaseline.totalPrice,
      originalCurrency: selectedBaseline.currency,
      priceDifference: 0,
      priceDifferencePercent: 0,
    });

    for (const locationKey of selectedLocationKeys) {
      const regionConfig = PROXY_ENDPOINTS.find((p) => p.locationKey === locationKey);
      if (!regionConfig) continue;

      const regionalOffers = result.regionalOffersMap.get(locationKey) || [];

      if (regionalOffers.length === 0) {
        result.matchedResults.push({
          locationKey,
          locationLabel: regionConfig.label,
          status: "NO_MATCH",
          error: result.errors[locationKey] || "No offers found",
        });
        continue;
      }

      try {
        const regionalOffer = regionalOffers[0];
        const matchConfidence = matchOffers(selectedBaseline, regionalOffer);

        // Get exchange rate if different currencies
        let exchangeRateNum = 1;
        if (selectedBaseline.currency !== comparisonCurrency) {
          const rateSnapshot = await getExchangeRate(
            selectedBaseline.currency,
            comparisonCurrency
          );
          exchangeRateNum = rateSnapshot.rate;
          exchangeRates[`${selectedBaseline.currency}-${comparisonCurrency}`] = exchangeRateNum;
        }

        const normalizedOffer = normalizeOffer(
          regionalOffer,
          exchangeRateNum,
          comparisonCurrency
        );

        const baselineReference =
          selectedBaseline.totalPayablePrice ?? selectedBaseline.totalPrice;
        const isReliableComparable =
          matchConfidence.confidence === "EXACT" ||
          matchConfidence.confidence === "HIGH";

        const priceDifference = isReliableComparable
          ? normalizedOffer.normalizedPrice - baselineReference
          : 0;
        const priceDifferencePercent =
          baselineReference > 0 && isReliableComparable
            ? (priceDifference / baselineReference) * 100
            : 0;

        result.matchedResults.push({
          locationKey,
          locationLabel: regionConfig.label,
          status: "MATCHED",
          verifiedIpCountry: regionConfig.countryCode,
          baselineOffer: selectedBaseline,
          regionalOffer,
          matchConfidence: matchConfidence.confidence,
          normalizedPrice: normalizedOffer.normalizedPrice,
          normalizedCurrency: comparisonCurrency,
          originalPrice: regionalOffer.totalPrice,
          originalCurrency: regionalOffer.currency,
          priceDifference,
          priceDifferencePercent,
        });
      } catch (err) {
        result.matchedResults.push({
          locationKey,
          locationLabel: regionConfig.label,
          status: "FAILED",
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    // ============ Step 4: Generate evidence record ============
    const evidenceRecord = createEvidenceRecord(
      comparisonId,
      result.status === "COMPLETED" ? "COMPLETED" : "PARTIAL",
      JSON.parse(JSON.stringify(searchRequest)) as Record<string, unknown>,
      selectedLocations
    );

    result.evidenceHash = generateEvidenceHash(evidenceRecord);
    result.status = result.matchedResults.some((r) => r.status === "MATCHED")
      ? "COMPLETED"
      : "PARTIAL";

    return result;
  } catch (err) {
    result.status = "FAILED";
    result.errors["orchestrator"] = err instanceof Error ? err.message : "Unknown error";
    return result;
  }
}
