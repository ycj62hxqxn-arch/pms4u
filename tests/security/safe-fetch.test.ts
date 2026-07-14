import { describe, expect, it, vi } from "vitest";
import { safeFetchBinary, type SafeFetchResult } from "../../lib/security/safe-fetch";

function expectFailure(result: SafeFetchResult): Extract<SafeFetchResult, { ok: false }> {
  if (result.ok) throw new Error("expected failure");
  return result as Extract<SafeFetchResult, { ok: false }>;
}

describe("security/safe-fetch", () => {
  it("blocks localhost URL", async () => {
    const result = await safeFetchBinary("https://localhost/image.png", {
      maxBytes: 1024,
      timeoutMs: 1000,
      maxRedirects: 1,
      allowedMimeTypes: [/^image\//],
    });

    const failure = expectFailure(result);
    expect(failure.code).toBe("FORBIDDEN_HOST");
  });

  it("blocks metadata URL", async () => {
    const result = await safeFetchBinary("https://metadata.google.internal/token", {
      maxBytes: 1024,
      timeoutMs: 1000,
      maxRedirects: 1,
      allowedMimeTypes: [/^image\//],
    });

    const failure = expectFailure(result);
    expect(failure.code).toBe("FORBIDDEN_HOST");
  });

  it("blocks ipv6 loopback URL", async () => {
    const result = await safeFetchBinary("https://[::1]/image.png", {
      maxBytes: 1024,
      timeoutMs: 1000,
      maxRedirects: 1,
      allowedMimeTypes: [/^image\//],
    });

    const failure = expectFailure(result);
    expect(failure.code).toBe("FORBIDDEN_IP");
  });

  it("blocks link-local URL", async () => {
    const result = await safeFetchBinary("https://169.254.169.254/latest/meta-data", {
      maxBytes: 1024,
      timeoutMs: 1000,
      maxRedirects: 1,
      allowedMimeTypes: [/^image\//],
    });

    const failure = expectFailure(result);
    expect(["FORBIDDEN_IP", "FORBIDDEN_HOST"]).toContain(failure.code);
  });

  it("rejects redirect to private IP", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        new Response(null, {
          status: 302,
          headers: { location: "https://127.0.0.1/internal.png" },
        })
      );

    vi.stubGlobal("fetch", fetchMock);

    const result = await safeFetchBinary("https://example.com/file.png", {
      maxBytes: 1024,
      timeoutMs: 1000,
      maxRedirects: 2,
      allowedMimeTypes: [/^image\//],
    });

    const failure = expectFailure(result);
    expect(["FORBIDDEN_IP", "FORBIDDEN_HOST"]).toContain(failure.code);
  });

  it("rejects DNS resolution to private IP", async () => {
    const result = await safeFetchBinary("https://example.com/file.png", {
      maxBytes: 1024,
      timeoutMs: 1000,
      maxRedirects: 1,
      allowedMimeTypes: [/^image\//],
      resolveHost: async () => [{ address: "10.0.0.8" }],
    });

    const failure = expectFailure(result);
    expect(failure.code).toBe("FORBIDDEN_IP");
  });

  it("accepts approved https image asset", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response("ok-image", {
          status: 200,
          headers: { "content-type": "image/png", "content-length": "8" },
        })
      )
    );

    const result = await safeFetchBinary("https://cdn.example.com/file.png", {
      maxBytes: 1024,
      timeoutMs: 1000,
      maxRedirects: 1,
      allowedMimeTypes: [/^image\//],
      resolveHost: async () => [{ address: "8.8.8.8" }],
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.contentType).toBe("image/png");
      expect(result.bytes).toBeGreaterThan(0);
    }
  });

  it("rejects oversized responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response("x".repeat(50), {
          status: 200,
          headers: { "content-type": "image/png", "content-length": "50" },
        })
      )
    );

    const result = await safeFetchBinary("https://example.com/file.png", {
      maxBytes: 20,
      timeoutMs: 1000,
      maxRedirects: 1,
      allowedMimeTypes: [/^image\//],
    });

    const failure = expectFailure(result);
    expect(failure.code).toBe("RESPONSE_TOO_LARGE");
  });

  it("rejects invalid MIME type", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response("hello", {
          status: 200,
          headers: { "content-type": "text/plain" },
        })
      )
    );

    const result = await safeFetchBinary("https://example.com/file.txt", {
      maxBytes: 1024,
      timeoutMs: 1000,
      maxRedirects: 1,
      allowedMimeTypes: [/^image\//],
    });

    const failure = expectFailure(result);
    expect(failure.code).toBe("INVALID_CONTENT_TYPE");
  });

  it("rejects redirect to private host after initial public URL", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        new Response(null, {
          status: 302,
          headers: { location: "https://localhost/private.png" },
        })
      );

    vi.stubGlobal("fetch", fetchMock);

    const result = await safeFetchBinary("https://public.example.com/file.png", {
      maxBytes: 1024,
      timeoutMs: 1000,
      maxRedirects: 2,
      allowedMimeTypes: [/^image\//],
      resolveHost: async (host) => {
        if (host === "public.example.com") return [{ address: "8.8.8.8" }];
        return [{ address: "127.0.0.1" }];
      },
    });

    const failure = expectFailure(result);
    expect(["FORBIDDEN_HOST", "FORBIDDEN_IP"]).toContain(failure.code);
  });
});
