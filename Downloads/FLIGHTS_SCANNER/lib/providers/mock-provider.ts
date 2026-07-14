import {
  FlightProvider,
  FlightOffer,
  FlightSearchRequest,
  MarketContext,
  ProviderHealth,
} from "./types";

function generateMockOffers(
  request: FlightSearchRequest,
  context: MarketContext
): FlightOffer[] {
  const seedInput = `${request.originIata}-${request.destinationIata}-${context.countryCode}-${request.departureDate}`;
  const seed = Array.from(seedInput).reduce((acc, ch, idx) => {
    return (acc + ch.charCodeAt(0) * (idx + 1)) % 100000;
  }, 0);
  const basePrice = 150 + (seed * 73) % 500;
  const variance = (seed * 137) % 100 - 50;
  const adjustedPrice = Math.max(50, basePrice + variance);
  const taxes = Math.round(adjustedPrice * 0.15);
  const bookingFees = Math.round(adjustedPrice * 0.05);
  const paymentFees = Math.round(adjustedPrice * 0.01);
  const totalPrice = adjustedPrice + taxes + bookingFees;
  const totalPayablePrice = totalPrice + paymentFees;

  const now = new Date();
  return [
    {
      providerOfferId: `mock-${Math.random().toString(36).slice(2)}`,
      airline: "MockAir",
      segments: [
        {
          airline: "MockAir",
          marketingAirline: "MockAir",
          operatingAirline: "MockAir",
          flightNumber: `MA${1000 + (seed % 9000)}`,
          operatingFlightNumber: `MA${1000 + (seed % 9000)}`,
          departureAirport: request.originIata,
          arrivalAirport: request.destinationIata,
          departureTime: new Date(
            request.departureDate + "T08:00:00Z"
          ).toISOString(),
          arrivalTime: new Date(
            request.departureDate + "T14:30:00Z"
          ).toISOString(),
          durationMinutes: 390,
        },
      ],
      totalDurationMinutes: 390,
      stops: 0,
      fareClass: "ECONOMY",
      fareFamily: "LIGHT",
      cabinClass: "ECONOMY",
      handLuggage: "7 kg",
      checkedBaggage: "20 kg",
      refundability: "Non-refundable",
      changeConditions: "Not allowed",
      baseFare: adjustedPrice,
      taxes,
      bookingFees,
      paymentFees,
      totalPrice,
      totalPayablePrice,
      hasUnknownCheckoutFees: false,
      currency: context.currency,
      originalCurrency: context.currency,
      provider: "MockFlightProvider",
      marketCountry: context.countryCode,
      pointOfSale: context.pointOfSale,
      effectiveIpCountry: context.countryCode,
      retrievedAt: now.toISOString(),
      deepLink: `https://mock-provider.example.com/booking?id=mock-${Math.random()
        .toString(36)
        .slice(2)}`,
    },
  ];
}

export class MockFlightProvider implements FlightProvider {
  name = "MockFlightProvider";

  async searchFlights(
    request: FlightSearchRequest,
    context: MarketContext
  ): Promise<FlightOffer[]> {
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 700));
    return generateMockOffers(request, context);
  }

  async healthCheck(): Promise<ProviderHealth> {
    return {
      provider: "MockFlightProvider",
      status: "UP",
      checkedAt: new Date().toISOString(),
      details: "Mock provider always available",
    };
  }
}
