"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

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

type SceneAsset = {
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

  if (lines.length > maxLines) {
    return lines.slice(0, maxLines);
  }

  if (words.length > 0 && lines.length === maxLines) {
    const consumed = lines.join(" ").length;
    if (consumed < value.trim().length) {
      lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, Math.max(0, maxChars - 1))}…`;
    }
  }

  return lines;
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

function makeScenePreview(scene: StoryScene, plan: VideoPlan, index: number): string {
  const theme = pickTheme(`${plan.style}-${plan.traceId}-${index}`);
  const titleLines = wrapLines(plan.title, 26, 2);
  const overlayLines = wrapLines(scene.overlay, 22, 2);
  const visualLines = wrapLines(scene.visual, 46, 3);
  const voiceLines = wrapLines(scene.voiceover, 44, 2);

  const svg = `
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

      <text x="132" y="232" font-size="42" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-weight="800">
        ${renderTextLines(overlayLines, 132, 232, 48)}
      </text>

      <text x="132" y="332" font-size="22" fill="#cbd5e1" font-family="Inter, Arial, sans-serif" font-weight="600">
        ${renderTextLines(titleLines, 132, 332, 30)}
      </text>

      <rect x="132" y="384" width="438" height="108" rx="18" fill="#020617" stroke="#334155"/>
      <text x="152" y="414" font-size="15" fill="#94a3b8" font-family="Inter, Arial, sans-serif" letter-spacing="1.2">VOICEOVER</text>
      <text x="152" y="440" font-size="18" fill="#e2e8f0" font-family="Inter, Arial, sans-serif">
        ${renderTextLines(voiceLines, 152, 440, 24)}
      </text>

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
        <text x="48" y="218" font-size="16" fill="#cbd5e1" font-family="Inter, Arial, sans-serif">
          ${renderTextLines(visualLines, 48, 218, 24)}
        </text>
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

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.decoding = "async";
  image.src = src;
  await image.decode();
  return image;
}

async function renderVideoBlob(plan: VideoPlan, sceneSources?: string[]): Promise<Blob> {
  if (typeof document === "undefined") {
    throw new Error("Video rendering is only available in the browser.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas rendering is unavailable in this browser.");
  }

  const stream = canvas.captureStream(30);
  const mimeType = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ].find((type) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) ?? "video/webm";

  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };

  const previewSources = plan.scenes.map((scene, index) => sceneSources?.[index] ?? makeScenePreview(scene, plan, index));
  const images = await Promise.all(previewSources.map((source) => loadImage(source)));
  const totalSeconds = Math.max(6, Math.min(24, plan.durationSec));
  const sceneSeconds = totalSeconds / Math.max(images.length, 1);
  const startedAt = performance.now();

  const drawFrame = () => {
    const elapsed = (performance.now() - startedAt) / 1000;
    const currentIndex = Math.min(images.length - 1, Math.floor(elapsed / sceneSeconds));
    const current = images[currentIndex] ?? images[0];

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(current, 0, 0, canvas.width, canvas.height);

    const progress = Math.min(1, elapsed / totalSeconds);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(72, 670, 1136, 10);
    ctx.fillStyle = "rgba(52,211,153,0.92)";
    ctx.fillRect(72, 670, 1136 * progress, 10);
  };

  drawFrame();

  return await new Promise<Blob>((resolve, reject) => {
    const tick = window.setInterval(drawFrame, 1000 / 30);

    recorder.onerror = () => {
      window.clearInterval(tick);
      reject(new Error("Video recorder failed during capture."));
    };

    recorder.onstop = () => {
      window.clearInterval(tick);
      resolve(new Blob(chunks, { type: mimeType }));
    };

    recorder.start();
    window.setTimeout(() => {
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    }, totalSeconds * 1000);
  });
}

export function VideoMakerClient() {
  const [brief, setBrief] = useState("");
  const [durationSec, setDurationSec] = useState(30);
  const [format, setFormat] = useState("9:16");
  const [style, setStyle] = useState("Premium Corporate");
  const [audience, setAudience] = useState("enterprise buyers");
  const [language, setLanguage] = useState("English");

  const [sending, setSending] = useState(false);
  const [runtimeSource, setRuntimeSource] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [plan, setPlan] = useState<VideoPlan | null>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [rendering, setRendering] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoError, setVideoError] = useState<string>("");
  const [renderingMp4, setRenderingMp4] = useState(false);
  const [mp4Url, setMp4Url] = useState<string>("");
  const [mp4Error, setMp4Error] = useState<string>("");
  const [sceneAssets, setSceneAssets] = useState<Record<number, string>>({});
  const [generatingAssets, setGeneratingAssets] = useState(false);
  const [assetError, setAssetError] = useState("");
  const generatedSceneCount = Object.keys(sceneAssets).length;
  const totalSceneCount = plan?.scenes.length ?? 0;

  async function requestSceneAssets(nextPlan: VideoPlan) {
    setGeneratingAssets(true);
    setAssetError("");

    try {
      const response = await fetch("/api/yai-studio/video-maker/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: nextPlan }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { message?: string; detail?: string };
        throw new Error(data.detail || data.message || "Scene asset generation failed.");
      }

      const data = (await response.json()) as {
        assets?: SceneAsset[];
      };

      if (!Array.isArray(data.assets) || data.assets.length === 0) {
        throw new Error("No scene assets returned.");
      }

      const next: Record<number, string> = {};
      for (const asset of data.assets) {
        if (typeof asset.index === "number" && typeof asset.imageDataUrl === "string" && asset.imageDataUrl) {
          next[asset.index] = asset.imageDataUrl;
        }
      }

      if (Object.keys(next).length === 0) {
        throw new Error("Asset payload was empty.");
      }

      setSceneAssets(next);
    } catch (err) {
      setAssetError(err instanceof Error ? err.message : "Scene asset generation failed.");
    } finally {
      setGeneratingAssets(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!brief.trim() || sending) return;

    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/yai-studio/video-maker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief,
          durationSec,
          format,
          style,
          audience,
          language,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        runtimeSource?: string;
        model?: string;
        plan?: VideoPlan;
      };

      if (!response.ok || !data.plan) {
        throw new Error(data.message ?? "Request failed");
      }

      setRuntimeSource(data.runtimeSource ?? "local-fallback");
      setModel(data.model ?? "yai-video-local");
      setPlan(data.plan);
      setActiveScene(0);
      setVideoError("");
      setMp4Error("");
      setVideoUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return "";
      });
      setMp4Url((current) => {
        if (current) URL.revokeObjectURL(current);
        return "";
      });
      setSceneAssets({});
      setAssetError("");
      void requestSceneAssets(data.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setPlan(null);
      setVideoUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return "";
      });
      setMp4Url((current) => {
        if (current) URL.revokeObjectURL(current);
        return "";
      });
      setSceneAssets({});
    } finally {
      setSending(false);
    }
  }

  async function onGenerateSceneAssets() {
    if (!plan || generatingAssets) return;
    await requestSceneAssets(plan);
  }

  async function onRenderVideo() {
    if (!plan || rendering) return;

    setRendering(true);
    setVideoError("");

    try {
      const blob = await renderVideoBlob(
        plan,
        plan.scenes.map((_, index) => sceneAssets[index] ?? makeScenePreview(plan.scenes[index], plan, index))
      );
      const url = URL.createObjectURL(blob);
      setVideoUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return url;
      });
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : "Video rendering failed.");
    } finally {
      setRendering(false);
    }
  }

  async function onRenderMp4() {
    if (!plan || renderingMp4) return;

    setRenderingMp4(true);
    setMp4Error("");

    try {
      const response = await fetch("/api/yai-studio/video-maker/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          sceneImages: plan.scenes.map((_, index) => sceneAssets[index] ?? ""),
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { message?: string; detail?: string };
        throw new Error(data.detail || data.message || "MP4 render failed.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setMp4Url((current) => {
        if (current) URL.revokeObjectURL(current);
        return url;
      });
    } catch (err) {
      setMp4Error(err instanceof Error ? err.message : "MP4 render failed.");
    } finally {
      setRenderingMp4(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">YAI Studio · Video Maker</div>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Generate governed video plans</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            This app creates storyboard and script plans only. Publishing is blocked by default.
            Every output is marked <strong>PLAN_ONLY</strong> and requires human approval.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs">
            <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-emerald-200">Decision: PLAN_ONLY</span>
            <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 text-amber-200">No auto publish</span>
            <span className="rounded-full border border-white/20 px-3 py-1 text-slate-300">
              <Link href="/bpbsolutionsltd/yai-studio" className="hover:text-white">← Back to YAI Studio</Link>
            </span>
          </div>
        </div>
      </section>

      <section className="px-5 py-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[420px_1fr]">
          <form onSubmit={onSubmit} className="border border-white/10 bg-white/[0.03] p-5">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Brief</label>
                <textarea
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="Example: Create a 30-second launch video for YAI Studio positioned for enterprise buyers and public-sector innovation teams."
                  className="min-h-36 w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-300/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Duration</label>
                  <select
                    value={durationSec}
                    onChange={(e) => setDurationSec(Number(e.target.value))}
                    className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-emerald-300/50"
                  >
                    <option value={15}>15 sec</option>
                    <option value={30}>30 sec</option>
                    <option value={60}>60 sec</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-emerald-300/50"
                  >
                    <option>9:16</option>
                    <option>16:9</option>
                    <option>1:1</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Style</label>
                  <input
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-emerald-300/50"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Language</label>
                  <input
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-emerald-300/50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Audience</label>
                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-emerald-300/50"
                />
              </div>

              <button
                type="submit"
                disabled={sending || !brief.trim()}
                className="w-full border border-emerald-300/40 bg-emerald-300/20 px-4 py-3 text-sm font-semibold text-emerald-100 hover:border-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Generating plan..." : "Generate Video Plan"}
              </button>
            </div>
          </form>

          <section className="border border-white/10 bg-white/[0.02] p-5">
            {!plan && !error && (
              <div className="text-sm text-slate-400">
                Submit a brief to generate a structured storyboard, script, and caption package.
              </div>
            )}

            {error && (
              <div className="rounded border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}

            {plan && (
              <div className="space-y-5">
                <div className="border-b border-white/10 pb-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Output</div>
                  <h2 className="mt-2 text-2xl font-semibold">{plan.title}</h2>
                  <p className="mt-2 text-sm text-slate-300">{plan.hook}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-white/20 px-2 py-1 text-slate-300">Trace: {plan.traceId}</span>
                    <span className="rounded-full border border-white/20 px-2 py-1 text-slate-300">{plan.durationSec}s · {plan.format}</span>
                    <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-2 py-1 text-emerald-200">{plan.governance.decision}</span>
                    <span className="rounded-full border border-white/20 px-2 py-1 text-slate-300">Runtime: {runtimeSource}</span>
                    <span className="rounded-full border border-white/20 px-2 py-1 text-slate-300">Model: {model}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Scenes</h3>
                  <div className="mt-3 space-y-3">
                    {plan.scenes.map((scene, idx) => (
                      <article key={`${scene.atSec}-${idx}`} className="border border-white/10 bg-black/30 p-4">
                        <div className="text-xs uppercase tracking-[0.16em] text-emerald-300">T+{scene.atSec}s · {scene.overlay}</div>
                        <div className="mt-2 text-sm text-white"><strong>Visual:</strong> {scene.visual}</div>
                        <div className="mt-1 text-sm text-slate-300"><strong>Voice:</strong> {scene.voiceover}</div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Visual Preview</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                      <button
                        type="button"
                        onClick={onGenerateSceneAssets}
                        disabled={generatingAssets || !plan}
                        className="rounded border border-violet-300/40 bg-violet-300/15 px-3 py-1 text-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {generatingAssets ? "Generating AI visuals..." : "Generate AI Visuals"}
                      </button>
                      {plan.scenes.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveScene(idx)}
                          className={`rounded-full border px-2 py-1 transition ${idx === activeScene ? "border-emerald-300/60 bg-emerald-300/15 text-emerald-100" : "border-white/15 bg-white/5 text-slate-400"}`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                  {generatingAssets && (
                    <div
                      aria-live="polite"
                      className="rounded border border-violet-300/30 bg-violet-300/10 px-4 py-3 text-sm text-violet-100"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-violet-200/40 border-t-violet-100" />
                        <div>
                          <div className="font-medium">Generating AI visuals for {totalSceneCount} scene{totalSceneCount === 1 ? "" : "s"}.</div>
                          <div className="mt-1 text-xs text-violet-100/80">Template previews stay interactive while the higher-fidelity images render. This can take a few seconds.</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {!generatingAssets && generatedSceneCount > 0 && generatedSceneCount === totalSceneCount && (
                    <div className="rounded border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
                      AI visuals ready for all scenes. Preview and MP4 rendering now use the generated images.
                    </div>
                  )}
                  {plan.scenes[activeScene] && (
                    <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                      <div className="relative">
                        <img
                          src={sceneAssets[activeScene] ?? makeScenePreview(plan.scenes[activeScene], plan, activeScene)}
                          alt={`Storyboard preview ${activeScene + 1}`}
                          className="w-full border border-white/10 bg-black/30 object-cover"
                        />
                        {generatingAssets && !sceneAssets[activeScene] && (
                          <div className="absolute inset-0 flex items-center justify-center border border-white/10 bg-slate-950/55 backdrop-blur-sm">
                            <div className="rounded border border-violet-300/30 bg-slate-950/80 px-4 py-3 text-center text-sm text-violet-100 shadow-lg shadow-black/30">
                              <div className="mx-auto mb-2 h-5 w-5 animate-spin rounded-full border-2 border-violet-200/30 border-t-violet-100" />
                              Rendering AI visual…
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
                        <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Rendered Scene</div>
                        <p className="mt-2 text-xs text-slate-400">
                          Source: {sceneAssets[activeScene] ? "model-generated image" : "template render"}
                        </p>
                        <p className="mt-2"><strong>Overlay:</strong> {plan.scenes[activeScene].overlay}</p>
                        <p className="mt-2"><strong>Visual:</strong> {plan.scenes[activeScene].visual}</p>
                        <p className="mt-2"><strong>Voice:</strong> {plan.scenes[activeScene].voiceover}</p>
                        <p className="mt-2 text-slate-400">This preview is rendered locally from the plan so you can see the visuals immediately.</p>
                      </div>
                    </div>
                  )}
                  {assetError && <div className="rounded border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{assetError}</div>}
                </div>

                <div className="space-y-3 border border-white/10 bg-black/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Actual Video File</div>
                      <p className="mt-1 text-sm text-slate-300">Render downloadable WebM (browser) or MP4 (server) from the generated storyboard.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={onRenderVideo}
                        disabled={rendering || !plan}
                        className="rounded border border-emerald-300/40 bg-emerald-300/20 px-4 py-2 text-sm font-semibold text-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {rendering ? "Rendering WebM..." : "Render WebM"}
                      </button>
                      <button
                        type="button"
                        onClick={onRenderMp4}
                        disabled={renderingMp4 || !plan}
                        className="rounded border border-blue-300/40 bg-blue-300/15 px-4 py-2 text-sm font-semibold text-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {renderingMp4 ? "Rendering MP4..." : "Render MP4"}
                      </button>
                    </div>
                  </div>

                  {videoError && <div className="rounded border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{videoError}</div>}
                  {mp4Error && <div className="rounded border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{mp4Error}</div>}

                  {videoUrl && (
                    <div className="space-y-3">
                      <video src={videoUrl} controls className="w-full border border-white/10 bg-black" />
                      <a
                        href={videoUrl}
                        download={`${plan?.traceId ?? "yai-video"}.webm`}
                        className="inline-flex rounded border border-white/15 px-4 py-2 text-sm text-white hover:border-emerald-300/60 hover:text-emerald-100"
                      >
                        Download WebM
                      </a>
                    </div>
                  )}

                  {mp4Url && (
                    <div className="space-y-3">
                      <video src={mp4Url} controls className="w-full border border-white/10 bg-black" />
                      <a
                        href={mp4Url}
                        download={`${plan?.traceId ?? "yai-video"}.mp4`}
                        className="inline-flex rounded border border-white/15 px-4 py-2 text-sm text-white hover:border-blue-300/60 hover:text-blue-100"
                      >
                        Download MP4
                      </a>
                    </div>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Caption</div>
                    <p className="mt-2">{plan.caption}</p>
                  </div>
                  <div className="border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-400">CTA</div>
                    <p className="mt-2">{plan.cta}</p>
                    <div className="mt-3 text-xs text-slate-400">{plan.hashtags.join(" ")}</div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
