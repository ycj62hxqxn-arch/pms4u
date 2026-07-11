import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve as pathResolve } from "node:path";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";

import ffmpegPath from "ffmpeg-static";
import { NextResponse } from "next/server";
import sharp from "sharp";

type StoryScene = {
  atSec: number;
  visual: string;
  overlay: string;
  voiceover: string;
};

type VideoPlan = {
  traceId: string;
  title: string;
  durationSec: number;
  format: string;
  style: string;
  audience: string;
  language: string;
  scenes: StoryScene[];
};

type RenderRequest = {
  plan?: unknown;
  sceneImages?: unknown;
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

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function hashText(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function wrapLines(value: string, maxChars: number, maxLines: number): string[] {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
      continue;
    }

    if (current) {
      lines.push(current);
      current = word;
    } else {
      lines.push(word.slice(0, maxChars));
      current = word.slice(maxChars);
    }

    if (lines.length >= maxLines) break;
  }

  if (lines.length < maxLines && current) {
    lines.push(current);
  }

  return lines.slice(0, maxLines);
}

function renderTextLines(lines: string[], x: number, startY: number, lineHeight: number): string {
  return lines
    .map((line, i) => `<tspan x="${x}" y="${startY + i * lineHeight}">${escapeXml(line)}</tspan>`)
    .join("");
}

function pickTheme(seed: string) {
  const themes = [
    { bg0: "#020617", bg1: "#0f172a", accent: "#34d399", accent2: "#60a5fa", card: "#0b1220" },
    { bg0: "#040816", bg1: "#10223f", accent: "#38bdf8", accent2: "#22d3ee", card: "#081325" },
    { bg0: "#0a0416", bg1: "#1f1240", accent: "#a78bfa", accent2: "#f472b6", card: "#120a25" },
    { bg0: "#10120b", bg1: "#1d2a1b", accent: "#84cc16", accent2: "#f59e0b", card: "#161d12" },
  ] as const;

  return themes[hashText(seed) % themes.length];
}

function makeSceneSvg(scene: StoryScene, plan: VideoPlan, index: number): string {
  const theme = pickTheme(`${plan.style}-${plan.traceId}-${index}`);
  const titleLines = wrapLines(plan.title, 26, 2);
  const overlayLines = wrapLines(scene.overlay, 22, 2);
  const visualLines = wrapLines(scene.visual, 46, 3);
  const voiceLines = wrapLines(scene.voiceover, 44, 2);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${theme.bg0}"/>
          <stop offset="100%" stop-color="${theme.bg1}"/>
        </linearGradient>
        <radialGradient id="glowA" cx="20%" cy="20%" r="90%">
          <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="glowB" cx="80%" cy="65%" r="80%">
          <stop offset="0%" stop-color="${theme.accent2}" stop-opacity="0.36"/>
          <stop offset="100%" stop-color="${theme.accent2}" stop-opacity="0"/>
        </radialGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="22"/>
        </filter>
      </defs>
      <rect width="1280" height="720" fill="url(#bg)"/>
      <rect width="1280" height="720" fill="url(#glowA)"/>
      <rect width="1280" height="720" fill="url(#glowB)"/>

      <g opacity="0.1" stroke="#ffffff">
        <path d="M60 110H1220M60 200H1220M60 290H1220M60 380H1220M60 470H1220M60 560H1220M60 650H1220"/>
        <path d="M90 70V660M260 70V660M430 70V660M600 70V660M770 70V660M940 70V660M1110 70V660"/>
      </g>

      <rect x="64" y="64" width="1152" height="592" rx="34" fill="#020617" fill-opacity="0.36" stroke="#334155"/>

      <rect x="96" y="96" width="510" height="420" rx="30" fill="${theme.card}" fill-opacity="0.92" stroke="${theme.accent}" stroke-opacity="0.45"/>
      <text x="132" y="138" font-size="15" fill="#94a3b8" font-family="Inter, Arial, sans-serif" letter-spacing="1.8">YAI STUDIO · SCENE ${index + 1}</text>
      <text x="132" y="173" font-size="20" fill="${theme.accent}" font-family="Inter, Arial, sans-serif" font-weight="700">T+${scene.atSec}s · ${escapeXml(plan.format)} · ${escapeXml(plan.style)}</text>
      <text x="132" y="232" font-size="42" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-weight="800">${renderTextLines(overlayLines, 132, 232, 48)}</text>
      <text x="132" y="332" font-size="22" fill="#cbd5e1" font-family="Inter, Arial, sans-serif" font-weight="600">${renderTextLines(titleLines, 132, 332, 30)}</text>

      <rect x="132" y="384" width="438" height="108" rx="18" fill="#020617" stroke="#334155"/>
      <text x="152" y="414" font-size="15" fill="#94a3b8" font-family="Inter, Arial, sans-serif" letter-spacing="1.2">VOICEOVER</text>
      <text x="152" y="440" font-size="18" fill="#e2e8f0" font-family="Inter, Arial, sans-serif">${renderTextLines(voiceLines, 152, 440, 24)}</text>

      <g transform="translate(646,118)">
        <rect width="530" height="378" rx="28" fill="#020617" fill-opacity="0.78" stroke="#475569"/>
        <rect x="24" y="24" width="482" height="250" rx="20" fill="#0f172a" stroke="#334155"/>
        <circle cx="64" cy="50" r="8" fill="#ef4444"/>
        <circle cx="90" cy="50" r="8" fill="#f59e0b"/>
        <circle cx="116" cy="50" r="8" fill="#10b981"/>
        <rect x="48" y="86" width="310" height="12" rx="6" fill="${theme.accent}" fill-opacity="0.75"/>
        <rect x="48" y="110" width="410" height="8" rx="4" fill="#334155"/>
        <rect x="48" y="130" width="368" height="8" rx="4" fill="#334155"/>
        <rect x="48" y="150" width="420" height="8" rx="4" fill="#334155"/>
        <text x="48" y="188" font-size="18" fill="#cbd5e1" font-family="Inter, Arial, sans-serif" font-weight="700">VISUAL DIRECTION</text>
        <text x="48" y="218" font-size="16" fill="#cbd5e1" font-family="Inter, Arial, sans-serif">${renderTextLines(visualLines, 48, 218, 24)}</text>
        <rect x="48" y="292" width="182" height="56" rx="14" fill="${theme.accent}"/>
        <text x="70" y="326" font-size="20" fill="#031220" font-family="Inter, Arial, sans-serif" font-weight="800">${escapeXml(scene.overlay).slice(0, 16)}</text>
      </g>

      <circle cx="1166" cy="552" r="56" fill="${theme.accent2}" fill-opacity="0.26" filter="url(#soft)"/>
      <circle cx="1146" cy="552" r="22" fill="${theme.accent2}"/>

      <rect x="64" y="668" width="1152" height="20" rx="10" fill="#0f172a"/>
      <rect x="64" y="668" width="${Math.round(((index + 1) / Math.max(plan.scenes.length, 1)) * 1152)}" height="20" rx="10" fill="${theme.accent}"/>

      <text x="100" y="634" font-size="16" fill="#94a3b8" font-family="Inter, Arial, sans-serif">Audience: ${escapeXml(plan.audience)} · Language: ${escapeXml(plan.language)}</text>
      <text x="1008" y="634" font-size="16" fill="#94a3b8" font-family="Inter, Arial, sans-serif" text-anchor="end">Trace ${escapeXml(plan.traceId).slice(-12)}</text>
      <text x="1160" y="46" font-size="13" fill="#94a3b8" font-family="Inter, Arial, sans-serif" text-anchor="end">PLAN_ONLY · GOVERNED RENDER</text>
    </svg>
  `.trim();
}

async function runFfmpeg(args: string[]) {
  await new Promise<void>((done, reject) => {
    const candidates = [
      ffmpegPath ? pathResolve(ffmpegPath) : "",
      pathResolve(process.cwd(), "node_modules/ffmpeg-static/ffmpeg"),
      pathResolve(process.cwd(), "node_modules/ffmpeg-static/ffmpeg.exe"),
      "/opt/homebrew/bin/ffmpeg",
      "ffmpeg",
    ].filter(Boolean);

    const command = candidates.find((candidate) => {
      if (!candidate) return false;
      if (candidate === "ffmpeg") return true;
      return existsSync(candidate);
    }) ?? "ffmpeg";

    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });

    let stderr = "";
    if (child.stderr) {
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
    }

    child.on("error", (error) => reject(error));
    child.on("close", (code) => {
      if (code === 0) {
        done();
      } else {
        reject(new Error(stderr || `ffmpeg exited with code ${code}`));
      }
    });
  });
}

function parsePlan(value: unknown): VideoPlan | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;

  const scenesRaw = Array.isArray(raw.scenes) ? raw.scenes : [];
  const scenes: StoryScene[] = scenesRaw
    .map((item) => {
      const row = item as Record<string, unknown>;
      return {
        atSec: asInt(row.atSec, 0),
        visual: asText(row.visual),
        overlay: asText(row.overlay),
        voiceover: asText(row.voiceover),
      };
    })
    .filter((scene) => scene.visual && scene.overlay && scene.voiceover);

  if (scenes.length === 0) return null;

  return {
    traceId: asText(raw.traceId, `yai-video-${randomUUID()}`),
    title: asText(raw.title, "YAI Video"),
    durationSec: Math.max(6, Math.min(90, asInt(raw.durationSec, 18))),
    format: asText(raw.format, "16:9"),
    style: asText(raw.style, "Premium Corporate"),
    audience: asText(raw.audience, "enterprise buyers"),
    language: asText(raw.language, "English"),
    scenes,
  };
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  let workingDir = "";

  try {
    const body = ((await request.json().catch(() => ({}))) ?? {}) as RenderRequest;
    const plan = parsePlan(body.plan);

    if (!plan) {
      return NextResponse.json({ message: "Valid plan with scenes is required." }, { status: 400 });
    }

    if (!ffmpegPath) {
      return NextResponse.json({ message: "MP4 renderer unavailable (ffmpeg missing)." }, { status: 503 });
    }

    workingDir = await mkdtemp(join(tmpdir(), "yai-video-render-"));

    const frameFiles: string[] = [];
    const sceneImages = Array.isArray(body.sceneImages)
      ? body.sceneImages.map((item) => (typeof item === "string" ? item : ""))
      : [];

    for (let i = 0; i < plan.scenes.length; i += 1) {
      const scene = plan.scenes[i];
      const framePath = join(workingDir, `frame-${String(i).padStart(3, "0")}.png`);

      const sceneImage = sceneImages[i];
      if (sceneImage && sceneImage.startsWith("data:image/")) {
        const base64Index = sceneImage.indexOf("base64,");
        if (base64Index > -1) {
          const base64 = sceneImage.slice(base64Index + "base64,".length);
          await sharp(Buffer.from(base64, "base64")).png().toFile(framePath);
        } else {
          const svgIndex = sceneImage.indexOf(",");
          const encoded = sceneImage.slice(svgIndex + 1);
          const svgText = decodeURIComponent(encoded);
          await sharp(Buffer.from(svgText)).png().toFile(framePath);
        }
      } else if (sceneImage && /^https?:\/\//.test(sceneImage)) {
        const imageResponse = await fetch(sceneImage);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch scene image (${imageResponse.status})`);
        }
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        await sharp(imageBuffer).png().toFile(framePath);
      } else {
        const svg = makeSceneSvg(scene, plan, i);
        await sharp(Buffer.from(svg)).png().toFile(framePath);
      }

      frameFiles.push(framePath);
    }

    const totalSeconds = Math.max(6, Math.min(24, plan.durationSec));
    const sceneSeconds = totalSeconds / frameFiles.length;
    const concatLines: string[] = [];

    for (const file of frameFiles) {
      concatLines.push(`file '${file.replace(/'/g, "'\\''")}'`);
      concatLines.push(`duration ${sceneSeconds.toFixed(3)}`);
    }

    concatLines.push(`file '${frameFiles[frameFiles.length - 1].replace(/'/g, "'\\''")}'`);

    const concatPath = join(workingDir, "frames.txt");
    const outPath = join(workingDir, "output.mp4");

    await writeFile(concatPath, `${concatLines.join("\n")}\n`, "utf8");

    await runFfmpeg([
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      concatPath,
      "-vf",
      "fps=30,format=yuv420p",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      outPath,
    ]);

    const file = await readFile(outPath);

    return new Response(file, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="${plan.traceId}.mp4"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "MP4 render failed.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    if (workingDir) {
      await rm(workingDir, { recursive: true, force: true }).catch(() => undefined);
    }
  }
}
