/**
 * Pilot Proxy Configuration
 *
 * Narrowly scoped live integration: ONE proxy, ONE location.
 * This layer enforces pilot constraints and isolates from production proxy config.
 *
 * PILOT CONSTRAINTS:
 * - Single approved proxy endpoint (LIVE_PROXY_HOST)
 * - Single pilot location (PILOT_LOCATION_CODE)
 * - All credentials server-side only
 * - Evidence logging mandatory
 */

const ENABLE_LIVE_MODE = process.env.ENABLE_LIVE_MODE === "true";
const LIVE_PROXY_HOST = process.env.LIVE_PROXY_HOST || "";
const LIVE_PROXY_API_KEY = process.env.LIVE_PROXY_API_KEY || "";

const PILOT_LOCATION_CODE = process.env.PILOT_LOCATION_CODE || "IN";
const PILOT_LOCATION_LABEL = process.env.PILOT_LOCATION_LABEL || "India";

export interface PilotProxyConfig {
  enabled: boolean;
  proxyHost: string;
  proxyApiKey: string;
  locationCode: string;
  locationLabel: string;
  isConfigured: boolean;
}

export function getPilotProxyConfig(): PilotProxyConfig {
  const isConfigured = ENABLE_LIVE_MODE && LIVE_PROXY_HOST !== "";

  return {
    enabled: ENABLE_LIVE_MODE,
    proxyHost: LIVE_PROXY_HOST,
    proxyApiKey: LIVE_PROXY_API_KEY,
    locationCode: PILOT_LOCATION_CODE,
    locationLabel: PILOT_LOCATION_LABEL,
    isConfigured,
  };
}

/**
 * Get proxy URL for pilot location (only ONE location supported).
 * @returns Proxy URL or empty string if live mode disabled
 */
export function getPilotProxyUrl(): string {
  const config = getPilotProxyConfig();

  if (!config.isConfigured) {
    return ""; // Mock mode or live mode not fully configured
  }

  // Format: https://proxy.example.com/verify?ip={ip}&location={location}&key={key}
  const url = new URL(config.proxyHost);
  if (!url.pathname.endsWith("/")) {
    url.pathname += "/";
  }

  // Add query parameters
  url.searchParams.set("location", config.locationCode);

  if (config.proxyApiKey) {
    url.searchParams.set("key", config.proxyApiKey);
  }

  return url.toString();
}

/**
 * Validate pilot proxy configuration.
 * @returns { valid: boolean, errors: string[] }
 */
export function validatePilotProxyConfig(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (ENABLE_LIVE_MODE) {
    if (!LIVE_PROXY_HOST) {
      errors.push("ENABLE_LIVE_MODE=true but LIVE_PROXY_HOST is empty");
    }
    if (!PILOT_LOCATION_CODE) {
      errors.push("PILOT_LOCATION_CODE is required");
    }
    if (!PILOT_LOCATION_LABEL) {
      errors.push("PILOT_LOCATION_LABEL is required");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Log pilot proxy configuration (redacts secrets).
 */
export function logPilotProxyConfig(): void {
  const pilotConfig = getPilotProxyConfig();

  if (!pilotConfig.enabled) {
    console.log("[PILOT] Live mode disabled; using mock proxy");
    return;
  }

  console.log("[PILOT] Live proxy configured:");
  console.log(`  Host: ${pilotConfig.proxyHost.replace(pilotConfig.proxyApiKey, "***")}`);
  console.log(`  Location: ${pilotConfig.locationLabel} (${pilotConfig.locationCode})`);
  console.log(`  Configured: ${pilotConfig.isConfigured}`);
}
