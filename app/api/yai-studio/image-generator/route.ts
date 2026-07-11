import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

type ImageGeneratorRequest = {
  brief?: unknown;
  aspectRatio?: unknown;
  style?: unknown;
  audience?: unknown;
  palette?: unknown;
  count?: unknown;
};

type ImagePrompt = {
  index: number;
  title: string;
  prompt: string;
  negativePrompt: string;
  overlayText: string;
};

type ImagePlan = {
  traceId: string;
  brief: string;
  aspectRatio: string;
  style: string;
  audience: string;
  palette: string;
  count: number;
  prompts: ImagePrompt[];
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
  aspectRatio: string;
  style: string;
  audience: string;
  palette: string;
  count: number;
}): ImagePlan {
  const prompts: ImagePrompt[] = Array.from({ length: input.count }).map((_, i) => ({
    index: i + 1,
    title: `Concept ${i + 1}`,
    overlayText: i === 0 ? "Problem" : i === input.count - 1 ? "Outcome" : `Proof ${i}`,
    prompt: [
      `Create a ${input.aspectRatio} campaign visual in ${input.style} style.`,
      `Audience: ${input.audience}.`,
      `Palette: ${input.palette}.`,
      `Core brief: ${input.brief}.`,
      i === 0
        ? "Focus on pain point and urgency with clean enterprise composition."
        : i === input.count - 1
        ? "Focus on outcome and clear call-to-action zone with premium polish."
        : "Focus on verifiable capability with documentary realism and legible overlays.",
    ].join(" "),
    negativePrompt:
      "No logos of third parties, no distorted text, no crowded composition, no unrealistic hands, no watermark.",
  }));

  return {
    traceId: input.traceId,
    brief: input.brief,
    aspectRatio: input.aspectRatio,
    style: input.style,
    audience: input.audience,
    palette: input.palette,
    count: input.count,
    prompts,
    caption:
      "Draft creative concepts generated as planning output only. Human approval required before any external publication.",
    hashtags: ["#YAIStudio", "#ImageGenerator", "#GovernedAI", "#BPBSolutions"],
    governance: {
      decision: "PLAN_ONLY",
      requiresHumanApproval: true,
      publishAllowed: false,
    },
  };
}

async function callOpenAI(input: {
  brief: string;
  aspectRatio: string;
  style: string;
  audience: string;
  palette: string;
  count: number;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
  const prompt = [
    "Generate JSON only for image campaign planning.",
    "Keys: prompts[{index,title,prompt,negativePrompt,overlayText}], caption, hashtags[]",
    "No markdown and no extra text.",
    `Brief: ${input.brief}`,
    `Aspect ratio: ${input.aspectRatio}`,
    `Style: ${input.style}`,
    `Audience: ${input.audience}`,
    `Palette: ${input.palette}`,
    `Count: ${input.count}`,
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
            "You are YAI Studio Image Generator planner. Return planning prompts only. Never claim publish or execution. Output strict JSON.",
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
    const body = ((await request.json().catch(() => ({}))) ?? {}) as ImageGeneratorRequest;

    const brief = asText(body.brief);
    const aspectRatio = asText(body.aspectRatio, "1:1");
    const style = asText(body.style, "Premium Corporate");
    const audience = asText(body.audience, "enterprise buyers");
    const palette = asText(body.palette, "Emerald, Slate, White");
    const count = Math.min(8, Math.max(1, asInt(body.count, 4)));

    if (!brief) {
      return NextResponse.json({ message: "Brief is required." }, { status: 400 });
    }

    const traceId = `yai-image-${randomUUID()}`;
    const fallback = buildFallbackPlan({ traceId, brief, aspectRatio, style, audience, palette, count });

    try {
      const openai = await callOpenAI({ brief, aspectRatio, style, audience, palette, count });
      if (openai) {
        const parsed = JSON.parse(openai.outputText) as Partial<ImagePlan>;

        const prompts =
          Array.isArray(parsed.prompts) && parsed.prompts.length > 0
            ? parsed.prompts
                .map((p, i) => ({
                  index: asInt((p as Record<string, unknown>).index, i + 1),
                  title: asText((p as Record<string, unknown>).title, `Concept ${i + 1}`),
                  prompt: asText((p as Record<string, unknown>).prompt, ""),
                  negativePrompt: asText((p as Record<string, unknown>).negativePrompt, fallback.prompts[0]?.negativePrompt ?? ""),
                  overlayText: asText((p as Record<string, unknown>).overlayText, `Proof ${i + 1}`),
                }))
                .filter((p) => p.prompt)
                .slice(0, count)
            : fallback.prompts;

        const merged: ImagePlan = {
          ...fallback,
          prompts: prompts.length > 0 ? prompts : fallback.prompts,
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
      // local fallback
    }

    return NextResponse.json({
      runtimeSource: "local-fallback",
      model: "yai-image-local",
      plan: fallback,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Image Generator request failed.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
