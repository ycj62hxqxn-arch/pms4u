import { describe, it, expect } from "vitest";
import { matchOffers } from "@/lib/matching/match-offers";
import { FlightOffer } from "@/lib/providers/types";

describe("matchOffers", () => {
  const baselineOffer: FlightOffer = {
    providerOfferId: "BASELINE-001",
    airline: "AIRLINE A",
    segments: [
      {
        airline: "AA",
        flightNumber: "AA100",
        departureAirport: "LHR",
        arrivalAirport: "JFK",
        departureTime: "2025-06-15T10:00:00Z",
        arrivalTime: "2025-06-15T14:00:00Z",
        durationMinutes: 480,
      },
    ],
    totalDurationMinutes: 480,
    stops: 0,
    fareClass: "ECONOMY",
    cabinClass: "ECONOMY",
    baseFare: 300,
    taxes: 75,
    bookingFees: 15,
    totalPrice: 390,
    currency: "USD",
    originalCurrency: "USD",
    provider: "mock",
    marketCountry: "US",
    pointOfSale: "US",
    retrievedAt: new Date().toISOString(),
  };

  it("should return EXACT match for identical flights within 30min", () => {
    const regionalOffer: FlightOffer = { ...baselineOffer };
    const result = matchOffers(baselineOffer, regionalOffer);

    expect(result.confidence).toBe("EXACT");
  });

  it("should return HIGH match for same route/cabin, different airline within 60min", () => {
    const regionalOffer: FlightOffer = {
      ...baselineOffer,
      providerOfferId: "REGIONAL-001",
      airline: "AIRLINE B",
      segments: [
        {
          ...baselineOffer.segments[0],
          airline: "BB",
          flightNumber: "BB200",
          departureTime: "2025-06-15T10:20:00Z",
          arrivalTime: "2025-06-15T14:20:00Z",
        },
      ],
    };

    const result = matchOffers(baselineOffer, regionalOffer);

    expect(result.confidence).toBe("HIGH");
  });

  it("should return MEDIUM match for same cabin, similar duration within 2h", () => {
    const regionalOffer: FlightOffer = {
      ...baselineOffer,
      providerOfferId: "REGIONAL-002",
      segments: [
        {
          ...baselineOffer.segments[0],
          departureTime: "2025-06-15T11:00:00Z",
          arrivalTime: "2025-06-15T15:30:00Z",
          durationMinutes: 510,
        },
      ],
      totalDurationMinutes: 510,
    };

    const result = matchOffers(baselineOffer, regionalOffer);

    expect(result.confidence).toBe("MEDIUM");
  });

  it("should return NOT_COMPARABLE for significantly different flights", () => {
    const regionalOffer: FlightOffer = {
      ...baselineOffer,
      providerOfferId: "REGIONAL-003",
      segments: [
        {
          airline: "CC",
          flightNumber: "CC300",
          departureAirport: "LHR",
          arrivalAirport: "LAX",
          departureTime: "2025-06-15T08:00:00Z",
          arrivalTime: "2025-06-15T18:00:00Z",
          durationMinutes: 600,
        },
      ],
      totalDurationMinutes: 600,
    };

    const result = matchOffers(baselineOffer, regionalOffer);

    expect(result.confidence).toBe("NOT_COMPARABLE");
  });

  it("should handle flights with multiple segments", () => {
    const baselineMultiSegment: FlightOffer = {
      ...baselineOffer,
      segments: [
        {
          airline: "AA",
          flightNumber: "AA100",
          departureAirport: "LHR",
          arrivalAirport: "ORD",
          departureTime: "2025-06-15T10:00:00Z",
          arrivalTime: "2025-06-15T14:00:00Z",
          durationMinutes: 480,
        },
        {
          airline: "AA",
          flightNumber: "AA200",
          departureAirport: "ORD",
          arrivalAirport: "JFK",
          departureTime: "2025-06-15T15:00:00Z",
          arrivalTime: "2025-06-15T17:00:00Z",
          durationMinutes: 120,
        },
      ],
      totalDurationMinutes: 600,
      stops: 1,
    };

    const regionalMultiSegment: FlightOffer = {
      ...baselineMultiSegment,
      providerOfferId: "REGIONAL-004",
    };

    const result = matchOffers(baselineMultiSegment, regionalMultiSegment);

    expect(result.confidence).toBe("EXACT");
  });
});
