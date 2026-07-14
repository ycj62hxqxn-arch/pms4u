import { isIP } from "node:net";

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map((value) => Number.parseInt(value, 10));
  if (parts.length !== 4 || parts.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) {
    return true;
  }

  const [a, b] = parts;

  // loopback, private, link-local, carrier-grade NAT, documentation/reserved, multicast, experimental, unspecified
  if (a === 127) return true;
  if (a === 10) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 169 && b === 254) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a === 192 && b === 0) return true; // IETF protocol assignments (192.0.0.0/24)
  if (a === 198 && (b === 18 || b === 19)) return true;
  if (a === 198 && b === 51) return true; // TEST-NET-2
  if (a === 203 && b === 0) return true; // TEST-NET-3
  if (a === 0) return true;
  if (a === 255) return true;
  if (a >= 224) return true;

  return false;
}

function normalizeIPv6(value: string): string {
  const lower = value.toLowerCase();
  const zoneIndex = lower.indexOf("%");
  return zoneIndex > -1 ? lower.slice(0, zoneIndex) : lower;
}

function isPrivateIPv6(ip: string): boolean {
  const value = normalizeIPv6(ip);

  if (value === "::" || value === "::1") return true;
  if (value.startsWith("fe8") || value.startsWith("fe9") || value.startsWith("fea") || value.startsWith("feb")) {
    return true; // fe80::/10
  }
  if (value.startsWith("fc") || value.startsWith("fd")) return true; // fc00::/7 unique local
  if (value.startsWith("ff")) return true; // multicast
  if (value.startsWith("2001:db8:")) return true; // documentation
  if (value.startsWith("64:ff9b:")) return true; // IPv4/IPv6 translation prefix (non-public target space)

  // IPv4-mapped IPv6
  if (value.startsWith("::ffff:")) {
    const mapped = value.replace("::ffff:", "");
    return isPrivateIPv4(mapped);
  }

  return false;
}

export function isForbiddenIpAddress(address: string): boolean {
  const ipVersion = isIP(address);
  if (ipVersion === 4) return isPrivateIPv4(address);
  if (ipVersion === 6) return isPrivateIPv6(address);
  return true;
}

export function isForbiddenHostname(hostname: string): boolean {
  const host = hostname.trim().toLowerCase();
  if (!host) return true;

  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".localdomain")) return true;
  if (host === "local" || host.endsWith(".local")) return true;
  if (host === "metadata.google.internal") return true;
  if (host === "metadata" || host.endsWith(".internal")) return true;
  if (host === "169.254.169.254") return true;

  const ipVersion = isIP(host);
  if (ipVersion > 0) {
    return isForbiddenIpAddress(host);
  }

  return false;
}
