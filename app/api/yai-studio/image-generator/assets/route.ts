import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { applyRateLimit, asRateLimitFailure, buildRateLimitKey, getClientIp, getRateLimitActor } from "../../../../../lib/security/rate-limit";

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

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

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

function fallbackImage(promptItem: PromptItem, plan: ImagePlanPayload): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
      </defs>
      <rect width="1080" height="1080" fill="url(#bg)"/>
      <rect x="72" y="72" width="936" height="936" rx="44" fill="#0b1220" fill-opacity="0.92" stroke="#334155"/>
      <text x="112" y="140" font-size="18" fill="#94a3b8" font-family="Inter, Arial, sans-serif" letter-spacing="1.4">YAI STUDIO · TEMPLATE FALLBACK</text>
      <text x="112" y="212" font-size="48" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-weight="800">${escapeXml(promptItem.overlayText)}</text>
      <text x="112" y="270" font-size="24" fill="#cbd5e1" font-family="Inter, Arial, sans-serif">${escapeXml(plan.style)} · ${escapeXml(plan.aspectRatio)} · ${escapeXml(plan.palette)}</text>
      <rect x="112" y="326" width="856" height="240" rx="24" fill="#020617" stroke="#334155"/>
      <text x="144" y="370" font-size="17" fill="#94a3b8" font-family="Inter, Arial, sans-serif" letter-spacing="1.2">CONCEPT</text>
      <text x="144" y="408" font-size="28" fill="#e2e8f0" font-family="Inter, Arial, sans-serif">${escapeXml(promptItem.title)}</text>
      <text x="144" y="456" font-size="20" fill="#cbd5e1" font-family="Inter, Arial, sans-serif">${escapeXml(promptItem.prompt.slice(0, 180))}</text>
      <text x="144" y="506" font-size="18" fill="#94a3b8" font-family="Inter, Arial, sans-serif">${escapeXml(promptItem.negativePrompt.slice(0, 140))}</text>
      <circle cx="900" cy="878" r="72" fill="#2dd4bf" fill-opacity="0.22"/>
      <circle cx="880" cy="878" r="26" fill="#2dd4bf"/>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
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
  const requestId = `image-assets-${randomUUID()}`;
  const provider = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";

  try {
    const ip = getClientIp(request);
    const actor = getRateLimitActor(request) ?? "anonymous";
    const limiter = await applyRateLimit({
      key: buildRateLimitKey(["rate", "yai", "image-assets", actor, ip]),
      windowSeconds: 10 * 60,
      maxRequests: 5,
    });

    if (!limiter.ok) {
      const failure = asRateLimitFailure(limiter);
      return NextResponse.json(
        {
          message: failure.message,
          code: failure.code,
          requestId,
        },
        {
          status: failure.code === "RATE_LIMITED" ? 429 : 503,
          headers: {
            "Retry-After": String(failure.retryAfterSeconds),
          },
        }
      );
    }

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

      try {
        const imageDataUrl = await generateOne(prompt, size);
        assets.push({ index: promptItem.index, imageDataUrl });
      } catch {
        assets.push({ index: promptItem.index, imageDataUrl: fallbackImage(promptItem, plan) });
      }
    }

    const fallbackUsed = assets.some((asset) => asset.imageDataUrl.startsWith("data:image/svg+xml"));

    console.info("image_generation_completed", {
      fallbackUsed,
      provider,
      requestId,
      timestamp: new Date().toISOString(),
      status: "ok",
    });

    return NextResponse.json({
      source: "openai-images",
      fallbackUsed,
      requestId,
      model: provider,
      assets,
      governance: {
        decision: "PLAN_ONLY",
        requiresHumanApproval: true,
        publishAllowed: false,
      },
    });
  } catch (error) {
    console.info("image_generation_completed", {
      fallbackUsed: true,
      provider,
      requestId,
      timestamp: new Date().toISOString(),
      status: "fatal_error",
    });

    return NextResponse.json(
      {
        message: "Image asset generation failed.",
        detail: "Asset generation could not complete. Governed template fallback is unavailable for this request.",
        requestId,
      },
      { status: 500 }
    );
  }
}
