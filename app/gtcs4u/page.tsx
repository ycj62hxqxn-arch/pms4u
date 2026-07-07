import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTCS4U | Global Trade & Compliance Services",
  description:
    "Authority-first trade operations: compliant shipment orchestration, document validation, and audit-ready execution visibility.",
};

const lanes = [
  { lane: "EU → GCC", risk: "LOW", delta: "-12%", tone: "text-emerald-300" },
  { lane: "US → UAE", risk: "MEDIUM", delta: "+6%", tone: "text-amber-300" },
  { lane: "CN → DE", risk: "HIGH", delta: "+19%", tone: "text-red-300" },
  { lane: "TR → QA", risk: "LOW", delta: "-3%", tone: "text-emerald-300" },
] as const;

const features = [
  {
    title: "Trade Compliance Automation",
    body: "Automate sanction screening, HS classification, invoice validation, and cross-border documentation.",
  },
  {
    title: "Authority-Aware Execution",
    body: "Approval workflows, signer validation, and operational controls ensure execution stays policy-compliant.",
  },
  {
    title: "Operational Visibility",
    body: "Real-time dashboards monitor shipment exposure, compliance posture, and workflow bottlenecks.",
  },
] as const;

const flow = [
  "📦 Shipment Request",
  "📄 Document Validation",
  "🛡 Compliance Screening",
  "✍️ Authority Verification",
  "🚚 Execution Release",
  "📚 Audit Evidence Pack",
] as const;

const integrations = ["SAP", "Oracle", "CargoWise", "DHL APIs", "Customs Feeds", "ERP Connectors"] as const;

const plans = [
  {
    name: "Launch",
    price: "$4,200 /month",
    items: ["Compliance workflows", "2 regions + 5 lanes", "Monthly audit packet", "Email support"],
    cta: "Request Launch",
    featured: false,
  },
  {
    name: "Command",
    price: "$7,600 /month",
    items: ["Real-time risk scoring", "Evidence vault", "Governance dashboards", "Dedicated strategist"],
    cta: "Request Command",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "$13,800 /month",
    items: ["Unlimited lanes", "Custom integrations", "SLA + compliance desk", "Quarterly governance reviews"],
    cta: "Contact Sales",
    featured: false,
  },
] as const;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "GTCS4U",
      url: "https://www.gtcs4u.com/gtcs4u",
      description:
        "Authority-first trade operations: compliant shipment orchestration, document validation, and audit-ready execution visibility.",
    },
    {
      "@type": "WebSite",
      name: "GTCS4U",
      url: "https://www.gtcs4u.com/gtcs4u",
      inLanguage: "en",
    },
    {
      "@type": "Service",
      serviceType: "Global Trade and Compliance Operations",
      provider: {
        "@type": "Organization",
        name: "GTCS4U",
      },
      areaServed: "Worldwide",
      url: "https://www.gtcs4u.com/gtcs4u",
    },
  ],
};

export default function Gtcs4uPage() {
  return (
    <main className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_8%_12%,rgba(14,165,233,0.14),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(16,185,129,0.12),transparent_32%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
          <div className="text-xl font-bold tracking-[0.2em]">GTCS4U</div>
          <nav className="flex flex-wrap gap-4 text-sm text-slate-300">
            <a href="#platform" className="hover:text-white">
              Platform
            </a>
            <Link href="/carshunter-cloud" className="font-medium text-emerald-300 hover:text-emerald-100">
              CARSHUNTER
            </Link>
            <a href="#workflow" className="hover:text-white">
              Workflow
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
            <a href="#contact" className="hover:text-white">
              Contact
            </a>
          </nav>
          <a
            href="#contact"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200"
          >
            Book a Demo
          </a>
        </header>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:py-16">
          <div>
            <div className="inline-flex rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Global Trade & Compliance Services
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl sm:leading-[1.05]">
              Authority-First Trade Execution.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              GTCS4U orchestrates compliant shipment operations with approval gates, trade controls, and audit-grade evidence by default.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="rounded-xl bg-emerald-300 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-200">
                Start a Pilot
              </a>
              <a href="#workflow" className="rounded-xl border border-white/20 bg-white/[0.02] px-5 py-3 font-semibold hover:border-white">
                Explore Workflow
              </a>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
                <div className="text-3xl font-bold text-emerald-300">92%</div>
                <div className="mt-1 text-sm text-slate-300">Document Cycle Reduction</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
                <div className="text-3xl font-bold text-emerald-300">38</div>
                <div className="mt-1 text-sm text-slate-300">Countries Supported</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
                <div className="text-3xl font-bold text-emerald-300">24/7</div>
                <div className="mt-1 text-sm text-slate-300">Compliance Monitoring</div>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
            <h2 className="text-lg font-semibold">Live Compliance Pulse</h2>
            <p className="mt-1 text-sm text-slate-400">Operational lane monitoring</p>
            <div className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Real-Time</div>
            <div className="mt-4 space-y-2">
              {lanes.map((row) => (
                <div key={row.lane} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm">
                  <span>{row.lane}</span>
                  <span className="text-slate-400">{row.risk}</span>
                  <span className={row.tone}>{row.delta}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-slate-400">Updated just now</div>

            <div className="mt-6 rounded-xl border border-white/10 bg-black/25 p-3">
              <div className="text-sm font-semibold">Automation Coverage</div>
              <div className="mt-1 text-sm text-slate-300">78% automated</div>
              <div className="text-xs text-slate-500">Target 90%</div>
              <ul className="mt-3 space-y-1 text-sm text-slate-200">
                <li>✓ HS code classification</li>
                <li>✓ Vendor & sanction screening</li>
                <li>✓ Audit-ready evidence packaging</li>
              </ul>
            </div>
          </aside>
        </section>

        <section id="platform" className="border-t border-white/10 py-10">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Platform</div>
          <h2 className="mt-3 text-3xl font-bold">One operational layer for trade, compliance, and execution.</h2>
          <p className="mt-4 max-w-4xl text-slate-300">
            GTCS4U centralizes trade approvals, documentation, vendor workflows, and compliance validation into one authority-aware operational environment.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {features.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="border-t border-white/10 py-10">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Execution Flow</div>
          <h2 className="mt-3 text-3xl font-bold">How GTCS4U orchestrates compliant trade execution.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {flow.map((step) => (
              <div key={step} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium">
                {step}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {integrations.map((item) => (
              <span key={item} className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section id="pricing" className="border-t border-white/10 py-10">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Pricing</div>
          <h2 className="mt-3 text-3xl font-bold">Enterprise-ready operational plans.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-2xl border p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${plan.featured ? "border-emerald-300/60 bg-emerald-400/10" : "border-white/10 bg-white/[0.04]"}`}
              >
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="mt-2 text-2xl font-bold text-emerald-300">{plan.price}</div>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {plan.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                <a href="#contact" className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200">
                  {plan.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="border-t border-white/10 py-10">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Contact</div>
          <h2 className="mt-3 text-3xl font-bold">Book a GTCS4U strategy session.</h2>
          <p className="mt-4 max-w-4xl text-slate-300">
            Tell us about your trade lanes, operational footprint, and compliance requirements. We will design a pilot architecture within 10 business days.
          </p>

          <form className="mt-6 grid gap-3 md:grid-cols-2">
            <input className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2" placeholder="Name" />
            <input className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2" placeholder="Work Email" />
            <input className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2" placeholder="Company" />
            <input className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2" placeholder="Monthly Shipment Volume" />
            <textarea className="md:col-span-2 min-h-24 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2" placeholder="Requirements" />
            <button type="button" className="w-fit rounded-xl bg-emerald-300 px-5 py-2 font-semibold text-slate-950 hover:bg-emerald-200">
              Send Request
            </button>
          </form>
        </section>

        <footer className="border-t border-white/10 py-8 text-sm text-slate-400">
          <div className="font-semibold text-white">GTCS4U</div>
          <p className="mt-2">Authority-first trade operations for global teams.</p>
          <p className="mt-2">© 2026 GTCS4U. Built for compliance-led growth.</p>
          <p className="mt-3">
            <Link href="/" className="text-slate-300 underline">
              Back to PMS4U runtime surface
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
