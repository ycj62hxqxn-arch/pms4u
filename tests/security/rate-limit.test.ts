import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  __resetTestRateLimitStore,
  applyRateLimit,
  getRateLimitActor,
  type RateLimitResult,
} from "../../lib/security/rate-limit";

function expectRateLimitFailure(result: RateLimitResult): Extract<RateLimitResult, { ok: false }> {
  if (result.ok) throw new Error("expected rate-limit failure");
  return result as Extract<RateLimitResult, { ok: false }>;
}

describe("security/rate-limit", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "test");
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    __resetTestRateLimitStore();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    __resetTestRateLimitStore();
  });

  it("returns RATE_LIMITED with retry-after after threshold", async () => {
    const policy = {
      key: "rate:test:ip:127.0.0.1",
      windowSeconds: 60,
      maxRequests: 2,
    };

    const first = await applyRateLimit(policy);
    const second = await applyRateLimit(policy);
    const third = await applyRateLimit(policy);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    const failure = expectRateLimitFailure(third);
    expect(failure.code).toBe("RATE_LIMITED");
    expect(failure.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("returns ok for ordinary request under threshold", async () => {
    const result = await applyRateLimit({
      key: "rate:test:ok:127.0.0.1",
      windowSeconds: 60,
      maxRequests: 5,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.remaining).toBe(4);
    }
  });

  it("extracts actor from user/session/api key/bearer", () => {
    const withUser = new Request("https://example.com", { headers: { "x-user-id": "User-123" } });
    expect(getRateLimitActor(withUser)).toBe("user:user-123");

    const withSession = new Request("https://example.com", { headers: { "x-session-id": "session-abc" } });
    expect(getRateLimitActor(withSession)).toContain("session:");

    const withApiKey = new Request("https://example.com", { headers: { "x-api-key": "secret-api-key" } });
    expect(getRateLimitActor(withApiKey)).toMatch(/^api:[a-f0-9]{16}$/);

    const withBearer = new Request("https://example.com", { headers: { Authorization: "Bearer token-value" } });
    expect(getRateLimitActor(withBearer)).toMatch(/^bearer:[a-f0-9]{16}$/);
  });

  it("returns RATE_LIMIT_UNAVAILABLE in production without redis", async () => {
    vi.stubEnv("NODE_ENV", "production");
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const result = await applyRateLimit({
      key: "rate:prod:ip:1.2.3.4",
      windowSeconds: 60,
      maxRequests: 1,
    });

    const failure = expectRateLimitFailure(result);
    expect(failure.code).toBe("RATE_LIMIT_UNAVAILABLE");
    expect(failure.retryAfterSeconds).toBe(60);
  });
});
