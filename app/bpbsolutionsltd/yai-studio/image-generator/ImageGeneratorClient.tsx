"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BackNavButton from "../../../components/BackNavButton";

type ImagePrompt = { index: number; title: string; prompt: string; negativePrompt: string; overlayText: string };
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
  governance: { decision: "PLAN_ONLY"; requiresHumanApproval: true; publishAllowed: false };
};

const smartExamples = [
  { label: "Governance explainer", brief: "Create 4 premium concept visuals for a runtime governance explainer showing authority, admissibility, execution gate, and evidence for enterprise AI.", aspectRatio: "1:1", style: "Premium Corporate", audience: "enterprise buyers", palette: "Emerald, Slate, White", count: 4 },
  { label: "YAI Studio launch", brief: "Create 4 launch images for YAI Studio that communicate governed generation for video, image, voice, and marketing workflows with human approval before publish.", aspectRatio: "1:1", style: "Cinematic Corporate", audience: "CTOs and innovation leads", palette: "Cyan, Midnight, White", count: 4 },
  { label: "Runtime demo", brief: "Create 6 architecture visuals for a runtime governance demo showing the execution boundary, ALLOW or DENY decision, evidence trace, and working platform proof.", aspectRatio: "16:9", style: "Architecture Showcase", audience: "enterprise architects", palette: "Slate, Blue, Teal", count: 6 },
] as const;

function escapeXml(value: string) { return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"); }
function hashText(value: string) { let hash = 0; for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) >>> 0; return hash; }
function wrapLines(value: string, maxChars: number, maxLines: number) { const words = value.trim().split(/\s+/).filter(Boolean); const lines: string[] = []; let current = ""; for (const word of words) { const next = current ? `${current} ${word}` : word; if (next.length <= maxChars) { current = next; continue; } if (current) { lines.push(current); current = word; } else { lines.push(word.slice(0, maxChars)); current = word.slice(maxChars); } if (lines.length >= maxLines) break; } if (lines.length < maxLines && current) lines.push(current); return lines.slice(0, maxLines); }
function renderTextLines(lines: string[], x: number, startY: number, lineHeight: number) { return lines.map((line, i) => `<tspan x="${x}" y="${startY + i * lineHeight}">${escapeXml(line)}</tspan>`).join(""); }
function pickTheme(seed: string) { const themes = [{ bg0: "#020617", bg1: "#1e293b", accent: "#34d399", accent2: "#60a5fa", card: "#0b1220" }, { bg0: "#030712", bg1: "#172554", accent: "#38bdf8", accent2: "#22d3ee", card: "#08152a" }, { bg0: "#0f0a1f", bg1: "#3b0764", accent: "#a78bfa", accent2: "#f472b6", card: "#190f2d" }, { bg0: "#0c1113", bg1: "#134e4a", accent: "#2dd4bf", accent2: "#84cc16", card: "#0f1f22" } ] as const; return themes[hashText(seed) % themes.length]; }
function makePromptPreview(plan: ImagePlan, item: ImagePrompt) { const theme = pickTheme(`${plan.traceId}-${plan.style}-${item.index}`); const overlayLines = wrapLines(item.overlayText, 20, 2); const titleLines = wrapLines(item.title, 24, 2); const briefLines = wrapLines(plan.brief, 34, 3); const promptLines = wrapLines(item.prompt, 40, 4); const negative = escapeXml(item.negativePrompt.slice(0, 90)); return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
<defs><linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="${theme.bg0}"/><stop offset="100%" stop-color="${theme.bg1}"/></linearGradient></defs>
<rect width="1080" height="1080" fill="url(#bg)"/>
<rect x="78" y="78" width="924" height="924" rx="50" fill="#020617" fill-opacity="0.54" stroke="#334155"/>
<rect x="122" y="122" width="836" height="358" rx="34" fill="${theme.card}" fill-opacity="0.9" stroke="${theme.accent}" stroke-opacity="0.45"/>
<text x="162" y="170" font-size="16" fill="#94a3b8" font-family="Inter, Arial, sans-serif" letter-spacing="1.6">YAI STUDIO · CONCEPT ${item.index}</text>
<text x="162" y="208" font-size="20" fill="${theme.accent}" font-family="Inter, Arial, sans-serif" font-weight="700">${escapeXml(plan.aspectRatio)} · ${escapeXml(plan.style)} · ${escapeXml(plan.palette)}</text>
<text x="162" y="282" font-size="56" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-weight="800">${renderTextLines(overlayLines, 162, 282, 62)}</text>
<text x="162" y="380" font-size="26" fill="#cbd5e1" font-family="Inter, Arial, sans-serif" font-weight="600">${renderTextLines(titleLines, 162, 380, 34)}</text>
<rect x="122" y="522" width="836" height="326" rx="34" fill="#0b1323" fill-opacity="0.92" stroke="#334155"/>
<text x="162" y="570" font-size="17" fill="#94a3b8" font-family="Inter, Arial, sans-serif" letter-spacing="1.3">BRIEF</text>
<text x="162" y="602" font-size="26" fill="#e2e8f0" font-family="Inter, Arial, sans-serif">${renderTextLines(briefLines, 162, 602, 32)}</text>
<text x="162" y="716" font-size="17" fill="#94a3b8" font-family="Inter, Arial, sans-serif" letter-spacing="1.3">PROMPT DIRECTION</text>
<text x="162" y="748" font-size="20" fill="#cbd5e1" font-family="Inter, Arial, sans-serif">${renderTextLines(promptLines, 162, 748, 28)}</text>
<text x="142" y="906" font-size="16" fill="#94a3b8" font-family="Inter, Arial, sans-serif">Audience: ${escapeXml(plan.audience)}</text>
<text x="940" y="906" font-size="16" fill="#94a3b8" font-family="Inter, Arial, sans-serif" text-anchor="end">Negative: ${negative}</text>
</svg>` )}`; }

function fallbackPlan(input: { traceId: string; brief: string; aspectRatio: string; style: string; audience: string; palette: string; count: number }): ImagePlan {
  const prompts = Array.from({ length: input.count }, (_, i) => ({ index: i + 1, title: `Concept ${i + 1}`, overlayText: i === 0 ? "Business Context" : i === input.count - 1 ? "Outcome" : `Proof ${i}`, prompt: `Create a ${input.aspectRatio} enterprise campaign visual in ${input.style} style. Audience: ${input.audience}. Palette: ${input.palette}. Core brief: ${input.brief}.`, negativePrompt: "No logos of third parties, no distorted text, no crowded composition, no unrealistic hands, no watermark." }));
  return { traceId: input.traceId, brief: input.brief, aspectRatio: input.aspectRatio, style: input.style, audience: input.audience, palette: input.palette, count: input.count, prompts, caption: "Draft creative concepts generated as planning output only. Human approval required before publication.", hashtags: ["#YAIStudio", "#ImageGenerator", "#GovernedAI", "#BPBSolutions"], governance: { decision: "PLAN_ONLY", requiresHumanApproval: true, publishAllowed: false } };
}

type ConceptAsset = { index: number; imageDataUrl: string };

async function renderPlanFromApi(input: { brief: string; aspectRatio: string; style: string; audience: string; palette: string; count: number }) {
  const response = await fetch("/api/yai-studio/image-generator", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = (await response.json().catch(() => ({}))) as { plan?: ImagePlan; runtimeSource?: string; model?: string; message?: string };
  if (!response.ok || !data.plan) throw new Error(data.message || "Request failed");
  return data;
}

async function generateConceptAssets(plan: ImagePlan) {
  const response = await fetch("/api/yai-studio/image-generator/assets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  const data = (await response.json().catch(() => ({}))) as { assets?: ConceptAsset[]; message?: string; detail?: string; fallbackUsed?: boolean; requestId?: string };
  if (!response.ok || !Array.isArray(data.assets) || data.assets.length === 0) throw new Error(data.detail || data.message || "Concept asset generation failed.");
  return {
    assets: Object.fromEntries(data.assets.filter((asset) => typeof asset.index === "number" && typeof asset.imageDataUrl === "string").map((asset) => [asset.index, asset.imageDataUrl])),
    fallbackUsed: Boolean(data.fallbackUsed),
    requestId: typeof data.requestId === "string" ? data.requestId : "",
  };
}

export function ImageGeneratorClient() {
  const [brief, setBrief] = useState<string>(smartExamples[0].brief);
  const [aspectRatio, setAspectRatio] = useState<string>(smartExamples[0].aspectRatio);
  const [style, setStyle] = useState<string>(smartExamples[0].style);
  const [audience, setAudience] = useState<string>(smartExamples[0].audience);
  const [palette, setPalette] = useState<string>(smartExamples[0].palette);
  const [count, setCount] = useState<number>(smartExamples[0].count);
  const [sending, setSending] = useState(false);
  const [plan, setPlan] = useState<ImagePlan | null>(null);
  const [runtimeSource, setRuntimeSource] = useState("");
  const [model, setModel] = useState("");
  const [error, setError] = useState("");
  const [assetError, setAssetError] = useState("");
  const [assetFallbackUsed, setAssetFallbackUsed] = useState(false);
  const [assetRequestId, setAssetRequestId] = useState("");
  const [conceptAssets, setConceptAssets] = useState<Record<number, string>>({});
  const [generatingAssets, setGeneratingAssets] = useState(false);
  const [exportingIndex, setExportingIndex] = useState<number | null>(null);
  const [exportError, setExportError] = useState("");
  const [downloadUrls, setDownloadUrls] = useState<Record<number, string>>({});
  const activeExampleText = useMemo(() => `${aspectRatio} · ${style}`, [aspectRatio, style]);

  function userFacingFallbackMessage() {
    return "AI generation is temporarily unavailable. A governed template visual was used instead.";
  }

  useEffect(() => () => { Object.values(downloadUrls).forEach((url) => URL.revokeObjectURL(url)); }, [downloadUrls]);

  function loadSmartExample(example: (typeof smartExamples)[number]) { setBrief(example.brief); setAspectRatio(example.aspectRatio); setStyle(example.style); setAudience(example.audience); setPalette(example.palette); setCount(example.count); setError(""); setAssetError(""); setExportError(""); setPlan(null); setConceptAssets({}); setAssetFallbackUsed(false); setAssetRequestId(""); }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!brief.trim() || sending) return; setSending(true); setError("");
    try {
      const data = await renderPlanFromApi({ brief, aspectRatio, style, audience, palette, count });
      setPlan(data.plan!); setRuntimeSource(data.runtimeSource ?? "local-fallback"); setModel(data.model ?? "yai-image-local"); setConceptAssets({}); setExportError(""); setAssetError(""); setAssetFallbackUsed(false); setAssetRequestId("");
      void generateConceptAssets(data.plan!)
        .then((result) => {
          setConceptAssets(result.assets);
          setAssetFallbackUsed(result.fallbackUsed);
          setAssetRequestId(result.requestId);
        })
        .catch((err) => {
          setAssetError(err instanceof Error ? err.message : "Concept asset generation failed.");
          setAssetFallbackUsed(true);
        });
    } catch (err) { setError(err instanceof Error ? err.message : "Unknown error"); setPlan(null); } finally { setSending(false); }
  }

  async function exportPng(item: ImagePrompt) {
    if (!plan || exportingIndex !== null) return; setExportError(""); setExportingIndex(item.index);
    try {
      const src = conceptAssets[item.index] ?? makePromptPreview(plan, item);
      const a = document.createElement("a"); a.href = src; a.download = `${plan.traceId}-concept-${item.index}.png`; a.click();
      if (!conceptAssets[item.index]) { const url = src; setDownloadUrls((current) => ({ ...current, [item.index]: url })); }
    } catch (err) { setExportError(err instanceof Error ? err.message : "PNG export failed."); } finally { setExportingIndex(null); }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <BackNavButton />
      <section className="border-b border-white/10 px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">YAI Studio · Image Generator</div>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Generate smart governed image prompt sets</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">This module generates planning prompts and concept directions. Output is always <strong>PLAN_ONLY</strong> and requires human approval.</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs">
            <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-emerald-200">Decision: PLAN_ONLY</span>
            <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 text-amber-200">No auto publish</span>
            <span className="rounded-full border border-white/20 px-3 py-1 text-slate-300"><Link href="/bpbsolutionsltd/yai-studio" className="hover:text-white">← Back to YAI Studio</Link></span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-slate-300">Preset: {activeExampleText}</span>
          </div>
        </div>
      </section>
      <section className="px-5 py-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[420px_1fr]">
          <form onSubmit={onSubmit} className="border border-white/10 bg-white/[0.03] p-5">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">{smartExamples.map((example) => <button key={example.label} type="button" onClick={() => loadSmartExample(example)} className="rounded border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-200 hover:border-emerald-300/60 hover:text-white">{example.label}</button>)}</div>
              <textarea value={brief} onChange={(e) => setBrief(e.target.value)} className="min-h-32 w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none"><option>1:1</option><option>9:16</option><option>16:9</option><option>4:5</option></select>
                <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none"><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option><option value={6}>6</option></select>
              </div>
              <input value={style} onChange={(e) => setStyle(e.target.value)} className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none" />
              <input value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none" />
              <input value={palette} onChange={(e) => setPalette(e.target.value)} className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none" />
              <button type="submit" disabled={sending || !brief.trim()} className="w-full border border-emerald-300/40 bg-emerald-300/20 px-4 py-3 text-sm font-semibold text-emerald-100 disabled:cursor-not-allowed disabled:opacity-60">{sending ? "Generating plan..." : "Generate Smart Image Plan"}</button>
            </div>
          </form>
          <section className="border border-white/10 bg-white/[0.02] p-5">
            {!plan && !error && <div className="text-sm text-slate-400">Submit a brief to generate a structured set of image concepts and a preview pack.</div>}
            {error && <div className="rounded border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
            {plan && <div className="space-y-5">
              <div className="border-b border-white/10 pb-4"><h2 className="mt-2 text-2xl font-semibold">{plan.brief}</h2><div className="mt-3 flex flex-wrap gap-2 text-xs"><span className="rounded-full border border-white/20 px-2 py-1 text-slate-300">Trace: {plan.traceId}</span><span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-2 py-1 text-emerald-200">{plan.governance.decision}</span><span className="rounded-full border border-white/20 px-2 py-1 text-slate-300">Runtime: {runtimeSource}</span><span className="rounded-full border border-white/20 px-2 py-1 text-slate-300">Model: {model}</span></div></div>
              <div className="space-y-3">{plan.prompts.map((item) => <article key={`${item.index}-${item.title}`} className="border border-white/10 bg-black/30 p-4"><div className="text-xs uppercase tracking-[0.16em] text-emerald-300">Concept {item.index} · {item.overlayText}</div><div className="mt-2 text-sm text-white"><strong>Title:</strong> {item.title}</div><div className="mt-1 text-sm text-slate-300"><strong>Prompt:</strong> {item.prompt}</div></article>)}</div>
              {assetFallbackUsed && <div className="rounded border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">{userFacingFallbackMessage()}{assetRequestId ? <div className="mt-1 text-xs text-amber-200/80">Request ID: {assetRequestId}</div> : null}</div>}
              {plan.prompts[0] && <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]"><img src={conceptAssets[plan.prompts[0].index] ?? makePromptPreview(plan, plan.prompts[0])} alt="Storyboard preview" className="w-full border border-white/10 bg-black/30 object-cover" /><div className="border border-white/10 bg-black/30 p-4 text-sm text-slate-300"><p className="text-xs text-slate-400">Source: {conceptAssets[plan.prompts[0].index] ? conceptAssets[plan.prompts[0].index].startsWith("data:image/svg+xml") ? "governed template fallback" : "model-generated image" : "template render"}</p><p className="mt-2 text-xs text-slate-400">This preview is rendered locally from the plan so you can see the concept immediately.</p></div></div>}
              {assetError && <div className="rounded border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{userFacingFallbackMessage()}</div>}
              <div className="space-y-3 border border-white/10 bg-black/30 p-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-400">Downloadable PNG</div><div className="flex flex-wrap gap-2">{plan.prompts.map((item) => <button key={item.index} type="button" onClick={() => exportPng(item)} disabled={exportingIndex !== null} className="rounded border border-white/15 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60">{exportingIndex === item.index ? `Exporting #${item.index}...` : `Download #${item.index}`}</button>)}</div>{exportError && <div className="rounded border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{exportError}</div>}</div>
              <div className="grid gap-3 md:grid-cols-2"><div className="border border-white/10 bg-black/30 p-4 text-sm text-slate-300"><div className="text-xs uppercase tracking-[0.16em] text-slate-400">Caption</div><p className="mt-2">{plan.caption}</p></div><div className="border border-white/10 bg-black/30 p-4 text-sm text-slate-300"><div className="text-xs uppercase tracking-[0.16em] text-slate-400">Hashtags</div><p className="mt-2">{plan.hashtags.join(" ")}</p></div></div>
            </div>}
          </section>
        </div>
      </section>
    </main>
  );
}
