import { Redis } from "@upstash/redis";
import { createHash } from "node:crypto";

export type RateLimitPolicy = {
  key: string;
  windowSeconds: number;
  maxRequests: number;
};

export type RateLimitResult =
  | { ok: true; remaining: number; resetInSeconds: number }
  | { ok: false; code: "RATE_LIMITED" | "RATE_LIMIT_UNAVAILABLE"; retryAfterSeconds: number; message: string };

export function asRateLimitFailure(result: RateLimitResult): Extract<RateLimitResult, { ok: false }> {
  if (result.ok) {
    throw new Error("Expected rate-limit failure result.");
  }
  return result as Extract<RateLimitResult, { ok: false }>;
}

let redisClient: Redis | null = null;
const testWindowStore = new Map<string, { count: number; expiresAtMs: number }>();

export function __resetTestRateLimitStore(): void {
  testWindowStore.clear();
}

function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  redisClient = new Redis({ url, token });
  return redisClient;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown-ip";
}

function stableHash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function sanitizeIdentity(value: string, fallbackPrefix: string): string {
  const trimmed = value.trim();
  if (!trimmed) return `${fallbackPrefix}:unknown`;
  const normalized = trimmed.toLowerCase().replace(/[^a-z0-9._:@-]/g, "").slice(0, 80);
  return normalized || `${fallbackPrefix}:${stableHash(trimmed)}`;
}

export function getRateLimitActor(request: Request): string | null {
  const userId = request.headers.get("x-user-id")?.trim();
  if (userId) return `user:${sanitizeIdentity(userId, "user")}`;

  const sessionId = request.headers.get("x-session-id")?.trim();
  if (sessionId) return `session:${sanitizeIdentity(sessionId, "session")}`;

  const apiKey = request.headers.get("x-api-key")?.trim();
  if (apiKey) return `api:${stableHash(apiKey)}`;

  const auth = request.headers.get("authorization")?.trim();
  if (auth && /^bearer\s+.+/i.test(auth)) {
    const token = auth.replace(/^bearer\s+/i, "").trim();
    if (token) return `bearer:${stableHash(token)}`;
  }

  return null;
}

export function buildRateLimitKey(parts: Array<string | undefined | null>): string {
  return parts
    .map((part) => (part ?? "").trim())
    .filter(Boolean)
    .join(":")
    .toLowerCase();
}

export async function applyRateLimit(policy: RateLimitPolicy): Promise<RateLimitResult> {
  if (process.env.NODE_ENV === "test") {
    const now = Date.now();
    const existing = testWindowStore.get(policy.key);
    if (!existing || existing.expiresAtMs <= now) {
      testWindowStore.set(policy.key, {
        count: 1,
        expiresAtMs: now + policy.windowSeconds * 1000,
      });
      return { ok: true, remaining: policy.maxRequests - 1, resetInSeconds: policy.windowSeconds };
    }

    existing.count += 1;
    const resetInSeconds = Math.max(1, Math.ceil((existing.expiresAtMs - now) / 1000));
    if (existing.count > policy.maxRequests) {
      return {
        ok: false,
        code: "RATE_LIMITED",
        retryAfterSeconds: resetInSeconds,
        message: "Too many requests. Please retry later.",
      };
    }

    return {
      ok: true,
      remaining: Math.max(0, policy.maxRequests - existing.count),
      resetInSeconds,
    };
  }

  const redis = getRedisClient();

  if (!redis) {
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        code: "RATE_LIMIT_UNAVAILABLE",
        retryAfterSeconds: 60,
        message: "Rate limit storage is unavailable in production.",
      };
    }

    // Development fallback only; do not use this branch as production strategy.
    return { ok: true, remaining: policy.maxRequests, resetInSeconds: policy.windowSeconds };
  }

  try {
    const count = await redis.incr(policy.key);
    if (count === 1) {
      await redis.expire(policy.key, policy.windowSeconds);
    }

    const ttl = await redis.ttl(policy.key);
    const resetInSeconds = typeof ttl === "number" && ttl > 0 ? ttl : policy.windowSeconds;

    if (count > policy.maxRequests) {
      return {
        ok: false,
        code: "RATE_LIMITED",
        retryAfterSeconds: resetInSeconds,
        message: "Too many requests. Please retry later.",
      };
    }

    return {
      ok: true,
      remaining: Math.max(0, policy.maxRequests - count),
      resetInSeconds,
    };
  } catch {
    return {
      ok: false,
      code: "RATE_LIMIT_UNAVAILABLE",
      retryAfterSeconds: 60,
      message: "Rate limit storage is unavailable.",
    };
  }
}
