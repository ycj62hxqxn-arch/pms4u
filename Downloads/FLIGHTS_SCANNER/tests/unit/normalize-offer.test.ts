import { describe, it, expect } from "vitest";
import { normalizeOffer } from "@/lib/matching/normalize-offer";
import { FlightOffer } from "@/lib/providers/types";

describe("normalizeOffer", () => {
  const mockOffer: FlightOffer = {
    providerOfferId: "TEST-001",
    airline: "TEST AIRWAYS",
    segments: [
      {
        airline: "TEST",
        flightNumber: "TA100",
        departureAirport: "LHR",
        arrivalAirport: "CDG",
        departureTime: "2025-06-15T10:00:00Z",
        arrivalTime: "2025-06-15T12:00:00Z",
        durationMinutes: 120,
      },
    ],
    totalDurationMinutes: 120,
    stops: 0,
    fareClass: "ECONOMY",
    cabinClass: "ECONOMY",
    baseFare: 100,
    taxes: 25,
    bookingFees: 5,
    totalPrice: 130,
    currency: "USD",
    originalCurrency: "USD",
    provider: "mock",
    marketCountry: "US",
    pointOfSale: "US",
    retrievedAt: new Date().toISOString(),
  };

  it("should normalize offer with 1:1 exchange rate", () => {
    const normalized = normalizeOffer(mockOffer, 1.0, "USD");

    expect(normalized.normalizedPrice).toBe(130);
    expect(normalized.normalizedCurrency).toBe("USD");
    expect(normalized.exchangeRate).toBe(1.0);
    expect(normalized.baseFareNormalized).toBe(100);
    expect(normalized.taxesNormalized).toBe(25);
    expect(normalized.bookingFeesNormalized).toBe(5);
  });

  it("should normalize offer with exchange rate", () => {
    const normalized = normalizeOffer(mockOffer, 0.92, "EUR");

    expect(normalized.normalizedPrice).toBeCloseTo(119.6, 1);
    expect(normalized.normalizedCurrency).toBe("EUR");
    expect(normalized.exchangeRate).toBe(0.92);
    expect(normalized.baseFareNormalized).toBeCloseTo(92, 0);
  });

  it("should handle zero exchange rate as 1.0", () => {
    const normalized = normalizeOffer(mockOffer, 0, "USD");

    expect(normalized.normalizedPrice).toBe(130);
    expect(normalized.exchangeRate).toBe(1.0);
  });

  it("should preserve original offer reference", () => {
    const normalized = normalizeOffer(mockOffer, 1.0, "USD");

    expect(normalized.original).toBe(mockOffer);
  });
});
