"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

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

type ConceptAsset = {
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

  return lines.slice(0, maxLines);
}

function renderTextLines(lines: string[], x: number, startY: number, lineHeight: number): string {
  return lines
    .map((line, i) => `<tspan x="${x}" y="${startY + i * lineHeight}">${escapeXml(line)}</tspan>`)
    .join("");
}

function pickTheme(seed: string) {
  const themes = [
    { bg0: "#020617", bg1: "#1e293b", accent: "#34d399", accent2: "#60a5fa", card: "#0b1220" },
    { bg0: "#030712", bg1: "#172554", accent: "#38bdf8", accent2: "#22d3ee", card: "#08152a" },
    { bg0: "#0f0a1f", bg1: "#3b0764", accent: "#a78bfa", accent2: "#f472b6", card: "#190f2d" },
    { bg0: "#0c1113", bg1: "#134e4a", accent: "#2dd4bf", accent2: "#84cc16", card: "#0f1f22" },
  ] as const;

  return themes[hashText(seed) % themes.length];
}

function makePromptPreview(plan: ImagePlan, item: ImagePrompt): string {
  const theme = pickTheme(`${plan.traceId}-${plan.style}-${item.index}`);
  const overlayLines = wrapLines(item.overlayText, 20, 2);
  const titleLines = wrapLines(item.title, 24, 2);
  const briefLines = wrapLines(plan.brief, 34, 3);
  const promptLines = wrapLines(item.prompt, 40, 4);
  const negative = escapeXml(item.negativePrompt.slice(0, 90));

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${theme.bg0}"/>
          <stop offset="100%" stop-color="${theme.bg1}"/>
        </linearGradient>
        <radialGradient id="glowA" cx="20%" cy="20%" r="80%">
          <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.44"/>
          <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="glowB" cx="80%" cy="70%" r="80%">
          <stop offset="0%" stop-color="${theme.accent2}" stop-opacity="0.34"/>
          <stop offset="100%" stop-color="${theme.accent2}" stop-opacity="0"/>
        </radialGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="16"/>
        </filter>
      </defs>
      <rect width="1080" height="1080" fill="url(#bg)"/>
      <rect width="1080" height="1080" fill="url(#glowA)"/>
      <rect width="1080" height="1080" fill="url(#glowB)"/>

      <g opacity="0.11" stroke="#e2e8f0">
        <path d="M90 160H990M90 280H990M90 400H990M90 520H990M90 640H990M90 760H990M90 880H990"/>
        <path d="M160 90V990M310 90V990M460 90V990M610 90V990M760 90V990M910 90V990"/>
      </g>

      <rect x="78" y="78" width="924" height="924" rx="50" fill="#020617" fill-opacity="0.54" stroke="#334155"/>

      <rect x="122" y="122" width="836" height="358" rx="34" fill="${theme.card}" fill-opacity="0.9" stroke="${theme.accent}" stroke-opacity="0.45"/>
      <text x="162" y="170" font-size="16" fill="#94a3b8" font-family="Inter, Arial, sans-serif" letter-spacing="1.6">YAI STUDIO · CONCEPT ${item.index}</text>
      <text x="162" y="208" font-size="20" fill="${theme.accent}" font-family="Inter, Arial, sans-serif" font-weight="700">${escapeXml(plan.aspectRatio)} · ${escapeXml(plan.style)} · ${escapeXml(plan.palette)}</text>

      <text x="162" y="282" font-size="56" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-weight="800">
        ${renderTextLines(overlayLines, 162, 282, 62)}
      </text>

      <text x="162" y="380" font-size="26" fill="#cbd5e1" font-family="Inter, Arial, sans-serif" font-weight="600">
        ${renderTextLines(titleLines, 162, 380, 34)}
      </text>

      <rect x="122" y="522" width="836" height="326" rx="34" fill="#0b1323" fill-opacity="0.92" stroke="#334155"/>
      <text x="162" y="570" font-size="17" fill="#94a3b8" font-family="Inter, Arial, sans-serif" letter-spacing="1.3">BRIEF</text>
      <text x="162" y="602" font-size="26" fill="#e2e8f0" font-family="Inter, Arial, sans-serif">${renderTextLines(briefLines, 162, 602, 32)}</text>

      <text x="162" y="716" font-size="17" fill="#94a3b8" font-family="Inter, Arial, sans-serif" letter-spacing="1.3">PROMPT DIRECTION</text>
      <text x="162" y="748" font-size="20" fill="#cbd5e1" font-family="Inter, Arial, sans-serif">${renderTextLines(promptLines, 162, 748, 28)}</text>

      <circle cx="900" cy="910" r="64" fill="${theme.accent2}" fill-opacity="0.28" filter="url(#soft)"/>
      <circle cx="880" cy="910" r="24" fill="${theme.accent2}"/>

      <rect x="122" y="936" width="836" height="40" rx="20" fill="#0f172a"/>
      <rect x="122" y="936" width="${Math.round((item.index / Math.max(plan.count, 1)) * 836)}" height="40" rx="20" fill="${theme.accent}"/>

      <text x="142" y="906" font-size="16" fill="#94a3b8" font-family="Inter, Arial, sans-serif">Audience: ${escapeXml(plan.audience)}</text>
      <text x="940" y="906" font-size="16" fill="#94a3b8" font-family="Inter, Arial, sans-serif" text-anchor="end">Negative: ${negative}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

async function svgPreviewToPngUrl(svgDataUrl: string): Promise<string> {
  const image = new Image();
  image.decoding = "async";
  image.src = svgDataUrl;
  await image.decode();

  const canvas = document.createElement("canvas");
  canvas.width = image.width || 1080;
  canvas.height = image.height || 1080;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas rendering is unavailable in this browser.");
  }

  ctx.drawImage(image, 0, 0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => {
      if (!value) reject(new Error("PNG export failed."));
      else resolve(value);
    }, "image/png");
  });

  return URL.createObjectURL(blob);
}

export function ImageGeneratorClient() {
  const [brief, setBrief] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [style, setStyle] = useState("Premium Corporate");
  const [audience, setAudience] = useState("enterprise buyers");
  const [palette, setPalette] = useState("Emerald, Slate, White");
  const [count, setCount] = useState(4);

  const [sending, setSending] = useState(false);
  const [runtimeSource, setRuntimeSource] = useState("");
  const [model, setModel] = useState("");
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<ImagePlan | null>(null);
  const [exportingIndex, setExportingIndex] = useState<number | null>(null);
  const [exportError, setExportError] = useState("");
  const [downloadUrls, setDownloadUrls] = useState<Record<number, string>>({});
  const [generatingAssets, setGeneratingAssets] = useState(false);
  const [assetError, setAssetError] = useState("");
  const [conceptAssets, setConceptAssets] = useState<Record<number, string>>({});
  const generatedConceptCount = Object.keys(conceptAssets).length;
  const totalConceptCount = plan?.prompts.length ?? 0;

  async function requestConceptAssets(nextPlan: ImagePlan) {
    setGeneratingAssets(true);
    setAssetError("");

    try {
      const response = await fetch("/api/yai-studio/image-generator/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: nextPlan }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { message?: string; detail?: string };
        throw new Error(data.detail || data.message || "Concept asset generation failed.");
      }

      const data = (await response.json()) as { assets?: ConceptAsset[] };

      if (!Array.isArray(data.assets) || data.assets.length === 0) {
        throw new Error("No concept images were returned.");
      }

      const next: Record<number, string> = {};
      for (const asset of data.assets) {
        if (typeof asset.index === "number" && typeof asset.imageDataUrl === "string" && asset.imageDataUrl) {
          next[asset.index] = asset.imageDataUrl;
        }
      }

      if (Object.keys(next).length === 0) {
        throw new Error("Concept image payload was empty.");
      }

      setConceptAssets(next);
    } catch (err) {
      setAssetError(err instanceof Error ? err.message : "Concept asset generation failed.");
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
      const response = await fetch("/api/yai-studio/image-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, aspectRatio, style, audience, palette, count }),
      });

      const data = (await response.json()) as {
        message?: string;
        runtimeSource?: string;
        model?: string;
        plan?: ImagePlan;
      };

      if (!response.ok || !data.plan) {
        throw new Error(data.message ?? "Request failed");
      }

      setRuntimeSource(data.runtimeSource ?? "local-fallback");
      setModel(data.model ?? "yai-image-local");
      setPlan(data.plan);
      setDownloadUrls((current) => {
        Object.values(current).forEach((url) => URL.revokeObjectURL(url));
        return {};
      });
      setExportError("");
      setAssetError("");
      setConceptAssets({});
      void requestConceptAssets(data.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setPlan(null);
    } finally {
      setSending(false);
    }
  }

  async function onDownloadPng(item: ImagePrompt) {
    if (!plan || exportingIndex !== null) return;

    setExportError("");
    setExportingIndex(item.index);

    try {
      const generatedAsset = conceptAssets[item.index];
      if (generatedAsset) {
        const anchor = document.createElement("a");
        anchor.href = generatedAsset;
        anchor.download = `${plan.traceId}-concept-${item.index}.png`;
        anchor.click();
        return;
      }

      const svg = makePromptPreview(plan, item);
      const url = await svgPreviewToPngUrl(svg);
      setDownloadUrls((current) => {
        const previous = current[item.index];
        if (previous) URL.revokeObjectURL(previous);
        return { ...current, [item.index]: url };
      });

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${plan.traceId}-concept-${item.index}.png`;
      anchor.click();
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "PNG export failed.");
    } finally {
      setExportingIndex(null);
    }
  }

  async function onGenerateConceptAssets() {
    if (!plan || generatingAssets) return;
    await requestConceptAssets(plan);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">YAI Studio · Image Generator</div>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Generate governed image prompt sets</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            This module generates planning prompts and concept directions. It does not publish assets.
            Output is always <strong>PLAN_ONLY</strong> and requires human approval.
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
                  placeholder="Example: Generate 4 social visuals announcing YAI Studio for enterprise and public-sector audiences."
                  className="min-h-32 w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-300/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Aspect ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-emerald-300/50"
                  >
                    <option>1:1</option>
                    <option>9:16</option>
                    <option>16:9</option>
                    <option>4:5</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Concept count</label>
                  <select
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-emerald-300/50"
                  >
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={6}>6</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Style</label>
                <input
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-emerald-300/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Audience</label>
                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-emerald-300/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Palette</label>
                <input
                  value={palette}
                  onChange={(e) => setPalette(e.target.value)}
                  className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-emerald-300/50"
                />
              </div>

              <button
                type="submit"
                disabled={sending || !brief.trim()}
                className="w-full border border-emerald-300/40 bg-emerald-300/20 px-4 py-3 text-sm font-semibold text-emerald-100 hover:border-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Generating prompt set..." : "Generate Prompt Set"}
              </button>
            </div>
          </form>

          <section className="border border-white/10 bg-white/[0.02] p-5">
            {!plan && !error && <div className="text-sm text-slate-400">Submit a brief to generate concept prompts and overlays.</div>}

            {error && (
              <div className="rounded border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}

            {plan && (
              <div className="space-y-5">
                <div className="border-b border-white/10 pb-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Output</div>
                  <h2 className="mt-2 text-2xl font-semibold">Image Prompt Plan</h2>
                  <p className="mt-2 text-sm text-slate-300">{plan.brief}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-white/20 px-2 py-1 text-slate-300">Trace: {plan.traceId}</span>
                    <span className="rounded-full border border-white/20 px-2 py-1 text-slate-300">{plan.aspectRatio} · {plan.count} concepts</span>
                    <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-2 py-1 text-emerald-200">{plan.governance.decision}</span>
                    <span className="rounded-full border border-white/20 px-2 py-1 text-slate-300">Runtime: {runtimeSource}</span>
                    <span className="rounded-full border border-white/20 px-2 py-1 text-slate-300">Model: {model}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={onGenerateConceptAssets}
                      disabled={generatingAssets || !plan}
                      className="rounded border border-violet-300/40 bg-violet-300/15 px-3 py-2 text-xs font-semibold text-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {generatingAssets ? "Generating AI visuals..." : "Generate AI Visuals"}
                    </button>
                  </div>
                  {generatingAssets && (
                    <div
                      aria-live="polite"
                      className="rounded border border-violet-300/30 bg-violet-300/10 px-4 py-3 text-sm text-violet-100"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-violet-200/40 border-t-violet-100" />
                        <div>
                          <div className="font-medium">Generating AI visuals for {totalConceptCount} concept{totalConceptCount === 1 ? "" : "s"}.</div>
                          <div className="mt-1 text-xs text-violet-100/80">Template previews remain visible until the generated images finish loading.</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {!generatingAssets && generatedConceptCount > 0 && generatedConceptCount === totalConceptCount && (
                    <div className="rounded border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
                      AI visuals ready for all concepts. Downloads now prefer the generated images.
                    </div>
                  )}
                  {plan.prompts.map((item) => (
                    <article key={item.index} className="border border-white/10 bg-black/30 p-4 text-sm">
                      <div className="text-xs uppercase tracking-[0.16em] text-emerald-300">Concept {item.index} · {item.overlayText}</div>
                      <div className="mt-2 text-white"><strong>{item.title}</strong></div>
                      <p className="mt-2 text-slate-300"><strong>Prompt:</strong> {item.prompt}</p>
                      <p className="mt-2 text-slate-400"><strong>Negative:</strong> {item.negativePrompt}</p>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => onDownloadPng(item)}
                          disabled={exportingIndex !== null}
                          className="rounded border border-emerald-300/40 bg-emerald-300/15 px-3 py-2 text-xs font-semibold text-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {exportingIndex === item.index ? "Exporting PNG..." : "Download PNG"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Visual Previews</h3>
                  <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {plan.prompts.map((item) => (
                      <figure key={`preview-${item.index}`} className="overflow-hidden border border-white/10 bg-black/30">
                        <div className="relative">
                          <img
                            src={conceptAssets[item.index] ?? makePromptPreview(plan, item)}
                            alt={item.title}
                            className="aspect-square w-full object-cover"
                          />
                          {generatingAssets && !conceptAssets[item.index] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55 backdrop-blur-sm">
                              <div className="rounded border border-violet-300/30 bg-slate-950/80 px-4 py-3 text-center text-sm text-violet-100 shadow-lg shadow-black/30">
                                <div className="mx-auto mb-2 h-5 w-5 animate-spin rounded-full border-2 border-violet-200/30 border-t-violet-100" />
                                Rendering AI visual…
                              </div>
                            </div>
                          )}
                        </div>
                        <figcaption className="border-t border-white/10 p-3 text-xs text-slate-300">
                          <div className="font-semibold text-white">{item.title}</div>
                          <div className="mt-1 text-slate-400">{item.overlayText}</div>
                          <div className="mt-1 text-[11px] text-slate-500">
                            Source: {conceptAssets[item.index] ? "model-generated image" : "template render"}
                          </div>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-400">These are rendered previews generated locally from the prompt plan so the module produces visible creative output immediately.</p>
                </div>

                {exportError && <div className="rounded border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{exportError}</div>}
                {assetError && <div className="rounded border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{assetError}</div>}

                <div className="border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Caption & Hashtags</div>
                  <p className="mt-2">{plan.caption}</p>
                  <div className="mt-2 text-xs text-slate-400">{plan.hashtags.join(" ")}</div>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
