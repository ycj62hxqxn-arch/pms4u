export type TripType = "ONE_WAY" | "ROUND_TRIP";
export type CabinClass = "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";

export type ComparisonLocationKey =
  | "BASELINE"
  | "INDIA"
  | "SOUTH_AFRICA"
  | "MEXICO"
  | "BRAZIL"
  | "THAILAND"
  | "PHILIPPINES"
  | "VIETNAM"
  | "COLOMBIA"
  | "INDONESIA"
  | "MALAYSIA"
  | "CUSTOM";

export interface FlightSearchRequest {
  originIata: string;
  destinationIata: string;
  departureDate: string;
  returnDate?: string;
  tripType: TripType;
  adults: number;
  cabinClass: CabinClass;
  directOnly: boolean;
  preferredCurrency: string;
  maxResults: number;
}

export interface FlightSegment {
  airline: string;
  marketingAirline?: string;
  operatingAirline?: string;
  flightNumber?: string;
  operatingFlightNumber?: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
}

export interface FlightOffer {
  providerOfferId: string;
  airline: string;
  segments: FlightSegment[];
  totalDurationMinutes: number;
  stops: number;
  fareClass: string;
  fareFamily?: string;
  cabinClass: CabinClass;
  handLuggage?: string;
  checkedBaggage?: string;
  refundability?: string;
  changeConditions?: string;
  baseFare: number;
  taxes: number;
  bookingFees: number;
  paymentFees?: number;
  totalPrice: number;
  totalPayablePrice?: number;
  hasUnknownCheckoutFees?: boolean;
  currency: string;
  originalCurrency: string;
  provider: string;
  marketCountry: string;
  pointOfSale: string;
  effectiveIpCountry?: string;
  retrievedAt: string;
  deepLink?: string;
}

export interface MarketContext {
  countryCode: string;
  currency: string;
  locale: string;
  proxyUrl?: string;
  pointOfSale: string;
  requestId: string;
  locationKey: ComparisonLocationKey;
}

export interface IpVerificationResult {
  effectiveIp?: string;
  detectedCountryCode?: string;
  requestedProxyCountry?: string;
  proxyApplied: boolean;
  verifiedAt: string;
  status: "VERIFIED" | "INVALID_LOCATION" | "FAILED";
  warning?: string;
}

export interface ProviderHealth {
  provider: string;
  status: "UP" | "DEGRADED" | "DOWN";
  checkedAt: string;
  details?: string;
}

export interface ProviderRequestMeta {
  requestId: string;
  provider: string;
  locationKey: ComparisonLocationKey;
  startedAt: string;
  completedAt?: string;
  status: "RUNNING" | "SUCCESS" | "FAILED";
  errorCode?: string;
  errorMessage?: string;
  retries: number;
}

export interface FlightProvider {
  readonly name: string;
  searchFlights(
    request: FlightSearchRequest,
    context: MarketContext
  ): Promise<FlightOffer[]>;
  healthCheck(): Promise<ProviderHealth>;
}

export type MatchConfidence = "EXACT" | "HIGH" | "MEDIUM" | "NOT_COMPARABLE";

export interface MatchedOfferResult {
  baselineOfferId: string;
  regionalOfferId: string;
  confidence: MatchConfidence;
  reason: string;
}

export interface PriceComparisonRow {
  locationKey: ComparisonLocationKey;
  locationLabel: string;
  status: "COMPLETED" | "FAILED" | "INVALID_LOCATION" | "PARTIAL";
  verifiedIpCountry?: string;
  requestedCountry?: string;
  offer?: FlightOffer;
  baselineOffer?: FlightOffer;
  matchConfidence: MatchConfidence;
  normalizedCurrency: string;
  normalizedTotalPrice?: number;
  baselineNormalizedPrice?: number;
  difference?: number;
  differencePercent?: number;
  pricingLabel: "CHEAPER" | "SAME_PRICE" | "MORE_EXPENSIVE" | "NOT_COMPARABLE";
  checkedAt: string;
  warning?: string;
}

export interface ComparisonSummary {
  baselineFinalPrice?: number;
  lowestFinalPrice?: number;
  cheapestVerifiedLocation?: string;
  potentialSaving?: number;
  savingPercentage?: number;
  validLocations: number;
  invalidOrFailedLocations: number;
}
