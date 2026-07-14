import { afterEach, describe, expect, it, vi } from "vitest";
import { getReceiptSigningSecret } from "../../lib/security/secrets";

describe("security/secrets", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("throws in production when secret is missing", () => {
    vi.stubEnv("NODE_ENV", "production");
    delete process.env.PMS_RECEIPT_SIGNING_SECRET;

    expect(() => getReceiptSigningSecret()).toThrow(/required in production/i);
  });

  it("throws when secret is too short", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("PMS_RECEIPT_SIGNING_SECRET", "short-secret");

    expect(() => getReceiptSigningSecret()).toThrow(/at least 32 characters/i);
  });

  it("returns valid secret", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("PMS_RECEIPT_SIGNING_SECRET", "0123456789abcdef0123456789abcdef");

    expect(getReceiptSigningSecret()).toBe("0123456789abcdef0123456789abcdef");
  });
});
