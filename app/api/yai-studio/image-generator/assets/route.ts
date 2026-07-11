import { NextResponse } from "next/server";

type PromptItem = {
  index: number;
  title: string;
  prompt: string;
  negativePrompt: string;
  overlayText: string;
};

type ImagePlanPayload = {
  aspectRatio: string;
  style: string;
  audience: string;
  palette: string;
  prompts: PromptItem[];
};

type AssetsRequest = {
  plan?: unknown;
};

type AssetItem = {
  index: number;
  imageDataUrl: string;
};

function asText(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function isPromptItem(value: unknown): value is PromptItem {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.index === "number" &&
    typeof row.title === "string" &&
    typeof row.prompt === "string" &&
    typeof row.negativePrompt === "string" &&
    typeof row.overlayText === "string"
  );
}

function parsePlan(value: unknown): ImagePlanPayload | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const promptsRaw = Array.isArray(row.prompts) ? row.prompts : [];
  const prompts = promptsRaw.filter(isPromptItem).slice(0, 6);
  if (prompts.length === 0) return null;

  return {
    aspectRatio: asText(row.aspectRatio, "1:1"),
    style: asText(row.style, "Premium Corporate"),
    audience: asText(row.audience, "enterprise buyers"),
    palette: asText(row.palette, "Emerald, Slate, White"),
    prompts,
  };
}

function sizeFor(aspectRatio: string): "1024x1024" | "1536x1024" | "1024x1536" {
  const normalized = aspectRatio.trim();
  if (normalized === "16:9") return "1536x1024";
  if (normalized === "9:16" || normalized === "4:5") return "1024x1536";
  return "1024x1024";
}

async function generateOne(prompt: string, size: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY missing");
  }

  const imageModel = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: imageModel,
      prompt,
      size,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Image generation failed (${response.status}): ${err.slice(0, 240)}`);
  }

  const payload = (await response.json()) as {
    data?: Array<{ b64_json?: string; url?: string }>;
  };

  const first = payload.data?.[0];
  const b64 = first?.b64_json;
  if (b64 && b64.length > 0) {
    return `data:image/png;base64,${b64}`;
  }

  if (first?.url) {
    return first.url;
  }

  throw new Error("Image generation returned no image.");
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = ((await request.json().catch(() => ({}))) ?? {}) as AssetsRequest;
    const plan = parsePlan(body.plan);

    if (!plan) {
      return NextResponse.json({ message: "Valid image plan is required." }, { status: 400 });
    }

    const size = sizeFor(plan.aspectRatio);
    const assets: AssetItem[] = [];

    for (const promptItem of plan.prompts) {
      const prompt = [
        `Create a premium ${plan.aspectRatio} marketing image.`,
        `Style: ${plan.style}`,
        `Audience: ${plan.audience}`,
        `Palette: ${plan.palette}`,
        `Core concept: ${promptItem.title}`,
        `Direction: ${promptItem.prompt}`,
        `Avoid: ${promptItem.negativePrompt}`,
        "No logos, no watermark, no text inside image unless naturally part of scene objects.",
      ].join("\n");

      const imageDataUrl = await generateOne(prompt, size);
      assets.push({ index: promptItem.index, imageDataUrl });
    }

    return NextResponse.json({
      source: "openai-images",
      model: process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1",
      assets,
      governance: {
        decision: "PLAN_ONLY",
        requiresHumanApproval: true,
        publishAllowed: false,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Image asset generation failed.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
