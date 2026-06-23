import Link from "next/link";

export default function BpbSolutionsPage() {
  return (
    <main className="min-h-screen bg-black px-5 py-16 text-white">
      <div className="mx-auto max-w-5xl space-y-6 border border-white/10 bg-white/[0.02] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">BPB governance ecosystem</p>
        <h1 className="text-4xl font-semibold">Execution governance operator surface.</h1>
        <p className="max-w-3xl text-gray-300">
          Use YAI Local for authority-aware operator guidance, controlled execution planning,
          and commercial product routing across PMS4U, GTCS4U, mobility, and travel surfaces.
        </p>
        <p className="max-w-3xl rounded-lg border border-amber-300/20 bg-amber-950/20 p-4 text-sm leading-6 text-amber-100">
          Legal note: public product materials should not be treated as the active contracting
          entity. Contracting details are confirmed during engagement.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/yai" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black">
            Open YAI Local
          </Link>
          <Link href="/gtcs4u" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold">
            Open GTCS4U
          </Link>
          <Link href="/agent/inbound" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold">
            Open Governance Console
          </Link>
        </div>
      </div>
    </main>
  );
}
