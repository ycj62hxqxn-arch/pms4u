import * as dns from "node:dns/promises";
import { Buffer } from "node:buffer";

import { isForbiddenHostname, isForbiddenIpAddress } from "./network";

type SafeFetchOptions = {
  maxBytes: number;
  timeoutMs: number;
  maxRedirects: number;
  allowedMimeTypes: RegExp[];
  resolveHost?: (hostname: string) => Promise<Array<{ address: string }>>;
};

type SafeFetchSuccess = {
  ok: true;
  contentType: string;
  finalUrl: string;
  bytes: number;
  body: Buffer;
};

type SafeFetchFailure = {
  ok: false;
  code:
    | "INVALID_URL"
    | "INVALID_PROTOCOL"
    | "FORBIDDEN_HOST"
    | "DNS_RESOLVE_FAILED"
    | "FORBIDDEN_IP"
    | "REDIRECT_LIMIT"
    | "INVALID_REDIRECT"
    | "FETCH_FAILED"
    | "TIMEOUT"
    | "RESPONSE_TOO_LARGE"
    | "INVALID_CONTENT_TYPE"
    | "UPSTREAM_ERROR";
  message: string;
  status?: number;
};

export type SafeFetchResult = SafeFetchSuccess | SafeFetchFailure;

export function asSafeFetchFailure(result: SafeFetchResult): SafeFetchFailure {
  if (result.ok) {
    throw new Error("Expected safe-fetch failure result.");
  }
  return result as SafeFetchFailure;
}

function fail(code: SafeFetchFailure["code"], message: string, status?: number): SafeFetchFailure {
  return { ok: false, code, message, status };
}

function isAllowedMime(value: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(value));
}

async function validateHostResolution(
  url: URL,
  resolveHost?: (hostname: string) => Promise<Array<{ address: string }>>
): Promise<SafeFetchFailure | null> {
  const host = url.hostname.trim();

  if (isForbiddenHostname(host)) {
    return fail("FORBIDDEN_HOST", "Target hostname is not allowed.");
  }

  const directIp = host;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(directIp) || directIp.includes(":")) {
    if (isForbiddenIpAddress(directIp)) {
      return fail("FORBIDDEN_IP", "Target IP address is not allowed.");
    }
    return null;
  }

  try {
    const records = resolveHost
      ? await resolveHost(host)
      : await dns.lookup(host, { all: true, verbatim: true });
    if (!records || records.length === 0) {
      return fail("DNS_RESOLVE_FAILED", "Hostname could not be resolved.");
    }

    for (const record of records) {
      if (isForbiddenIpAddress(record.address)) {
        return fail("FORBIDDEN_IP", "Resolved IP address is not allowed.");
      }
    }

    return null;
  } catch {
    return fail("DNS_RESOLVE_FAILED", "Hostname resolution failed.");
  }
}

export async function safeFetchBinary(input: string, options: SafeFetchOptions): Promise<SafeFetchResult> {
  let currentUrl: URL;
  try {
    currentUrl = new URL(input);
  } catch {
    return fail("INVALID_URL", "URL is invalid.");
  }

  if (currentUrl.protocol !== "https:") {
    return fail("INVALID_PROTOCOL", "Only HTTPS URLs are allowed.");
  }

  let redirects = 0;

  while (true) {
    const hostCheck = await validateHostResolution(currentUrl, options.resolveHost);
    if (hostCheck) return hostCheck;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs);

    let response: Response;
    try {
      response = await fetch(currentUrl.toString(), {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          Accept: "image/*,video/*;q=0.9,*/*;q=0.1",
        },
      });
    } catch (error) {
      clearTimeout(timeout);
      if (error instanceof Error && error.name === "AbortError") {
        return fail("TIMEOUT", "Upstream request timed out.");
      }
      return fail("FETCH_FAILED", "Upstream request failed.");
    } finally {
      clearTimeout(timeout);
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        return fail("INVALID_REDIRECT", "Redirect response missing location header.", response.status);
      }

      redirects += 1;
      if (redirects > options.maxRedirects) {
        return fail("REDIRECT_LIMIT", "Redirect limit exceeded.", response.status);
      }

      let nextUrl: URL;
      try {
        nextUrl = new URL(location, currentUrl);
      } catch {
        return fail("INVALID_REDIRECT", "Redirect location is invalid.", response.status);
      }

      if (nextUrl.protocol !== "https:") {
        return fail("INVALID_PROTOCOL", "Redirect target must be HTTPS.", response.status);
      }

      currentUrl = nextUrl;
      continue;
    }

    if (!response.ok) {
      return fail("UPSTREAM_ERROR", `Upstream returned status ${response.status}.`, response.status);
    }

    const contentTypeRaw = (response.headers.get("content-type") ?? "").toLowerCase();
    const contentType = contentTypeRaw.split(";")[0].trim();
    if (!isAllowedMime(contentType, options.allowedMimeTypes)) {
      return fail("INVALID_CONTENT_TYPE", `Unsupported content type: ${contentType || "unknown"}.`, response.status);
    }

    const contentLength = Number.parseInt(response.headers.get("content-length") ?? "", 10);
    if (Number.isFinite(contentLength) && contentLength > options.maxBytes) {
      return fail("RESPONSE_TOO_LARGE", "Upstream response exceeds allowed size.", response.status);
    }

    if (!response.body) {
      return fail("FETCH_FAILED", "Upstream response body is empty.", response.status);
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      total += value.byteLength;
      if (total > options.maxBytes) {
        try {
          reader.cancel();
        } catch {
          // no-op
        }
        return fail("RESPONSE_TOO_LARGE", "Upstream response exceeds allowed size.", response.status);
      }
      chunks.push(value);
    }

    return {
      ok: true,
      contentType,
      finalUrl: currentUrl.toString(),
      bytes: total,
      body: Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))),
    };
  }
}
