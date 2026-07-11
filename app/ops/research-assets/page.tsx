import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, BookOpen, FileText, Layers } from "lucide-react";
import { researchAssets } from "../ops-data";

export const metadata: Metadata = {
  title: "PMS4U Operations — Research Assets",
  description:
    "Operational inventory of PMS4U technical notes, doctrine, white papers, reference architecture, and standards.",
};

const kinds = ["Technical Note", "Doctrine", "White Paper", "Reference Architecture", "Standard"];

function statusTone(status: string) {
  if (status === "Published") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "Queued") return "border-blue-200 bg-blue-50 text-blue-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function priorityTone(priority: string) {
  if (priority === "P0") return "border-slate-950 bg-slate-950 text-white";
  if (priority === "P1") return "border-blue-200 bg-blue-50 text-blue-700";
  if (priority === "P2") return "border-violet-200 bg-violet-50 text-violet-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

export default function ResearchAssetsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <Link href="/ops" className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.18em] text-slate-950">
            <ArrowLeft size={16} />
            PMS4U OPS
          </Link>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            <Link href="/research" className="hover:text-slate-950">
              Research Hub
            </Link>
            <Link href="/research/specification-1-0" className="hover:text-slate-950">
              SPEC-001
            </Link>
            <Link href="/research/technical-notes/tn-001" className="hover:text-slate-950">
              TN-001
            </Link>
            <Link href="/gtcs4u" className="hover:text-slate-950">
              GTCS4U
            </Link>
          </div>
        </div>
      </nav>

      <section className="border-b border-slate-200 bg-white px-5 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 border border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-600">
              <BookOpen size={15} />
              Research Asset Inventory
            </div>
            <h1 className="max-w-5xl text-4xl font-semibold leading-[1.04] tracking-normal sm:text-6xl">
              Technical Notes, Doctrine, White Papers, and Standards.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              This page connects the PMS4U knowledge layer to operational status. It shows what is
              published, queued, drafted, owned, and ready to become a citation target.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Assets</div>
              <div className="mt-2 text-3xl font-semibold">{researchAssets.length}</div>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Published</div>
              <div className="mt-2 text-3xl font-semibold">
                {researchAssets.filter((asset) => asset.status === "Published").length}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10">
        <div className="mx-auto grid max-w-7xl gap-6">
          {kinds
            .filter((kind) => researchAssets.some((asset) => asset.kind === kind))
            .map((kind) => {
              const assets = researchAssets.filter((asset) => asset.kind === kind);

              return (
                <section key={kind} className="grid gap-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                      {kind === "Reference Architecture" ? <Layers size={18} /> : <FileText size={18} />}
                      {kind}
                    </h2>
                    <span className="text-sm text-slate-500">
                      {assets.length} asset{assets.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    {assets.map((asset) => {
                      const content = (
                        <article className="h-full border border-slate-200 bg-white p-5 transition hover:border-slate-400">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{asset.id}</div>
                              <h3 className="mt-2 text-xl font-semibold text-slate-950">{asset.title}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityTone(asset.priority)}`}>
                                {asset.priority}
                              </span>
                              <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTone(asset.status)}`}>
                                {asset.status}
                              </span>
                            </div>
                          </div>
                          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-[90px_1fr]">
                            <dt className="font-semibold text-slate-500">Track</dt>
                            <dd>{asset.track}</dd>
                            <dt className="font-semibold text-slate-500">Owner</dt>
                            <dd>{asset.owner}</dd>
                            <dt className="font-semibold text-slate-500">Route</dt>
                            <dd>{asset.href ?? "Queued"}</dd>
                          </dl>
                          <p className="mt-4 text-sm leading-6 text-slate-600">{asset.summary}</p>
                          <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                            {asset.href ? "Open asset" : "Awaiting publication"}
                            {asset.href ? <ArrowRight size={15} /> : null}
                          </div>
                        </article>
                      );

                      return asset.href ? (
                        <Link key={asset.id} href={asset.href} className="block">
                          {content}
                        </Link>
                      ) : (
                        <div key={asset.id}>{content}</div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
        </div>
      </section>
    </main>
  );
}
