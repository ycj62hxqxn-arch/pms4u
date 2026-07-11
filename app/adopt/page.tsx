import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Adopt PMS4U",
  description:
    "Unified adoption entry for PMS4U: reference architecture, runtime SDK, public playground, and enterprise case studies.",
};

const pillars = [
  {
    title: "Reference Architecture",
    href: "/reference-architecture",
    summary:
      "Flagship technical model from Constitution to Consequence, including Authority Resolver, Admissibility Engine, Execution Gate, and Evidence Spine.",
  },
  {
    title: "Runtime SDK",
    href: "/research/runtime-sdk",
    summary:
      "Developer adoption surface with JavaScript/Python integration patterns for runtime decision contracts.",
  },
  {
    title: "Public Playground",
    href: "/playground",
    summary:
      "Interactive decision simulator for Action + Authority + Evidence with ALLOW / DENY / REVIEW / DEFER outcomes.",
  },
  {
    title: "Case Studies",
    href: "/case-studies",
    summary:
      "Enterprise-ready examples across CARSHUNTER, AI Video, Tourism, Trade, and Healthcare.",
  },
];

const sequence = [
  "Constitution",
  "Authority Resolver",
  "Admissibility Engine",
  "Execution Gate",
  "Evidence Spine",
  "Execution",
  "Consequence",
] as const;

export default function AdoptPms4uPage() {
  return (
    <main className="enterprise-shell py-12">
      <div className="enterprise-wrap space-y-8">
        <header className="enterprise-hero">
          <div className="enterprise-kicker">Adoption Entry</div>
          <h1 className="enterprise-h1">Adopt PMS4U</h1>
          <p className="enterprise-lead">
            A single path for technical decision-makers: architecture first, then SDK, then live
            playground, then domain case studies.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="enterprise-chip">Architecture</span>
            <span className="enterprise-chip">SDK</span>
            <span className="enterprise-chip">Playground</span>
            <span className="enterprise-chip">Case Studies</span>
          </div>
        </header>

        <section className="enterprise-card">
          <h2 className="text-2xl font-semibold">Canonical Runtime Sequence</h2>
          <div className="mt-4 grid gap-2 md:grid-cols-7">
            {sequence.map((step, index) => (
              <div key={step} className="rounded border border-slate-200 bg-cyan-50 px-3 py-3 text-center text-sm font-medium text-slate-900">
                {step}
                {index < sequence.length - 1 ? <div className="mt-2 text-cyan-700">↓</div> : null}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {pillars.map((item) => (
            <Link key={item.title} href={item.href} className="enterprise-card transition hover:border-slate-400">
              <div className="enterprise-kicker">PMS4U Adoption Surface</div>
              <h2 className="mt-2 text-2xl font-semibold">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.summary}</p>
              <div className="mt-4 text-sm font-semibold text-teal-700">Open →</div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
