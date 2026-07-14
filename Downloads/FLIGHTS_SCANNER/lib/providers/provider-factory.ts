import { FlightProvider } from "./types";
import { MockFlightProvider } from "./mock-provider";
import { AuthorizedFlightProvider } from "./authorized-provider";

const PROVIDER_MODE = process.env.FLIGHT_PROVIDER_MODE || "mock";
const ENABLE_LIVE_MODE = process.env.ENABLE_LIVE_MODE === "true";
const LIVE_PROVIDER_NAME = process.env.LIVE_PROVIDER_NAME || "";

export function getFlightProvider(): FlightProvider {
  // Live mode routing (narrowly scoped pilot)
  if (ENABLE_LIVE_MODE && LIVE_PROVIDER_NAME) {
    if (LIVE_PROVIDER_NAME === "authorized" || PROVIDER_MODE === "authorized") {
      return new AuthorizedFlightProvider();
    }
    // Future: other provider integrations (amadeus, skyscanner, etc.)
    throw new Error(
      `Live provider "${LIVE_PROVIDER_NAME}" not yet implemented. Ensure ENABLE_LIVE_MODE credentials are configured.`
    );
  }

  // Mock mode (default)
  if (PROVIDER_MODE === "mock" || !ENABLE_LIVE_MODE) {
    return new MockFlightProvider();
  }

  if (PROVIDER_MODE === "authorized") {
    return new AuthorizedFlightProvider();
  }

  throw new Error(
    `Unknown flight provider mode: ${PROVIDER_MODE}. Use 'mock' or 'authorized'.`
  );
}

export function getAllProviders(): FlightProvider[] {
  return [getFlightProvider()];
}

export function isLiveModeEnabled(): boolean {
  return ENABLE_LIVE_MODE && LIVE_PROVIDER_NAME !== "";
}

export function getLiveProviderName(): string {
  return LIVE_PROVIDER_NAME;
}
