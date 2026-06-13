import Image from "next/image";
import Link from "next/link";
import ExecutionBoundarySection from "./components/ExecutionBoundarySection";

const proofAssets = [
  {
    label: "Runtime Console",
    title: "DENY / DEFER / INTERRUPT demo",
    body: "Shows authority, admissibility, escalation, and governed refusal before a state change becomes operational consequence.",
    href: "/console",
    cta: "Open console",
  },
  {
    label: "Constitutional Trace",
    title: "Lineage and evidence chain",
    body: "Shows event sourcing, receipts, authority context, replayable trace, and the path from decision to proof.",
    href: "/trace",
    cta: "View trace",
  },
  {
    label: "Workspace Technical Report",
    title: "Proof room for diligence",
    body: "Gives technical buyers, enterprise architects, auditors, and investors the engineering depth behind the public claim.",
    href: "/workspace-technical-report",
    cta: "Read report",
  },
  {
    label: "BPB Solutions LTD",
    title: "Corporate YAI Local surface",
    body: "Adds YAI Local to the BPB public website as the working assistant layer for execution governance and operator guidance.",
    href: "/bpbsolutionsltd",
    cta: "Open BPB site",
  },
  {
    label: "GTCS4U",
    title: "Business application surface",
    body: "Connects the governance runtime to a commercial operating domain, revenue path, and market-fit narrative.",
    href: null,
    cta: "Business surface",
  },
] as const;

const frameworkImages = [
  {
    src: "/assets/frameworks/custom_governance_stack.png",
    title: "Runtime Governance Stack",
  },
  {
    src: "/assets/frameworks/stack.png",
    title: "9-Layer Authority System",
  },
  {
    src: "/assets/frameworks/drift.png",
    title: "Reality Drift Boundary",
  },
  {
    src: "/assets/frameworks/system.png",
    title: "System Invariance",
  },
] as const;

const withGovernanceSteps = ["INTAKE", "VERIFIED", "AUTHORITY_GRANTED", "TRACE", "EVIDENCE"];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="text-sm font-semibold tracking-[0.32em] text-white">
            PMS4U
          </Link>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-400 sm:text-sm">
            <a href="#runtime" className="transition hover:text-white">
              Runtime
            </a>
            <a href="#proof-assets" className="transition hover:text-white">
              Proof Assets
            </a>
            <Link href="/authority" className="transition hover:text-white">
              Authority
            </Link>
            <Link href="/bpbsolutionsltd" className="transition hover:text-white">
              BPB Site
            </Link>
            <Link href="/shab-report" className="transition hover:text-white">
              Shab Report
            </Link>
            <Link href="/workspace-technical-report" className="transition hover:text-white">
              Workspace Report
            </Link>
            <Link href="/investor-technical-report" className="transition hover:text-white">
              Investor Report
            </Link>
            <Link href="/yai" className="transition hover:text-white">
              YAI Local
            </Link>
            <Link href="/console" className="font-medium text-emerald-300 transition hover:text-emerald-100">
              Governance Console
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative border-b border-white/10 px-5 pt-40 sm:pt-36">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0)_42%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 pb-16 md:grid-cols-[1.05fr_0.95fr] md:items-center lg:pb-20">
          <div>
            <div className="mb-5 inline-flex border border-emerald-300/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
              PMS4U Runtime Governance OS™
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-normal text-white sm:text-6xl lg:text-7xl">
              Prevent unauthorized actions before they create consequences.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-300">
              PMS4U sits at the execution boundary. It checks state, authority, admissibility,
              and evidence before a workflow, API, or AI agent is allowed to mutate reality.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/bpbsolutionsltd/yai"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-100"
              >
                Open BPB YAI Local
              </Link>
              <a
                href="#proof-assets"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white"
              >
                Open proof room
              </a>
            </div>

            <div className="mt-9 grid max-w-2xl grid-cols-3 border border-white/10 text-center text-xs uppercase tracking-[0.18em] text-gray-400">
              <div className="border-r border-white/10 px-3 py-4">
                <span className="block text-base font-semibold text-white">Deny</span>
              </div>
              <div className="border-r border-white/10 px-3 py-4">
                <span className="block text-base font-semibold text-white">Defer</span>
              </div>
              <div className="px-3 py-4">
                <span className="block text-base font-semibold text-white">Interrupt</span>
              </div>
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-4">
            <div className="border border-red-500/30 bg-red-950/20 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                Without governance
              </div>
              <pre className="mt-4 overflow-x-auto text-sm leading-7 text-red-100">
                <code>{"UPDATE status='EXPORTED'"}</code>
              </pre>
            </div>

            <div className="mt-4 border border-emerald-400/30 bg-emerald-950/20 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
                With governance
              </div>
              <div className="mt-4 space-y-2">
                {withGovernanceSteps.map((step, index) => (
                  <div key={step}>
                    <div className="border border-emerald-300/20 bg-black/40 px-4 py-3 font-mono text-sm text-emerald-100">
                      {step}
                    </div>
                    {index < withGovernanceSteps.length - 1 && (
                      <div className="py-1 text-center text-emerald-300">↓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="runtime" className="px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              Executive translation
            </div>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-normal text-white sm:text-5xl">
              Not a dashboard. Not a workflow engine. A control plane for execution.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-400">
              The buyer does not need to learn the doctrine first. They need to see the consequence:
              unauthorized execution is stopped before it becomes a transaction, status change,
              shipment, approval, or irreversible operational record.
            </p>
          </div>

          <div className="overflow-hidden border border-white/10 bg-white/[0.02]">
            <Image
              src="/assets/demo_enforcement.gif"
              alt="PMS4U runtime governance console showing enforcement decisions"
              width={1200}
              height={720}
              unoptimized
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </section>

      <section id="reality-drift" className="border-y border-white/10 bg-white/[0.02] px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">
              Reality Drift Boundary
            </div>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-normal text-white sm:text-5xl">
              Design before execution is not the same as authority after consequence.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-400">
              PMS4U makes the boundary visible: a request may look admissible in design, but the
              runtime must still prove authority before the action becomes real, owned, and
              irreversible.
            </p>
          </div>

          <figure className="overflow-hidden border border-white/10 bg-black">
            <Image
              src="/assets/frameworks/drift.png"
              alt="Reality Drift Boundary diagram contrasting design before with authority after consequence"
              width={1536}
              height={1024}
              className="h-auto w-full"
              priority
            />
            <figcaption className="border-t border-white/10 px-5 py-4 text-sm font-medium text-gray-300">
              Reality Drift Boundary — authority is proven after the boundary, not before it.
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="proof-assets" className="border-y border-white/10 bg-white/[0.02] px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
              Four proof assets
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
              The landing page sells the outcome. The proof room carries diligence.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {proofAssets.map((asset) => (
              <div key={asset.label} className="border border-white/10 bg-black p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                  {asset.label}
                </div>
                <h3 className="mt-3 text-xl font-semibold text-white">{asset.title}</h3>
                <p className="mt-3 min-h-20 text-sm leading-6 text-gray-400">{asset.body}</p>
                {asset.href ? (
                  <Link
                    href={asset.href}
                    className="mt-5 inline-flex rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-white"
                  >
                    {asset.cta}
                  </Link>
                ) : (
                  <span className="mt-5 inline-flex rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-gray-500">
                    {asset.cta}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="framework" className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
                Architecture evidence
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
                Visible system, not abstract claim.
              </h2>
            </div>
            <Link href="/workspace-technical-report" className="text-sm font-semibold text-emerald-300 hover:text-emerald-100">
              Technical report
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {frameworkImages.map((item) => (
              <figure key={item.src} className="group overflow-hidden border border-white/10 bg-white/[0.03]">
                <Image
                  src={item.src}
                  alt={item.title}
                  width={1200}
                  height={800}
                  className="h-auto w-full transition duration-500 group-hover:scale-[1.015]"
                />
                <figcaption className="border-t border-white/10 px-5 py-4 text-sm font-medium text-gray-300">
                  {item.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <ExecutionBoundarySection />

      <section className="px-5 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-normal sm:text-5xl">
            Make the first briefing about prevention.
          </h2>
          <p className="mt-5 text-base leading-7 text-gray-400">
            The technical language remains available for CTOs, auditors, and investors after they
            understand the commercial result.
          </p>
          <a
            href="https://wa.me/491723256044"
            className="mt-8 inline-flex rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-100"
          >
            Request private briefing
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-gray-600">
        © 2026 PMS4U — BPB Solutions LTD
      </footer>
    </main>
  );
}
