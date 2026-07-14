import { FlightOffer, MatchedOfferResult } from "../providers/types";

function isoStringToDate(dateString: string): Date {
  return new Date(dateString);
}

function timeWithinMinutes(a: Date, b: Date, minutes: number): boolean {
  const diff = Math.abs(a.getTime() - b.getTime());
  return diff <= minutes * 60 * 1000;
}

function segmentsMatch(
  seg1: FlightOffer["segments"][0],
  seg2: FlightOffer["segments"][0],
  toleranceMinutes: number = 30
): boolean {
  if (
    seg1.departureAirport !== seg2.departureAirport ||
    seg1.arrivalAirport !== seg2.arrivalAirport
  ) {
    return false;
  }

  const dep1 = isoStringToDate(seg1.departureTime);
  const dep2 = isoStringToDate(seg2.departureTime);
  if (!timeWithinMinutes(dep1, dep2, toleranceMinutes)) {
    return false;
  }

  const arr1 = isoStringToDate(seg1.arrivalTime);
  const arr2 = isoStringToDate(seg2.arrivalTime);
  if (!timeWithinMinutes(arr1, arr2, toleranceMinutes)) {
    return false;
  }

  return true;
}

function offerAncillaryMatch(a: FlightOffer, b: FlightOffer): boolean {
  return (
    (a.fareFamily || "") === (b.fareFamily || "") &&
    (a.checkedBaggage || "") === (b.checkedBaggage || "") &&
    (a.handLuggage || "") === (b.handLuggage || "") &&
    (a.refundability || "") === (b.refundability || "") &&
    (a.changeConditions || "") === (b.changeConditions || "")
  );
}

function segmentAirlineAndNumberMatch(
  seg1: FlightOffer["segments"][0],
  seg2: FlightOffer["segments"][0]
): boolean {
  const marketingMatch =
    (seg1.marketingAirline || seg1.airline) ===
    (seg2.marketingAirline || seg2.airline);
  const operatingMatch =
    (seg1.operatingAirline || seg1.airline) ===
    (seg2.operatingAirline || seg2.airline);
  const flightNumberMatch =
    (seg1.flightNumber || "") === (seg2.flightNumber || "") &&
    (seg1.operatingFlightNumber || seg1.flightNumber || "") ===
      (seg2.operatingFlightNumber || seg2.flightNumber || "");

  return marketingMatch && operatingMatch && flightNumberMatch;
}

export function matchOffers(
  baselineOffer: FlightOffer,
  regionalOffer: FlightOffer
): MatchedOfferResult {
  const sameSegmentCount =
    baselineOffer.segments.length === regionalOffer.segments.length;
  const sameCabin = baselineOffer.cabinClass === regionalOffer.cabinClass;

  if (
    baselineOffer.airline === regionalOffer.airline &&
    baselineOffer.stops === regionalOffer.stops &&
    sameCabin &&
    sameSegmentCount
  ) {
    const matches =
      baselineOffer.segments.length > 0 &&
      baselineOffer.segments.every((seg, i) =>
        segmentsMatch(seg, regionalOffer.segments[i], 30) &&
        segmentAirlineAndNumberMatch(seg, regionalOffer.segments[i])
      );

    if (matches && offerAncillaryMatch(baselineOffer, regionalOffer)) {
      return {
        baselineOfferId: baselineOffer.providerOfferId,
        regionalOfferId: regionalOffer.providerOfferId,
        confidence: "EXACT",
        reason:
          "Exact match: airline, flight numbers, segments, cabin, route, times, and fare conditions align",
      };
    }
  }

  if (
    baselineOffer.stops === regionalOffer.stops &&
    sameCabin &&
    sameSegmentCount
  ) {
    const matches =
      baselineOffer.segments.length > 0 &&
      baselineOffer.segments.every((seg, i) =>
        segmentsMatch(seg, regionalOffer.segments[i], 60)
      );

    if (matches) {
      return {
        baselineOfferId: baselineOffer.providerOfferId,
        regionalOfferId: regionalOffer.providerOfferId,
        confidence: "HIGH",
        reason:
          "High confidence: same route structure, cabin, and close times with minor carrier/fare differences",
      };
    }
  }

  if (
    sameCabin &&
    Math.abs(
      baselineOffer.totalDurationMinutes -
        regionalOffer.totalDurationMinutes
    ) < 120
  ) {
    return {
      baselineOfferId: baselineOffer.providerOfferId,
      regionalOfferId: regionalOffer.providerOfferId,
      confidence: "MEDIUM",
      reason: "Medium confidence: same cabin and similar duration (±2h)",
    };
  }

  return {
    baselineOfferId: baselineOffer.providerOfferId,
    regionalOfferId: regionalOffer.providerOfferId,
    confidence: "NOT_COMPARABLE",
    reason: "Offers differ in key attributes",
  };
}
