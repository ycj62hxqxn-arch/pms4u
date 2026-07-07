import { NextRequest, NextResponse } from "next/server";
import { saveEvidenceForInbound, updateInboundEvidenceRecord } from "../../../../../lib/evidence";

type ChatBody = {
  message?: string;
  sessionId?: string;
  sourceHost?: string;
  channel?: string;
};

function withCors(resp: NextResponse) {
  resp.headers.set("Access-Control-Allow-Origin", "*");
  resp.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  resp.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return resp;
}

function detectIntent(text: string) {
  const t = text.toLowerCase();
  if (/(tour|trip|dive|safari|luxor|cairo|pickup|hotel|excursion|tourism)/i.test(t)) return "tourism";
  if (/(roi|yield|investment|invest|capital|buyer|portfolio|return)/i.test(t)) return "investment";
  if (/(rent|apartment|villa|compound|viewing|real\s*estate|property|makadi|gouna|ahyaa)/i.test(t)) return "real-estate";
  return "general";
}

function detectLocation(text: string) {
  const t = text.toLowerCase();
  if (/(hurghada)/i.test(t)) return "Hurghada";
  if (/(el\s*gouna|gouna)/i.test(t)) return "El Gouna";
  if (/(makadi)/i.test(t)) return "Makadi";
  if (/(sahl\s*hasheesh|soma\s*bay)/i.test(t)) return "Sahl Hasheesh / Soma Bay";
  if (/(al\s*ahyaa|ahyaa|alahyaa)/i.test(t)) return "Al Ahyaa";
  return "Unspecified";
}

function buildReply(intent: string) {
  if (intent === "tourism") {
    return [
      "Tourism request noted.",
      "I can help with Hurghada routing, tours, diving, safari, Luxor/Cairo planning, and WhatsApp handoff.",
      "Please share objective, location, timeframe, budget range, and contact preference.",
      "This is pre-contract request qualification only; no final booking confirmation is made in chat.",
    ].join(" ");
  }

  if (intent === "real-estate") {
    return [
      "Real-estate access request noted.",
      "I can guide rental screening and property-viewing paths for Hurghada, El Gouna, Makadi, Sahl Hasheesh, and Al Ahyaa.",
      "Please share objective, location, timeframe, budget range, and contact preference.",
      "This is pre-contract request qualification only; no rental or purchase is finalized in chat.",
    ].join(" ");
  }

  if (intent === "investment") {
    return [
      "Investment-intent request noted.",
      "I can route buyer-intent qualification with zone logic, viewing path, and document checklist.",
      "Please share objective, location, timeframe, budget range, and contact preference.",
      "No legal advice, financial advice, final deal confirmation, or guaranteed ROI is provided.",
    ].join(" ");
  }

  return [
    "I can support tourism, real-estate access, and investment-intent routing for Egypt.",
    "Please share objective, location, timeframe, budget range, and contact preference.",
    "This chat is pre-contract request qualification only.",
  ].join(" ");
}

function nextGovernedStep(intent: string, location: string) {
  if (intent === "tourism") {
    return `Next step: create a tourism qualification brief for ${location} and hand off to WhatsApp for pickup/time-slot confirmation.`;
  }

  if (intent === "real-estate") {
    return `Next step: start rental screening/property viewing qualification for ${location}, then route the brief to WhatsApp for document and slot coordination.`;
  }

  if (intent === "investment") {
    return `Next step: capture investment-intent profile for ${location}, then route to governed buyer-intent review on WhatsApp.`;
  }

  return "Next step: capture objective and route to the correct tourism, real-estate, or investment-intent path with WhatsApp handoff.";
}

export const runtime = "nodejs";

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as ChatBody;
    const message = String(body.message ?? "").trim();
    if (!message) {
      return withCors(NextResponse.json({ ok: false, error: "message is required" }, { status: 400 }));
    }

    const sessionId = String(body.sessionId ?? "anon").trim() || "anon";
    const sourceHost = String(body.sourceHost ?? "unknown").trim();
    const intent = detectIntent(message);
    const location = detectLocation(message);
    const reply = buildReply(intent);
    const nextStep = nextGovernedStep(intent, location);

    const evidence = await saveEvidenceForInbound({
      sender: `webchat:${sessionId}`,
      timestamp: new Date().toISOString(),
      text: `[${sourceHost}] ${message}\nclassification=intent:${intent};location:${location};mode=pre-contract-qualification`,
      media: [],
      verification: {
        verified: false,
        method: "webchat-public",
      },
    });

    await updateInboundEvidenceRecord(evidence.id, {
      processing: {
        ignored: false,
        forwarded: true,
        executed: false,
        runtimeDecision: "NEED_REVIEW",
        receiptId: null,
        executionId: null,
        runtimeMs: null,
        updatedAt: new Date().toISOString(),
      },
    });

    return withCors(
      NextResponse.json({
        ok: true,
        intent,
        location,
        reply,
        nextStep,
        compliance: {
          scope: "pre-contract request qualification only",
          noFinalBooking: true,
          noLegalAdvice: true,
          noFinancialAdvice: true,
          noGuaranteedRoi: true,
        },
        evidenceId: evidence.id,
      })
    );
  } catch (error) {
    return withCors(NextResponse.json({ ok: false, error: String(error) }, { status: 500 }));
  }
}

export const GET = () => withCors(NextResponse.json({ ok: true, msg: "webchat inbound endpoint" }));
