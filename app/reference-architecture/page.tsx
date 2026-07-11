import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PMS4U Reference Architecture",
  description:
    "Reference architecture for governed execution: authority resolution, admissibility, execution control, and evidence lineage.",
};

const architectureFlow = [
  "Constitution",
  "Authority Resolver",
  "Admissibility Engine",
  "Execution Gate",
  "Evidence Spine",
  "Execution",
  "Consequence",
] as const;

const components = [
  ["Constitution", "Defines authority boundaries, admissibility constraints, evidence obligations, and consequence ownership outside runtime services."],
  ["Authority Resolver", "Resolves who may perform this exact transition now."],
  ["Admissibility Engine", "Checks if transition is currently permissible within policy state and evidentiary sufficiency."],
  ["Execution Gate", "Applies allow/deny/defer/interrupt/observe before mutation."],
  ["Evidence Spine", "Captures decision inputs and continuity artifacts: receipts, hashes, signatures, and replay lineage."],
  ["Execution", "Commits only what survived admissibility at runtime."],
  ["Consequence", "Represents the real-world or system-level effect with attributable authority trace."],
] as const;

const decisions = [
  ["ALLOW", "All constitutional and runtime admissibility conditions survived."],
  ["DENY", "Transition is inadmissible under current authority, state, or evidence."],
  ["REVIEW", "Escalation required before controlled release."],
  ["DEFER", "Execution intentionally postponed until conditions become valid."],
] as const;

const adoption = [
  ["SDK", "Reference runtime SDK surface for JavaScript and Python adoption.", "/research/runtime-sdk"],
  ["Playground", "Interactive runtime decision simulator for action + authority + evidence.", "/playground"],
  ["Case Studies", "Domain examples: CARSHUNTER, AI Video, Tourism, Trade, Healthcare.", "/case-studies"],
] as const;

export default function ReferenceArchitecturePage() {
  return (
    <main className="enterprise-shell py-12">
      <div className="enterprise-wrap space-y-10">
        <header className="enterprise-hero">
          <div className="enterprise-kicker">PMS4U Flagship Architecture</div>
          <h1 className="enterprise-h1">Constitutional Runtime Governance — Reference Architecture</h1>
          <p className="enterprise-lead">
            This document is the canonical technical view for investors, architects, and engineering teams.
            It defines the runtime flow from constitutional model to consequence, with admissibility and
            evidence positioned as execution-time decision controls.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="enterprise-chip">Authority Before Execution</span>
            <span className="enterprise-chip">Admissibility with Evidence Input</span>
            <span className="enterprise-chip">Replayable Evidence Continuity</span>
          </div>
        </header>

        <section className="enterprise-card">
          <h2 className="text-2xl font-semibold">Canonical Flow</h2>
          <div className="mt-5 grid gap-2 md:grid-cols-7">
            {architectureFlow.map((step, idx) => (
              <div key={step} className="rounded border border-slate-200 bg-cyan-50 px-3 py-3 text-center text-sm font-medium text-slate-900">
                {step}
                {idx < architectureFlow.length - 1 && <div className="mt-2 text-cyan-700">↓</div>}
              </div>
            ))}
          </div>
        </section>

        <section className="enterprise-card">
          <h2 className="text-2xl font-semibold">Core Components</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {components.map(([title, body]) => (
              <article key={title} className="rounded border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="enterprise-card">
          <h2 className="text-2xl font-semibold">Decision Semantics</h2>
          <table className="enterprise-table mt-4">
            <thead>
              <tr><th>Decision</th><th>Meaning</th></tr>
            </thead>
            <tbody>
              {decisions.map(([decision, meaning]) => (
                <tr key={decision}>
                  <td className="font-semibold">{decision}</td>
                  <td className="text-slate-600">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="enterprise-card">
          <h2 className="text-2xl font-semibold">Implementation Notes</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">
            <li>Transition-specific authority must be resolved at runtime, not inferred from static role alone.</li>
            <li>Admissibility decisions are evaluated before state mutation.</li>
            <li>Evidence must be available as a decision input before release and preserved after release for replay.</li>
            <li>Replay and trace are first-class requirements, not optional diagnostics.</li>
          </ul>
        </section>

        <section className="enterprise-card">
          <h2 className="text-2xl font-semibold">Adoption Surfaces</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {adoption.map(([title, body, href]) => (
              <Link key={title} href={href} className="rounded border border-slate-200 bg-white p-4 transition hover:border-slate-400">
                <div className="text-sm font-semibold text-slate-900">{title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">{body}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
