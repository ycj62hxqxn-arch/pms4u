export function redactUrl(url: string | undefined): string {
  if (!url) return "(not set)";
  try {
    const parsed = new URL(url);
    const hostRedacted = parsed.hostname ? "***" : "";
    const portRedacted = parsed.port ? ":***" : "";
    const queryRedacted = parsed.search ? "?***" : "";
    return `${parsed.protocol}//${hostRedacted}${portRedacted}${queryRedacted}`;
  } catch {
    return "(invalid url)";
  }
}

export function redactProxyCredentials(
  urls: Record<string, string | undefined>
): Record<string, string> {
  const redacted: Record<string, string> = {};
  for (const [key, value] of Object.entries(urls)) {
    redacted[key] = redactUrl(value);
  }
  return redacted;
}
