import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import ExecutionBoundarySection from "./components/ExecutionBoundarySection";
import Gtcs4uPage from "./gtcs4u/page";

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
    label: "Paid Sprint",
    title: "Authority Audit Sprint",
    body: "A 7-10 day paid audit that finds one high-risk unauthorized execution path and turns it into a pilot scope.",
    href: "/authority-audit-sprint",
    cta: "Book sprint",
  },
  {
    label: "Operating Hub",
    title: "YAI Local operator surface",
    body: "Adds YAI Local to the public website as the working assistant layer for execution governance and operator guidance.",
    href: "/bpbsolutionsltd",
    cta: "Open operator hub",
  },
  {
    label: "Mobility MVP",
    title: "Driver subscription ride-hailing",
    body: "Blueprint for a car and motorbike ride-hailing platform where drivers pay a fixed monthly fee instead of per-ride commission.",
    href: "/subscription-mobility",
    cta: "Open mobility MVP",
  },
  {
    label: "UmEldonia",
    title: "Aegypten Hautnah travel app",
    body: "Pilot app surface for Egypt tours, long stays, property requests, WhatsApp intake, and governed operator handoff.",
    href: "/umeldonia",
    cta: "Open UmEldonia",
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

const commercialProducts = [
  {
    name: "GTCS4U",
    buyer: "Trade, logistics, compliance, and procurement teams.",
    problem: "Shipments, suppliers, approvals, and documents move faster than authority checks.",
    outcome: "Block unauthorized export, vendor approval, document release, or shipment status changes before consequence.",
    href: "/gtcs4u",
    cta: "Open GTCS4U",
  },
  {
    name: "YAI Local",
    buyer: "Operators who need AI assistance without uncontrolled execution.",
    problem: "Agents can advise, draft, or trigger workflows without remembering authority state or evidence gaps.",
    outcome: "Guide the operator while preserving trace, authority state, and consequence awareness.",
    href: "/yai",
    cta: "Open YAI",
  },
  {
    name: "Mobility MVP",
    buyer: "City operators, driver groups, and local transport ventures.",
    problem: "Commission-heavy ride platforms create weak driver economics and low local trust.",
    outcome: "Run a monthly-fee driver model with verification, subscription gates, and controlled ride acceptance.",
    href: "/hurghada-mobility",
    cta: "Open pilot",
  },
] as const;

const blockedExamples = [
  ["Shipment export", "Authority missing", "DENY before export status is committed."],
  ["Vendor approval", "Evidence incomplete", "DEFER until documents and accountable approver exist."],
  ["Customer data export", "Purpose not admissible", "INTERRUPT and require traceable review."],
  ["Driver ride acceptance", "Subscription expired", "DENY new trip while preserving history."],
] as const;

export default async function Home() {
  const requestHeaders = await headers();
  const host = (requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "").toLowerCase();

  if (host === "gtcs4u.com" || host === "www.gtcs4u.com") {
    return <Gtcs4uPage />;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-sm font-semibold tracking-[0.32em] text-white">
            PMS4U
          </Link>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-400 sm:justify-end sm:text-sm">
            <a href="#runtime" className="transition hover:text-white">
              Runtime
            </a>
            <Link href="/research" className="font-medium text-emerald-300 transition hover:text-emerald-100">
              Research
            </Link>
            <Link href="/reference-architecture" className="transition hover:text-white">
              Architecture
            </Link>
            <a href="#commercial-products" className="transition hover:text-white">
              Products
            </a>
            <Link href="/executive-brief" className="transition hover:text-white">
              Executive Brief
            </Link>
            <a href="https://wa.me/491723256044" className="font-medium text-emerald-300 transition hover:text-emerald-100">
              Briefing
            </a>
          </div>
        </div>
      </nav>

      <section className="relative border-b border-white/10 px-5 pt-32 sm:pt-28">
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
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
              The first commercial path is GTCS4U: trade, logistics, supplier, document, and
              compliance workflows powered by PMS4U underneath.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/gtcs4u"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-100"
              >
                Open GTCS4U
              </Link>
              <Link
                href="/authority-audit-sprint"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-300 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-200"
              >
                Book audit sprint
              </Link>
              <a
                href="#case-study"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white"
              >
                View execution case
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

      <section id="commercial-products" className="border-b border-white/10 bg-white/[0.02] px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
              Commercial front first
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
              Sell the operating products. Let PMS4U be the moat behind them.
            </h2>
            <p className="mt-5 text-base leading-7 text-gray-400">
              Buyers understand shipments, approvals, drivers, bookings, and operator support
              before they understand runtime governance. The site now routes them to the business
              surface first, then shows the control layer underneath.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {commercialProducts.map((product) => (
              <article key={product.name} className="flex min-h-[360px] flex-col rounded-lg border border-white/10 bg-black/55 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  {product.name}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{product.buyer}</h3>
                <p className="mt-4 text-sm leading-6 text-gray-400">{product.problem}</p>
                <p className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-950/20 p-4 text-sm leading-6 text-emerald-50">
                  {product.outcome}
                </p>
                <Link
                  href={product.href}
                  className="mt-auto inline-flex w-fit rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-white"
                >
                  {product.cta}
                </Link>
              </article>
            ))}
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

      <section id="case-study" className="border-y border-white/10 bg-white/[0.02] px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
              Investor-safe case format
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
              Show what gets blocked before claiming financial impact.
            </h2>
            <p className="mt-5 text-base leading-7 text-gray-400">
              The current proof standard is technical: interception, frozen execution, signed
              evidence, replay, and hash continuity. Prevented-loss values should only be published
              after a business owner validates the exposure.
            </p>
          </div>

          <div className="grid gap-4">
            <article className="rounded-lg border border-white/10 bg-black p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                Example execution story
              </div>
              <div className="mt-5 grid gap-3 text-sm">
                {[
                  ["Actor", "Customer, agent, operator, or workflow attempts a governed action."],
                  ["Runtime check", "PMS4U evaluates authority, admissibility, state, and evidence."],
                  ["Decision", "Unauthorized or incomplete action is denied, deferred, or interrupted."],
                  ["Proof", "Ledger event, signature, evidence ID, and replayable lineage are retained."],
                  ["Impact", "Business-side exposure value remains pending until validated."],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-2 border-b border-white/10 pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[160px_1fr]">
                    <span className="font-semibold text-white">{label}</span>
                    <span className="text-gray-400">{value}</span>
                  </div>
                ))}
              </div>
            </article>

            <div className="grid gap-3 md:grid-cols-2">
              {blockedExamples.map(([action, gap, result]) => (
                <article key={action} className="rounded-lg border border-white/10 bg-black/60 p-5">
                  <p className="text-sm font-semibold text-white">{action}</p>
                  <p className="mt-2 text-sm text-red-200">Gap: {gap}</p>
                  <p className="mt-3 text-sm leading-6 text-emerald-100">{result}</p>
                </article>
              ))}
            </div>
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
        © 2026 PMS4U. Product ecosystem and pilot surfaces. Contracting entity confirmed before engagement.
      </footer>
    </main>
  );
}
