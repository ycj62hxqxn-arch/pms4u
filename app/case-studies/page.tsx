import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PMS4U Case Studies",
  description:
    "Enterprise-oriented case studies for constitutional runtime governance across CARSHUNTER, AI Video, Tourism, Trade, and Healthcare.",
};

const studies = [
  {
    title: "CARSHUNTER",
    domain: "Automotive Operations",
    challenge: "Supplier and execution transitions required admissibility checks before irreversible actions.",
    architecture: "Runtime authority + admissibility gate + evidence continuity across operational transitions.",
    outcome: "Controlled transition flow with traceable authority and replay-ready decision lineage.",
  },
  {
    title: "AI Video",
    domain: "Content Runtime",
    challenge: "Need to move from planning outputs to governed render paths with visible runtime controls.",
    architecture: "Plan API + asset generation + execution gate before final media render.",
    outcome: "Governed generation path with decision visibility and evidence-aware runtime behavior.",
  },
  {
    title: "Tourism",
    domain: "Travel Workflow",
    challenge: "Booking and operational actions required boundary separation and service-level governance controls.",
    architecture: "Independent domain surface with governance-aligned service boundaries.",
    outcome: "Separated execution domains and clearer operational responsibility mapping.",
  },
  {
    title: "Trade",
    domain: "Compliance + Execution",
    challenge: "Execution decisions needed to survive authority and admissibility checks under changing policy state.",
    architecture: "Constitutional model + runtime authority + admissibility with evidence input.",
    outcome: "Improved decision defensibility before consequence-bearing transitions.",
  },
  {
    title: "Healthcare",
    domain: "High-Consequence Governance",
    challenge: "Sensitive transitions required strict pre-execution validation and auditable evidence continuity.",
    architecture: "Execution gate with explicit deny/defer/review semantics and replayable receipts.",
    outcome: "Stronger governance posture for critical execution workflows.",
  },
];

export default function CaseStudiesPage() {
  return (
    <main className="enterprise-shell py-12">
      <div className="enterprise-wrap space-y-8">
        <header className="enterprise-hero">
          <div className="enterprise-kicker">Enterprise Evidence</div>
          <h1 className="enterprise-h1">Case Studies</h1>
          <p className="enterprise-lead">
            Domain-focused examples showing how constitutional runtime governance is applied before
            consequence in operational environments.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {studies.map((study) => (
            <article key={study.title} className="enterprise-card">
              <div className="enterprise-kicker">{study.domain}</div>
              <h2 className="mt-2 text-2xl font-semibold">{study.title}</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <p><strong className="text-slate-900">Challenge:</strong> {study.challenge}</p>
                <p><strong className="text-slate-900">Architecture:</strong> {study.architecture}</p>
                <p><strong className="text-slate-900">Outcome:</strong> {study.outcome}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
