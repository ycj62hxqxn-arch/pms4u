import { NextResponse } from "next/server";

type Scene = {
  atSec: number;
  visual: string;
  overlay: string;
  voiceover: string;
};

type VideoPlanPayload = {
  traceId: string;
  format: string;
  style: string;
  audience: string;
  language: string;
  scenes: Scene[];
};

type AssetsRequest = {
  plan?: unknown;
};

type ImageResult = {
  index: number;
  imageDataUrl: string;
};

function asText(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function isScene(value: unknown): value is Scene {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return typeof row.visual === "string" && typeof row.overlay === "string" && typeof row.voiceover === "string";
}

function parsePlan(value: unknown): VideoPlanPayload | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const scenesRaw = Array.isArray(row.scenes) ? row.scenes : [];
  const scenes = scenesRaw.filter(isScene).slice(0, 6);
  if (scenes.length === 0) return null;

  return {
    traceId: asText(row.traceId, "yai-video"),
    format: asText(row.format, "16:9"),
    style: asText(row.style, "Premium Corporate"),
    audience: asText(row.audience, "enterprise buyers"),
    language: asText(row.language, "English"),
    scenes,
  };
}

function sizeFor(format: string): "1024x1024" | "1536x1024" | "1024x1536" {
  const normalized = format.trim();
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
      return NextResponse.json({ message: "Valid video plan is required." }, { status: 400 });
    }

    const size = sizeFor(plan.format);
    const prompts = plan.scenes.map((scene) => {
      return [
        "Create a premium cinematic still frame.",
        `Style: ${plan.style}`,
        `Audience context: ${plan.audience}`,
        `Language context: ${plan.language}`,
        `Shot objective: ${scene.overlay}`,
        `Visual direction: ${scene.visual}`,
        "High-end production lighting, realistic lens depth, clean composition, no watermarks, no logos, no text overlays.",
      ].join("\n");
    });

    const assets: ImageResult[] = [];

    for (let i = 0; i < prompts.length; i += 1) {
      const imageDataUrl = await generateOne(prompts[i], size);
      assets.push({ index: i, imageDataUrl });
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
        message: "Video asset generation failed.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
