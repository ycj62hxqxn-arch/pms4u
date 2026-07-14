import { FlightOffer } from "../providers/types";

export interface NormalizedFlightOffer {
  original: FlightOffer;
  normalizedPrice: number;
  normalizedCurrency: string;
  exchangeRate: number;
  baseFareNormalized: number;
  taxesNormalized: number;
  bookingFeesNormalized: number;
  paymentFeesNormalized?: number;
  usesTotalPayablePrice: boolean;
  hasUnknownCheckoutFees: boolean;
}

export function normalizeOffer(
  offer: FlightOffer,
  exchangeRate: number,
  targetCurrency: string
): NormalizedFlightOffer {
  const exchangeRateValue = exchangeRate || 1.0;
  const totalReference = offer.totalPayablePrice ?? offer.totalPrice;
  return {
    original: offer,
    normalizedPrice: Math.round(totalReference * exchangeRateValue * 100) / 100,
    normalizedCurrency: targetCurrency,
    exchangeRate: exchangeRateValue,
    baseFareNormalized:
      Math.round(offer.baseFare * exchangeRateValue * 100) / 100,
    taxesNormalized: Math.round(offer.taxes * exchangeRateValue * 100) / 100,
    bookingFeesNormalized:
      Math.round(offer.bookingFees * exchangeRateValue * 100) / 100,
    paymentFeesNormalized:
      typeof offer.paymentFees === "number"
        ? Math.round(offer.paymentFees * exchangeRateValue * 100) / 100
        : undefined,
    usesTotalPayablePrice: typeof offer.totalPayablePrice === "number",
    hasUnknownCheckoutFees: !!offer.hasUnknownCheckoutFees,
  };
}
