import { z } from "zod";
import {
  FlightOffer,
  FlightProvider,
  FlightSearchRequest,
  MarketContext,
  ProviderHealth,
} from "./types";
import { ProviderIntegrationError } from "./provider-errors";
import { runProviderCall, withRetry } from "./provider-runtime";

const providerOfferSchema = z.object({
  providerOfferId: z.string(),
  airline: z.string(),
  segments: z.array(
    z.object({
      airline: z.string(),
      departureAirport: z.string(),
      arrivalAirport: z.string(),
      departureTime: z.string(),
      arrivalTime: z.string(),
      durationMinutes: z.number(),
      flightNumber: z.string().optional(),
    })
  ),
  totalDurationMinutes: z.number(),
  stops: z.number(),
  fareClass: z.string(),
  cabinClass: z.enum(["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"]),
  baseFare: z.number(),
  taxes: z.number(),
  bookingFees: z.number(),
  totalPrice: z.number(),
  currency: z.string(),
  originalCurrency: z.string(),
  provider: z.string(),
  marketCountry: z.string(),
  pointOfSale: z.string(),
  retrievedAt: z.string(),
});

export class AuthorizedFlightProvider implements FlightProvider {
  readonly name = "AuthorizedFlightProvider";

  private get requiredConfiguration() {
    return {
      apiKey: process.env.AUTHORIZED_FLIGHT_API_KEY,
      baseUrl: process.env.AUTHORIZED_FLIGHT_API_BASE_URL,
    };
  }

  private ensureConfigured() {
    const { apiKey, baseUrl } = this.requiredConfiguration;
    if (!apiKey || !baseUrl) {
      throw new ProviderIntegrationError({
        code: "PROVIDER_NOT_CONFIGURED",
        message:
          "Authorized provider is not configured. Set AUTHORIZED_FLIGHT_API_KEY and AUTHORIZED_FLIGHT_API_BASE_URL.",
        retryable: false,
        provider: this.name,
      });
    }
  }

  async searchFlights(
    request: FlightSearchRequest,
    context: MarketContext
  ): Promise<FlightOffer[]> {
    this.ensureConfigured();

    const startedAt = Date.now();

    // Boundary implementation only:
    // The concrete endpoint contract must be implemented from official provider docs.
    // No unsupported endpoint is hard-coded here.
    return runProviderCall(async () => {
      const offers = await withRetry(
        async () => {
          // Placeholder boundary for approved provider integration.
          // Replace with official SDK/client calls once credentials + contract are available.
          throw new ProviderIntegrationError({
            code: "PROVIDER_UNAVAILABLE",
            message:
              "Authorized provider boundary is configured but no official endpoint implementation is attached yet.",
            retryable: false,
            provider: this.name,
          });
        },
        {
          retries: Number(process.env.PROVIDER_RETRIES || 2),
          timeoutMs: Number(process.env.PROVIDER_TIMEOUT_MS || 7000),
          providerName: this.name,
        }
      );

      const parsed = z.array(providerOfferSchema).safeParse(offers);
      if (!parsed.success) {
        throw new ProviderIntegrationError({
          code: "PROVIDER_BAD_RESPONSE",
          message: "Provider response failed schema validation",
          retryable: false,
          provider: this.name,
        });
      }

      const latencyMs = Date.now() - startedAt;
      void latencyMs;
      void request;
      void context;

      return parsed.data as FlightOffer[];
    });
  }

  async healthCheck(): Promise<ProviderHealth> {
    const configured =
      !!process.env.AUTHORIZED_FLIGHT_API_KEY &&
      !!process.env.AUTHORIZED_FLIGHT_API_BASE_URL;

    return {
      provider: this.name,
      status: configured ? "DEGRADED" : "DOWN",
      checkedAt: new Date().toISOString(),
      details: configured
        ? "Configured. Endpoint contract not attached yet."
        : "Missing AUTHORIZED_FLIGHT_API_KEY or AUTHORIZED_FLIGHT_API_BASE_URL",
    };
  }
}
