import Link from "next/link";
import { notFound } from "next/navigation";
import { findReasoningTraceById, verifyReasoningTraceHash } from "@/lib/kge/trace";
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ traceId: string }> }) {
  const { traceId } = await params;
  const trace = await findReasoningTraceById(traceId);
  if (!trace) notFound();
  const valid = verifyReasoningTraceHash(trace);
  return <main className="min-h-screen bg-[#0f0f11] px-4 py-10 text-white"><div className="mx-auto max-w-6xl space-y-5">
    <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Knowledge Graph Engine</p><h1 className="mt-2 text-3xl font-bold">Reasoning Trace Explorer</h1><p className="mt-2 text-sm text-zinc-500">Post → KGE trace → Constitutional receipt</p></div>
    <section className="grid gap-4 md:grid-cols-4">{[["Decision",trace.decision],["Score",trace.score.toFixed(2)],["Nodes",String(trace.nodeCount)],["Relations",String(trace.relationCount)]].map(([l,v])=><div key={l} className="rounded-2xl border border-white/[0.08] bg-[#16161a] p-4"><p className="text-xs text-zinc-600">{l}</p><p className="mt-2 font-mono text-xl text-zinc-200">{v}</p></div>)}</section>
    <section className="rounded-2xl border border-white/[0.08] bg-[#16161a] p-5"><h2 className="text-sm font-semibold text-sky-300">Reasoning outcome</h2><p className="mt-3 text-sm text-zinc-300">{trace.summary}</p><p className="mt-2 text-sm text-zinc-500">{trace.explanation}</p><div className="mt-4 flex flex-wrap gap-2">{trace.concepts.map((c)=><span key={c} className="rounded-full border border-sky-500/20 px-2 py-1 text-xs text-sky-300">{c}</span>)}</div></section>
    <section className="grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border border-white/[0.08] bg-[#16161a] p-5"><h2 className="font-semibold">Integrity</h2><p className={valid?"mt-3 text-emerald-300":"mt-3 text-rose-300"}>{valid?"VALID":"INVALID"}</p><p className="mt-3 break-all font-mono text-xs text-zinc-500">{trace.traceHash}</p><Link className="mt-4 inline-flex text-sm text-emerald-400" href={`/constitutional/receipt/${encodeURIComponent(trace.constitutionalReceiptId)}`}>Open linked receipt →</Link></div><div className="rounded-2xl border border-white/[0.08] bg-[#16161a] p-5"><h2 className="font-semibold">Graph nodes</h2><div className="mt-3 max-h-80 space-y-2 overflow-auto">{trace.graph.nodes.map((n)=><div key={n.id} className="rounded-xl border border-white/[0.06] p-3"><p className="text-[10px] text-violet-300">{n.type}</p><p className="mt-1 text-xs text-zinc-300">{n.label}</p></div>)}</div></div></section>
    <details className="rounded-2xl border border-white/[0.08] bg-[#16161a]"><summary className="cursor-pointer p-5 font-semibold">Raw trace JSON</summary><pre className="overflow-auto border-t border-white/[0.06] p-5 text-xs text-zinc-400">{JSON.stringify(trace,null,2)}</pre></details>
    <div className="flex gap-4 text-sm"><Link href="/feed" className="text-violet-400">← Feed</Link><Link href={`/api/kge/trace/${encodeURIComponent(trace.traceId)}`} className="text-sky-400">Trace API →</Link></div>
  </div></main>;
}
