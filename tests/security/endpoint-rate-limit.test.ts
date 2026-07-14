import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { __resetTestRateLimitStore } from "../../lib/security/rate-limit";
import { POST as imagePlanPost } from "../../app/api/yai-studio/image-generator/route";

describe("security/endpoint-rate-limit", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "test");
    delete process.env.OPENAI_API_KEY;
    __resetTestRateLimitStore();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    __resetTestRateLimitStore();
  });

  it("returns 200 for valid ordinary request", async () => {
    const req = new Request("https://example.com/api/yai-studio/image-generator", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "198.51.100.10",
      },
      body: JSON.stringify({ brief: "Create campaign concepts" }),
    });

    const res = await imagePlanPost(req);
    expect(res.status).toBe(200);
  });

  it("returns 429 with Retry-After when threshold is exceeded", async () => {
    let lastResponse: Response | null = null;

    for (let i = 0; i < 11; i += 1) {
      const req = new Request("https://example.com/api/yai-studio/image-generator", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.20",
          "x-api-key": "client-key-1",
        },
        body: JSON.stringify({ brief: `Create campaign concepts ${i}` }),
      });
      lastResponse = await imagePlanPost(req);
    }

    expect(lastResponse).not.toBeNull();
    expect(lastResponse?.status).toBe(429);
    expect(lastResponse?.headers.get("Retry-After")).toBeTruthy();

    const payload = (await lastResponse?.json()) as { code?: string };
    expect(payload.code).toBe("RATE_LIMITED");
  });
});
