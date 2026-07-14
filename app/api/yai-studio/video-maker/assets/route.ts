import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { applyRateLimit, asRateLimitFailure, buildRateLimitKey, getClientIp, getRateLimitActor } from "../../../../../lib/security/rate-limit";

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

function fallbackSceneImage(prompt: string, scene: Scene, index: number, plan: VideoPlanPayload): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="100%" stop-color="#10223f"/>
        </linearGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#bg)"/>
      <rect x="56" y="56" width="1168" height="608" rx="32" fill="#0b1220" fill-opacity="0.92" stroke="#334155"/>
      <text x="96" y="118" font-size="18" fill="#94a3b8" font-family="Inter, Arial, sans-serif" letter-spacing="1.4">YAI STUDIO · TEMPLATE FALLBACK</text>
      <text x="96" y="170" font-size="42" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-weight="800">${escapeXml(scene.overlay)}</text>
      <text x="96" y="224" font-size="24" fill="#cbd5e1" font-family="Inter, Arial, sans-serif">${escapeXml(plan.style)} · ${escapeXml(plan.audience)} · T+${scene.atSec}s</text>
      <rect x="96" y="272" width="700" height="160" rx="22" fill="#020617" stroke="#334155"/>
      <text x="126" y="314" font-size="17" fill="#94a3b8" font-family="Inter, Arial, sans-serif" letter-spacing="1.2">VISUAL DIRECTION</text>
      <text x="126" y="350" font-size="24" fill="#e2e8f0" font-family="Inter, Arial, sans-serif">${escapeXml(scene.visual)}</text>
      <text x="126" y="392" font-size="18" fill="#cbd5e1" font-family="Inter, Arial, sans-serif">${escapeXml(scene.voiceover)}</text>
      <rect x="96" y="470" width="700" height="120" rx="22" fill="#0f172a" stroke="#334155"/>
      <text x="126" y="512" font-size="17" fill="#94a3b8" font-family="Inter, Arial, sans-serif" letter-spacing="1.2">PROMPT</text>
      <text x="126" y="546" font-size="19" fill="#cbd5e1" font-family="Inter, Arial, sans-serif">${escapeXml(prompt.slice(0, 160))}</text>
      <circle cx="1100" cy="556" r="64" fill="#38bdf8" fill-opacity="0.22"/>
      <circle cx="1082" cy="556" r="24" fill="#38bdf8"/>
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
  const requestId = `video-assets-${randomUUID()}`;
  const provider = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";

  try {
    const ip = getClientIp(request);
    const actor = getRateLimitActor(request) ?? "anonymous";
    const limiter = await applyRateLimit({
      key: buildRateLimitKey(["rate", "yai", "video-assets", actor, ip]),
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
      try {
        const imageDataUrl = await generateOne(prompts[i], size);
        assets.push({ index: i, imageDataUrl });
      } catch {
        assets.push({ index: i, imageDataUrl: fallbackSceneImage(prompts[i], plan.scenes[i], i, plan) });
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
        message: "Video asset generation failed.",
        detail: "Asset generation could not complete. Governed template fallback is unavailable for this request.",
        requestId,
      },
      { status: 500 }
    );
  }
}
