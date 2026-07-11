import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

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

  const scenes: StoryScene[] = slots.map((slot, idx) => ({
    atSec: slot,
    visual: idx === 0
      ? `Open with the core pain point from the brief: ${input.brief.slice(0, 80)}`
      : `Show proof-oriented visual ${idx} tied to the promise and audience (${input.audience})`,
    overlay: idx === 0 ? "Problem" : idx === slots.length - 1 ? "Outcome" : `Proof ${idx}`,
    voiceover:
      idx === 0
        ? `If you're ${input.audience}, this is the fastest path to solve ${input.brief.slice(0, 50)}.`
        : idx === slots.length - 1
        ? "Book a briefing. We verify authority before execution."
        : `Step ${idx}: show one concrete, verifiable improvement before promising outcomes.`,
  }));

  const title = `YAI Video Draft — ${input.style} ${input.format}`;
  const cta = "Book a private briefing";
  const caption = `Draft campaign script for ${input.audience}. Generated as plan-only output and requires human review before publish.`;

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
    hashtags: ["#YAIStudio", "#VideoMaker", "#GovernedAI", "#BPBSolutions"],
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
