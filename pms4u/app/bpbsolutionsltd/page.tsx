import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BPB Solutions LTD | Execution Governance",
  description:
    "BPB Solutions LTD public site surface for YAI Local and PMS4U runtime execution governance.",
};

const proofPoints = [
  "Authority before execution",
  "Evidence before consequence",
  "Runtime trace before mutation",
  "Operator control before handoff",
] as const;

const siteLinks = [
  {
    href: "/bpbsolutionsltd/yai",
    label: "Open YAI Local",
    body: "Run the BPB-branded local execution-governance assistant.",
  },
  {
    href: "/console",
    label: "Governance Console",
    body: "Review DENY / DEFER / INTERRUPT behavior in the runtime proof console.",
  },
  {
    href: "/workspace-technical-report",
    label: "Technical Report",
    body: "Open the diligence report covering domains, runtime surfaces, and evidence.",
  },
] as const;

export default function BpbSolutionsSite() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 px-5 py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/bpbsolutionsltd" className="text-sm font-semibold tracking-[0.28em] text-white">
            BPB SOLUTIONS LTD
          </Link>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <Link href="/" className="transition hover:text-white">
              PMS4U
            </Link>
            <Link href="/bpbsolutionsltd/yai" className="font-medium text-emerald-300 transition hover:text-emerald-100">
              YAI Local
            </Link>
            <Link href="/workspace-technical-report" className="transition hover:text-white">
              Report
            </Link>
          </div>
        </div>
      </nav>

      <section className="border-b border-white/10 px-5 py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="inline-flex border border-emerald-300/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
              Public governance surface
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
              BPB Solutions LTD execution governance with YAI Local.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300">
              The corporate site now exposes YAI Local as the practical assistant layer for PMS4U:
              authority checks, operator guidance, trace IDs, and safe fallback behavior before
              external execution.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/bpbsolutionsltd/yai"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-100"
              >
                Open YAI Local
              </Link>
              <Link
                href="/console"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white"
              >
                Runtime console
              </Link>
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-5">
            <Image
              src="/assets/frameworks/BPB-official-logo.jpg"
              alt="BPB Solutions LTD official logo"
              width={1200}
              height={720}
              className="h-auto w-full border border-white/10"
              priority
            />
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-gray-300">
              {proofPoints.map((item) => (
                <div key={item} className="border border-white/10 bg-black px-4 py-3">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              BPB site actions
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
              Move from public claim to working proof.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {siteLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border border-white/10 bg-white/[0.02] p-6 transition hover:border-emerald-300/40 hover:bg-emerald-950/10"
              >
                <h3 className="text-lg font-semibold text-white">{item.label}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">{item.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
