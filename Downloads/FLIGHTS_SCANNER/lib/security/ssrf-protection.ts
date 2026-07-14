const ALLOWED_PROXY_HOSTS = process.env.ALLOWED_PROXY_HOSTS?.split(",") || [];
const BLOCKED_RANGES = [
  /^127\./,
  /^192\.168\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^::1$/,
  /^fc00:/,
  /^fe80:/,
];

export function validateProxyUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!parsed.protocol || !["http:", "https:", "socks:", "socks5:"].includes(parsed.protocol)) {
      return false;
    }
    const hostname = parsed.hostname;

    if (!hostname) return false;

    for (const range of BLOCKED_RANGES) {
      if (range.test(hostname)) {
        return false;
      }
    }

    if (ALLOWED_PROXY_HOSTS.length === 0) {
      return false;
    }

    return ALLOWED_PROXY_HOSTS.some((allowed) => allowed.trim() === hostname);
  } catch {
    return false;
  }
}
