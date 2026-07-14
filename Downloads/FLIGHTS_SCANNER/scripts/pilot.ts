/**
 * Pilot Test Script — Live Integration Validation
 *
 * CONSTRAINTS (Non-Negotiable):
 * 1. One route only: CAI (Cairo) → BER (Berlin)
 * 2. One baseline + one pilot location only
 * 3. 3 repetitions per location
 * 4. Evidence logging mandatory
 * 5. Mock mode remains default; live mode requires explicit flags
 * 6. All credentials server-side only
 *
 * Usage:
 *   ENABLE_LIVE_MODE=true LIVE_PROVIDER_NAME=authorized npm run pilot
 *
 * Output:
 *   - Comparison IDs
 *   - Evidence hashes
 *   - Matched results
 *   - Consistency validation (prices should be similar across runs)
 */

import { flightSearchSchema } from "@/lib/validation/flight-search-schema";
import { runComparison } from "@/lib/comparison/comparison-runner";

const ENABLE_LIVE_MODE = process.env.ENABLE_LIVE_MODE === "true";
const LIVE_PROVIDER_NAME = process.env.LIVE_PROVIDER_NAME || "";
const PILOT_EVIDENCE_LOGGING = process.env.PILOT_EVIDENCE_LOGGING !== "false";

const PILOT_ORIGIN = process.env.PILOT_ORIGIN_CODE || "CAI";
const PILOT_DESTINATION = process.env.PILOT_DESTINATION_CODE || "BER";
const PILOT_LOCATION_CODE = process.env.PILOT_LOCATION_CODE || "IN";
const PILOT_LOCATION_LABEL = process.env.PILOT_LOCATION_LABEL || "India";
const PILOT_DEPARTURE_DATE = process.env.PILOT_DEPARTURE_DATE || "2026-07-21";
const PILOT_RETURN_DATE = process.env.PILOT_RETURN_DATE || "2026-07-28";
const PILOT_CABIN_CLASS = (process.env.PILOT_CABIN_CLASS || "economy") as
  | "ECONOMY"
  | "PREMIUM_ECONOMY"
  | "BUSINESS"
  | "FIRST";
const PILOT_CURRENCY = process.env.PILOT_CURRENCY || "EUR";
const PILOT_REPETITIONS = parseInt(process.env.PILOT_REPETITIONS || "3", 10);

interface PilotResult {
  runNumber: number;
  location: string;
  comparisonId: string;
  evidenceHash: string;
  baselinePrice?: number;
  regionalPrice?: number;
  matchedCount: number;
  failedCount: number;
  duration: number;
  timestamp: string;
}

async function runPilotComparison(
  runNumber: number,
  location: string
): Promise<PilotResult> {
  const startTime = Date.now();
  const comparisonId = `pilot-run-${runNumber}-${location}-${Date.now()}`;

  // Create search request
  const searchRequest = flightSearchSchema.parse({
    originIata: PILOT_ORIGIN,
    destinationIata: PILOT_DESTINATION,
    departureDate: PILOT_DEPARTURE_DATE,
    returnDate: PILOT_RETURN_DATE,
    tripType: "ROUND_TRIP",
    adults: 1,
    cabinClass: PILOT_CABIN_CLASS,
    directOnly: false,
    preferredCurrency: PILOT_CURRENCY,
    maxResults: 5,
  });

  // Determine locations (always baseline + one pilot location)
  const selectedLocations =
    location === "BASELINE" ? ["BASELINE"] : ["BASELINE", PILOT_LOCATION_CODE];

  try {
    const result = await runComparison(
      comparisonId,
      searchRequest,
      selectedLocations,
      PILOT_CURRENCY
    );

    const duration = Date.now() - startTime;

    // Extract pricing info
    const matchedResults = result.matchedResults.filter((r) => r.status === "MATCHED");
    const baselinePrices = matchedResults
      .filter((r) => r.locationKey === "BASELINE")
      .map((r) => r.normalizedPrice || 0);
    const regionalPrices = matchedResults
      .filter((r) => r.locationKey === PILOT_LOCATION_CODE)
      .map((r) => r.normalizedPrice || 0);

    if (PILOT_EVIDENCE_LOGGING) {
      console.log(`\n[PILOT] Run #${runNumber} — ${location}`);
      console.log(`  Comparison ID: ${comparisonId}`);
      console.log(`  Evidence Hash: ${result.evidenceHash}`);
      console.log(`  Matched: ${matchedResults.length}`);
      console.log(`  Failed: ${Object.keys(result.errors).length}`);
      console.log(`  Duration: ${duration}ms`);
      if (baselinePrices.length > 0) console.log(`  Baseline Price: ${baselinePrices[0]} ${PILOT_CURRENCY}`);
      if (regionalPrices.length > 0)
        console.log(`  Regional Price: ${regionalPrices[0]} ${PILOT_CURRENCY}`);
    }

    return {
      runNumber,
      location,
      comparisonId,
      evidenceHash: result.evidenceHash,
      baselinePrice: baselinePrices[0] || undefined,
      regionalPrice: regionalPrices[0] || undefined,
      matchedCount: matchedResults.length,
      failedCount: Object.keys(result.errors).length,
      duration,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    const duration = Date.now() - startTime;
    const errorMsg = err instanceof Error ? err.message : "Unknown error";

    if (PILOT_EVIDENCE_LOGGING) {
      console.error(`\n[PILOT] Run #${runNumber} — ${location} FAILED`);
      console.error(`  Error: ${errorMsg}`);
      console.error(`  Duration: ${duration}ms`);
    }

    throw err;
  }
}

async function validateConsistency(results: PilotResult[]): Promise<void> {
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("CONSISTENCY VALIDATION");
  console.log("═══════════════════════════════════════════════════════════\n");

  // Group by location
  const byLocation = new Map<string, PilotResult[]>();
  for (const result of results) {
    if (!byLocation.has(result.location)) {
      byLocation.set(result.location, []);
    }
    byLocation.get(result.location)!.push(result);
  }

  for (const [location, locationResults] of byLocation.entries()) {
    console.log(`Location: ${location}`);
    console.log(`  Runs: ${locationResults.length}`);

    // Price consistency (if available)
    const prices = locationResults
      .filter((r) => r.baselinePrice !== undefined)
      .map((r) => r.baselinePrice!);

    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const variance = ((maxPrice - minPrice) / avgPrice * 100).toFixed(2);

      console.log(`  Price Variance: ${variance}% (min: ${minPrice}, max: ${maxPrice})`);
    }

    // Matched results consistency
    const matchedCounts = locationResults.map((r) => r.matchedCount);
    const minMatched = Math.min(...matchedCounts);
    const maxMatched = Math.max(...matchedCounts);
    console.log(`  Matched Results Range: ${minMatched}–${maxMatched}`);

    // Evidence hash consistency (should vary due to timestamp, but structure should be same)
    console.log(
      `  Evidence Hashes: ${locationResults.map((r) => r.evidenceHash.substring(0, 8)).join(", ")}`
    );
    console.log("");
  }
}

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("PILOT — Live Integration Test");
  console.log("═══════════════════════════════════════════════════════════\n");

  // Check preconditions
  if (!ENABLE_LIVE_MODE) {
    console.warn("⚠️  ENABLE_LIVE_MODE is false. Using MOCK mode instead of live.\n");
  }

  if (ENABLE_LIVE_MODE && !LIVE_PROVIDER_NAME) {
    console.error("❌ ENABLE_LIVE_MODE=true but LIVE_PROVIDER_NAME is not set");
    console.error(
      "   Set LIVE_PROVIDER_NAME to 'authorized' or another provider name.\n"
    );
    process.exit(1);
  }

  // Display pilot configuration
  console.log("PILOT CONFIGURATION:");
  console.log(`  Route: ${PILOT_ORIGIN} → ${PILOT_DESTINATION}`);
  console.log(
    `  Locations: BASELINE + ${PILOT_LOCATION_LABEL} (${PILOT_LOCATION_CODE})`
  );
  console.log(`  Dates: ${PILOT_DEPARTURE_DATE} → ${PILOT_RETURN_DATE}`);
  console.log(`  Currency: ${PILOT_CURRENCY}`);
  console.log(`  Cabin: ${PILOT_CABIN_CLASS}`);
  console.log(`  Repetitions: ${PILOT_REPETITIONS} per location`);
  console.log(`  Live Mode: ${ENABLE_LIVE_MODE ? "ENABLED" : "DISABLED (mock)"}`);
  console.log(`  Evidence Logging: ${PILOT_EVIDENCE_LOGGING ? "ENABLED" : "DISABLED"}\n`);

  // Run pilot comparisons
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`RUNNING ${PILOT_REPETITIONS * 2} COMPARISONS...`);
  console.log("═══════════════════════════════════════════════════════════");

  const allResults: PilotResult[] = [];

  try {
    // Baseline comparisons
    for (let i = 1; i <= PILOT_REPETITIONS; i++) {
      const result = await runPilotComparison(i, "BASELINE");
      allResults.push(result);
    }

    // Pilot location comparisons
    for (let i = PILOT_REPETITIONS + 1; i <= PILOT_REPETITIONS * 2; i++) {
      const result = await runPilotComparison(i, PILOT_LOCATION_CODE);
      allResults.push(result);
    }

    // Validate consistency
    await validateConsistency(allResults);

    // Summary
    console.log("═══════════════════════════════════════════════════════════");
    console.log("PILOT COMPLETE ✓");
    console.log("═══════════════════════════════════════════════════════════\n");

    console.log("SUMMARY:");
    console.log(`  Total Runs: ${allResults.length}`);
    console.log(`  Successful: ${allResults.filter((r) => r.matchedCount > 0).length}`);
    console.log(`  Failed: ${allResults.filter((r) => r.failedCount > 0).length}`);
    console.log(`  Total Duration: ${allResults.reduce((a, r) => a + r.duration, 0)}ms`);
    console.log("\nCOMPARISON IDS (for audit):");
    allResults.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.comparisonId} [${r.location}]`);
    });

    console.log("\nEVIDENCE HASHES (for integrity):");
    allResults.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.evidenceHash} [${r.location}]`);
    });
  } catch (err) {
    console.error("\n❌ PILOT FAILED");
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
