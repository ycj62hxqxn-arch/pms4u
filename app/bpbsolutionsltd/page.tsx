import Link from "next/link";

export default function BpbSolutionsPage() {
  return (
    <main className="min-h-screen bg-black px-5 py-16 text-white">
      <div className="mx-auto max-w-5xl space-y-6 border border-white/10 bg-white/[0.02] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">BPB Solutions LTD</p>
        <h1 className="text-4xl font-semibold">Corporate execution governance surface.</h1>
        <p className="max-w-3xl text-gray-300">
          Use YAI Local for authority-aware operator guidance and controlled execution planning.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/yai" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black">
            Open YAI Local
          </Link>
          <Link href="/agent/inbound" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold">
            Open Governance Console
          </Link>
        </div>
      </div>
    </main>
  );
}
