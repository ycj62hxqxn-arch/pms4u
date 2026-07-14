import { ComparisonLocationKey } from "../providers/types";

export interface ProxyEndpoint {
  locationKey: ComparisonLocationKey;
  label: string;
  countryCode: string;
  envVar: string;
}

export const PROXY_ENDPOINTS: ProxyEndpoint[] = [
  {
    locationKey: "INDIA",
    label: "India",
    countryCode: "IN",
    envVar: "PROXY_INDIA_URL",
  },
  {
    locationKey: "SOUTH_AFRICA",
    label: "South Africa",
    countryCode: "ZA",
    envVar: "PROXY_SOUTH_AFRICA_URL",
  },
  {
    locationKey: "MEXICO",
    label: "Mexico",
    countryCode: "MX",
    envVar: "PROXY_MEXICO_URL",
  },
  {
    locationKey: "BRAZIL",
    label: "Brazil",
    countryCode: "BR",
    envVar: "PROXY_BRAZIL_URL",
  },
  {
    locationKey: "THAILAND",
    label: "Thailand",
    countryCode: "TH",
    envVar: "PROXY_THAILAND_URL",
  },
  {
    locationKey: "PHILIPPINES",
    label: "Philippines",
    countryCode: "PH",
    envVar: "PROXY_PHILIPPINES_URL",
  },
  {
    locationKey: "VIETNAM",
    label: "Vietnam",
    countryCode: "VN",
    envVar: "PROXY_VIETNAM_URL",
  },
  {
    locationKey: "COLOMBIA",
    label: "Colombia",
    countryCode: "CO",
    envVar: "PROXY_COLOMBIA_URL",
  },
  {
    locationKey: "INDONESIA",
    label: "Indonesia",
    countryCode: "ID",
    envVar: "PROXY_INDONESIA_URL",
  },
  {
    locationKey: "MALAYSIA",
    label: "Malaysia",
    countryCode: "MY",
    envVar: "PROXY_MALAYSIA_URL",
  },
];

export function getProxyUrlForLocation(
  locationKey: ComparisonLocationKey
): string | undefined {
  if (locationKey === "BASELINE") {
    return undefined;
  }
  const endpoint = PROXY_ENDPOINTS.find((e) => e.locationKey === locationKey);
  if (!endpoint) return undefined;
  return process.env[endpoint.envVar];
}

export function getLocationLabel(
  locationKey: ComparisonLocationKey
): string {
  if (locationKey === "BASELINE") return "Baseline (No Proxy)";
  const endpoint = PROXY_ENDPOINTS.find((e) => e.locationKey === locationKey);
  return endpoint?.label || locationKey;
}

export function getLocationCountryCode(
  locationKey: ComparisonLocationKey
): string | undefined {
  if (locationKey === "BASELINE") return undefined;
  const endpoint = PROXY_ENDPOINTS.find((e) => e.locationKey === locationKey);
  return endpoint?.countryCode;
}
