import { afterEach, describe, expect, it, vi } from "vitest";

import { POST as inboundPost } from "../../app/api/agent/inbound/route";
import { GET as eventsGet } from "../../app/api/agent/inbound/events/route";
import { GET as verifyGet } from "../../app/api/agent/inbound/verify/route";
import { requireSharedSecretAuth } from "../../lib/security/webhook-auth";

describe("security/inbound-auth", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("accepts requests with the configured shared secret", () => {
    vi.stubEnv("PMS_INBOUND_SHARED_SECRET", "0123456789abcdef0123456789abcdef");

    const request = new Request("http://localhost/api/agent/inbound", {
      method: "POST",
      headers: {
        "x-pms-inbound-secret": "0123456789abcdef0123456789abcdef",
      },
    });

    const result = requireSharedSecretAuth(request);
    expect(result.ok).toBe(true);
  });

  it("rejects inbound execution without the shared secret", async () => {
    vi.stubEnv("PMS_INBOUND_SHARED_SECRET", "0123456789abcdef0123456789abcdef");

    const response = await inboundPost(
      new Request("http://localhost/api/agent/inbound", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ prompt: "hello" }),
      })
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects ledger event reads without the shared secret", async () => {
    vi.stubEnv("PMS_INBOUND_SHARED_SECRET", "0123456789abcdef0123456789abcdef");

    const response = await eventsGet(new Request("http://localhost/api/agent/inbound/events"));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects ledger verification without the shared secret", async () => {
    vi.stubEnv("PMS_INBOUND_SHARED_SECRET", "0123456789abcdef0123456789abcdef");

    const response = await verifyGet(new Request("http://localhost/api/agent/inbound/verify"));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("fails closed when the shared secret is missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    delete process.env.PMS_INBOUND_SHARED_SECRET;

    const response = await inboundPost(
      new Request("http://localhost/api/agent/inbound", {
        method: "POST",
      })
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ code: "AUTH_SECRET_UNAVAILABLE" });
  });
});