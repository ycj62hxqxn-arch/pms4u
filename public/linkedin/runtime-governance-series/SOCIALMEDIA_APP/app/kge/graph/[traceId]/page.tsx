import Link from "next/link";
import { notFound } from "next/navigation";
import { InteractiveGraph } from "@/components/kge/interactive-graph";
import { findReasoningTraceById, verifyReasoningTraceHash } from "@/lib/kge/trace";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ traceId: string }> };

export default async function KnowledgeGraphPage({ params }: PageProps) {
  const { traceId } = await params;
  const trace = await findReasoningTraceById(traceId);
  if (!trace) notFound();

  const valid = verifyReasoningTraceHash(trace);

  return (
    <main className="min-h-screen bg-[#0f0f11] px-4 py-8 text-white">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">KGE Stage 4</p>
            <h1 className="mt-2 text-3xl font-bold">Interactive Knowledge Graph</h1>
            <p className="mt-2 max-w-3xl text-sm text-zinc-500">Explore nodes, relations, reasoning paths, conflicts, and governed exports.</p>
          </div>
          <div className="flex gap-3">
            <span className={valid ? "rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300" : "rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300"}>Integrity {valid ? "VALID" : "INVALID"}</span>
            <Link href={`/kge/trace/${encodeURIComponent(trace.traceId)}`} className="rounded-lg border border-white/10 px-3 py-2 text-xs">Trace explorer</Link>
          </div>
        </header>

        <InteractiveGraph graph={trace.graph} traceId={trace.traceId} decision={trace.decision} score={trace.score} />

        <div className="flex gap-4 text-sm">
          <Link href="/feed" className="text-violet-400">← Return to feed</Link>
          <Link href={`/constitutional/receipt/${encodeURIComponent(trace.constitutionalReceiptId)}`} className="text-emerald-400">Open receipt →</Link>
        </div>
      </div>
    </main>
  );
}
