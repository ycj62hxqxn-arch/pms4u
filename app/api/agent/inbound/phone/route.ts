import { NextRequest, NextResponse } from "next/server";
import { saveEvidenceForInbound, updateInboundEvidenceRecord } from "../../../../../lib/evidence";
import crypto from "crypto";

// Simple phone webhook receiver for SMS/WhatsApp providers.
// Expects a POST with JSON: { from: string, body: string, media?: string[] }
// Optional validation using PHONE_WEBHOOK_SECRET or provider-specific headers can be added.

async function forwardToAgent(payload: any) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://pms4u.vercel.app"}/api/agent/inbound`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok ? await res.json().catch(() => null) : null;
  } catch (e) {
    return null;
  }
}

function looksLikeCarshunter(text?: string) {
  if (!text) return false;
  const t = text.toLowerCase();
  return t.includes("carshunter") || t.includes("listing") || t.includes("vehicle") || t.includes("bmw") || t.includes("vin");
}

function buildPublicUrl(request: NextRequest) {
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "www.gtcs4u.com";
  return `${proto}://${host}${request.nextUrl.pathname}`;
}

function verifyTwilioFormSignature({
  authToken,
  signature,
  url,
  params,
}: {
  authToken: string;
  signature: string;
  url: string;
  params: Record<string, string>;
}) {
  const sortedKeys = Object.keys(params).sort();
  const data = sortedKeys.reduce((acc, key) => acc + key + params[key], url);
  const expected = crypto.createHmac("sha1", authToken).update(data).digest("base64");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const phoneSecret = process.env.PHONE_WEBHOOK_SECRET;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;

    const contentType = request.headers.get("content-type") ?? "";
    const raw = await request.text().catch(() => "");

    // Provider headers
    const phoneSig = request.headers.get("x-phone-signature");
    const twilioSig = request.headers.get("x-twilio-signature");
    const twilioSig256 = request.headers.get("x-twilio-signature-256");

    let verified = false;

    // 1) If PHONE_WEBHOOK_SECRET is set, accept HMAC-SHA256 over raw body in header x-phone-signature (base64)
    if (phoneSecret && phoneSig) {
      const h = crypto.createHmac("sha256", phoneSecret).update(raw).digest("base64");
      verified = crypto.timingSafeEqual(Buffer.from(h), Buffer.from(phoneSig));
    }

    // 2) Twilio signatures
    if (!verified && twilioToken) {
      if (contentType.includes("application/x-www-form-urlencoded") && twilioSig) {
        const params = Object.fromEntries(new URLSearchParams(raw).entries());
        verified = verifyTwilioFormSignature({
          authToken: twilioToken,
          signature: twilioSig,
          url: buildPublicUrl(request),
          params,
        });
      } else if (twilioSig256) {
        const h = crypto.createHmac("sha256", twilioToken).update(raw).digest("base64");
        try { verified = crypto.timingSafeEqual(Buffer.from(h), Buffer.from(twilioSig256)); } catch(e) { verified = false; }
      } else if (twilioSig) {
        const h = crypto.createHmac("sha1", twilioToken).update(raw).digest("base64");
        try { verified = crypto.timingSafeEqual(Buffer.from(h), Buffer.from(twilioSig)); } catch(e) { verified = false; }
      }
    }

    // If PHONE_WEBHOOK_SECRET is set and request is not verified, reject.
    if (phoneSecret && !verified) {
      return NextResponse.json({ ok: false, reason: "invalid signature" }, { status: 401 });
    }

    let data: Record<string, any> = {};
    if (contentType.includes("application/x-www-form-urlencoded")) {
      data = Object.fromEntries(new URLSearchParams(raw).entries());
    } else {
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }
    }

    const from = (data.from || data.From || data.msisdn || "").toString();
    const body = (data.body || data.Body || data.text || "").toString();
    const mediaCount = Number(data.NumMedia || 0);
    const twilioMedia = Array.from({ length: mediaCount }, (_, i) => data[`MediaUrl${i}`]).filter(Boolean);
    const media = data.media || data.Media || data.mediaUrls || twilioMedia || [];

    // Create evidence record (immutable) for this inbound message
    const evidence = await saveEvidenceForInbound({
      sender: from,
      timestamp: new Date().toISOString(),
      text: body,
      media: Array.isArray(media) ? media : media ? [media] : [],
      verification: {
        verified,
        method: phoneSig ? "phone-hmac" : twilioSig256 ? "twilio-hmac-sha256" : twilioSig ? "twilio-hmac-sha1" : "none",
      },
    });

    // Only process messages that look related to Carshunter
    if (!looksLikeCarshunter(body)) {
      await updateInboundEvidenceRecord(evidence.id, {
        processing: {
          ignored: true,
          forwarded: false,
          executed: false,
          runtimeDecision: null,
          receiptId: null,
          executionId: null,
          runtimeMs: null,
          updatedAt: new Date().toISOString(),
        },
      });
      return NextResponse.json({ ok: true, ignored: true, evidenceId: evidence.id });
    }

    const actorId = `phone:${from}`;

    const forward = {
      actorId,
      actorRole: "external-operator",
      useCase: "carshunter-inbound-phone",
      targetSystem: "carshunter-cloud-run",
      requestedAction: "ingest-phone-message",
      prompt: body,
      receivedAt: new Date().toISOString(),
      attachments: evidence.mediaFiles || [],
      evidenceId: evidence.id,
      raw: data,
    };

    const startedAt = Date.now();
    const agentResp = await forwardToAgent(forward);
    const runtimeMs = Date.now() - startedAt;

    await updateInboundEvidenceRecord(evidence.id, {
      processing: {
        ignored: false,
        forwarded: !!agentResp,
        executed: Boolean(agentResp?.status === "executed" || agentResp?.decision === "ALLOW"),
        runtimeDecision: agentResp?.decision ?? null,
        receiptId: agentResp?.receipt?.executionId ?? agentResp?.executionId ?? null,
        executionId: agentResp?.executionId ?? null,
        runtimeMs,
        updatedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({ ok: true, forwarded: !!agentResp, agentResp, evidenceId: evidence.id });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export const GET = () => NextResponse.json({ ok: true, msg: "phone inbound endpoint" });
