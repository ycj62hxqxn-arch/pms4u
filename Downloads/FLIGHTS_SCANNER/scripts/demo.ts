import { runComparison } from "../lib/comparison/comparison-runner";
import { FlightSearchRequest } from "../lib/providers/types";

async function main() {
  process.env.FLIGHT_PROVIDER_MODE = "mock";
  process.env.NETWORK_MODE = "mock";

  const today = new Date();
  const departure = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
  const ret = new Date(departure.getTime() + 7 * 24 * 60 * 60 * 1000);
  const asDate = (d: Date) => d.toISOString().slice(0, 10);

  const comparisonId = `demo-${Date.now()}`;

  const searchRequest: FlightSearchRequest = {
    originIata: "CAI",
    destinationIata: "BER",
    departureDate: asDate(departure),
    returnDate: asDate(ret),
    tripType: "ROUND_TRIP",
    adults: 1,
    cabinClass: "ECONOMY",
    directOnly: false,
    preferredCurrency: "EUR",
    maxResults: 10,
  };

  const selectedLocations = ["BASELINE", "INDIA", "BRAZIL", "THAILAND"];

  const result = await runComparison(
    comparisonId,
    searchRequest,
    selectedLocations,
    "EUR"
  );

  const baseline = result.matchedResults.find((r) => r.locationKey === "BASELINE");
  const comparable = result.matchedResults.filter(
    (r) =>
      r.status === "MATCHED" &&
      (r.matchConfidence === "EXACT" || r.matchConfidence === "HIGH")
  );
  const cheapest = comparable
    .filter((r) => r.locationKey !== "BASELINE")
    .sort((a, b) => (a.normalizedPrice || Infinity) - (b.normalizedPrice || Infinity))[0];

  const baselinePrice = baseline?.normalizedPrice ?? 0;
  const cheapestPrice = cheapest?.normalizedPrice ?? baselinePrice;
  const savingPct = baselinePrice > 0 ? ((baselinePrice - cheapestPrice) / baselinePrice) * 100 : 0;

  console.log("SIMULATED DATA — NOT LIVE FARES");
  console.log(`Comparison ID: ${result.comparisonId}`);
  console.log(`Baseline price: ${baselinePrice.toFixed(2)} EUR`);
  console.log(`Cheapest simulated location: ${cheapest?.locationLabel || "N/A"}`);
  console.log(`Saving percentage: ${savingPct.toFixed(2)}%`);
  console.log(`Evidence hash: ${result.evidenceHash}`);
}

main().catch((error) => {
  console.error("Demo failed:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
