import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { applyRateLimit, asRateLimitFailure, buildRateLimitKey, getClientIp, getRateLimitActor } from "../../../../lib/security/rate-limit";

type VideoMakerRequest = {
  brief?: unknown;
  durationSec?: unknown;
  format?: unknown;
  style?: unknown;
  audience?: unknown;
  language?: unknown;
};

type StoryScene = {
  atSec: number;
  visual: string;
  overlay: string;
  voiceover: string;
};

type VideoPlan = {
  traceId: string;
  title: string;
  hook: string;
  durationSec: number;
  format: string;
  style: string;
  audience: string;
  language: string;
  scenes: StoryScene[];
  cta: string;
  caption: string;
  hashtags: string[];
  governance: {
    decision: "PLAN_ONLY";
    requiresHumanApproval: true;
    publishAllowed: false;
  };
};

function asText(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function asInt(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function buildFallbackPlan(input: {
  traceId: string;
  brief: string;
  durationSec: number;
  format: string;
  style: string;
  audience: string;
  language: string;
}): VideoPlan {
  const slots = input.durationSec <= 15 ? [0, 5, 10] : input.durationSec <= 30 ? [0, 8, 16, 24] : [0, 12, 24, 36, 48];
  const briefLead = input.brief.slice(0, 90).replace(/\s+/g, " ").trim();

  const scenes: StoryScene[] = slots.map((slot, idx) => ({
    atSec: slot,
    visual: idx === 0
      ? `Open with the governed business problem: ${briefLead}`
      : idx === 1
        ? "Show authority, policy, and admissibility as the runtime decision layer."
        : idx === slots.length - 1
        ? "End with a clear execution outcome, evidence trace, and operator approval cue."
        : `Show one proof step for ${input.audience}.`,
    overlay: idx === 0 ? "Business Context" : idx === 1 ? "Governance" : idx === slots.length - 1 ? "Outcome" : `Proof ${idx}`,
    voiceover:
      idx === 0
        ? `If you're ${input.audience}, this brief frames the execution problem in enterprise terms.`
        : idx === 1
        ? "We verify authority and admissibility before any consequential action."
        : idx === slots.length - 1
        ? "The result is a governed plan with evidence, traceability, and human approval before release."
        : `Step ${idx}: show one concrete, verifiable control before promising outcomes.`,
  }));

  const title = `Runtime Governance Video Plan — ${input.style}`;
  const cta = "Open the governed briefing";
  const caption = `Enterprise video plan for ${input.audience}. Generated as plan-only output and requires human review before publish.`;

  return {
    traceId: input.traceId,
    title,
    hook: `For ${input.audience}: ${input.brief.slice(0, 120)}`,
    durationSec: input.durationSec,
    format: input.format,
    style: input.style,
    audience: input.audience,
    language: input.language,
    scenes,
    cta,
    caption,
    hashtags: ["#YAIStudio", "#VideoMaker", "#GovernedAI", "#RuntimeGovernance", "#BPBSolutions"],
    governance: {
      decision: "PLAN_ONLY",
      requiresHumanApproval: true,
      publishAllowed: false,
    },
  };
}

async function callOpenAI(input: {
  brief: string;
  durationSec: number;
  format: string;
  style: string;
  audience: string;
  language: string;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
  const prompt = [
    "Create a concise short-video production plan in strict JSON only.",
    "Return keys: title, hook, scenes[{atSec,visual,overlay,voiceover}], cta, caption, hashtags[]",
    "No markdown. No prose outside JSON.",
    "Use an enterprise, governance-first narrative. Avoid playful, animal, meme, cartoon, or consumer-gadget motifs unless explicitly requested.",
    "Treat the brief as a founder-level research note and convert it into a clear business/architecture/implementation story.",
    "Prefer runtime governance, authority, admissibility, execution gates, evidence, deployment, and working software language.",
    `Brief: ${input.brief}`,
    `Duration: ${input.durationSec}`,
    `Format: ${input.format}`,
    `Style: ${input.style}`,
    `Audience: ${input.audience}`,
    `Language: ${input.language}`,
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are YAI Studio Video Maker. Generate planning artifacts only. Never claim publish/execution. Output valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed (${response.status})`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const outputText = payload.choices?.[0]?.message?.content?.trim();

  if (!outputText) {
    throw new Error("OpenAI returned no text output");
  }

  return { outputText, model };
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const actor = getRateLimitActor(request) ?? "anonymous";
    const limiter = await applyRateLimit({
      key: buildRateLimitKey(["rate", "yai", "video-plan", actor, ip]),
      windowSeconds: 10 * 60,
      maxRequests: 10,
    });

    if (!limiter.ok) {
      const failure = asRateLimitFailure(limiter);
      return NextResponse.json(
        { message: failure.message, code: failure.code },
        {
          status: failure.code === "RATE_LIMITED" ? 429 : 503,
          headers: { "Retry-After": String(failure.retryAfterSeconds) },
        }
      );
    }

    const body = ((await request.json().catch(() => ({}))) ?? {}) as VideoMakerRequest;

    const brief = asText(body.brief);
    const durationSec = Math.min(90, Math.max(10, asInt(body.durationSec, 30)));
    const format = asText(body.format, "9:16");
    const style = asText(body.style, "Premium Corporate");
    const audience = asText(body.audience, "enterprise buyers");
    const language = asText(body.language, "English");

    if (!brief) {
      return NextResponse.json({ message: "Brief is required." }, { status: 400 });
    }

    const traceId = `yai-video-${randomUUID()}`;
    const fallback = buildFallbackPlan({ traceId, brief, durationSec, format, style, audience, language });

    try {
      const openai = await callOpenAI({ brief, durationSec, format, style, audience, language });
      if (openai) {
        const parsed = JSON.parse(openai.outputText) as Partial<VideoPlan>;
        const merged: VideoPlan = {
          ...fallback,
          title: asText(parsed.title, fallback.title),
          hook: asText(parsed.hook, fallback.hook),
          scenes:
            Array.isArray(parsed.scenes) && parsed.scenes.length > 0
              ? parsed.scenes
                  .map((s) => ({
                    atSec: asInt((s as Record<string, unknown>).atSec, 0),
                    visual: asText((s as Record<string, unknown>).visual, ""),
                    overlay: asText((s as Record<string, unknown>).overlay, ""),
                    voiceover: asText((s as Record<string, unknown>).voiceover, ""),
                  }))
                  .filter((s) => s.visual && s.voiceover)
              : fallback.scenes,
          cta: asText(parsed.cta, fallback.cta),
          caption: asText(parsed.caption, fallback.caption),
          hashtags:
            Array.isArray(parsed.hashtags) && parsed.hashtags.every((h) => typeof h === "string")
              ? (parsed.hashtags as string[]).slice(0, 12)
              : fallback.hashtags,
          governance: fallback.governance,
        };

        return NextResponse.json({
          runtimeSource: "openai",
          model: openai.model,
          plan: merged,
        });
      }
    } catch {
      // fall back to local deterministic planner
    }

    return NextResponse.json({
      runtimeSource: "local-fallback",
      model: "yai-video-local",
      plan: fallback,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Video Maker request failed.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
