import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PMS4U Investor Technical Report",
  description:
    "Investor technical report for PMS4U, covering CEI architecture, execution authority, proof surfaces, pilot readiness, and roadmap.",
};

const facts = [
  ["Category", "Constitutional Execution Infrastructure"],
  ["Doctrine", "Authority Before Execution"],
  ["Runtime", "Next.js 16.2.1 / React 19.2.4"],
  ["Status", "Build and lint passing"],
  ["Investor focus", "Runtime authority for consequential automation"],
  ["Pilot target", "One high-consequence workflow in 90 days"],
];

const architecture = [
  ["Execution request", "A user, AI agent, workflow engine, or API requests a state transition."],
  ["State verification", "The current state and requested next state are checked against allowed paths."],
  ["Authority verification", "The actor is evaluated against the authority required for that transition."],
  ["Admissibility decision", "The boundary returns allow, deny, defer, interrupt, or observe."],
  ["Evidence sealing", "Admissible execution generates receipt data, event hashes, and lineage."],
  ["Replay and proof", "Execution history can be reconstructed for diligence, audit, and assurance."],
];

const surfaces = [
  ["Home", "Positions PMS4U as a governance-first execution system."],
  ["Authority", "Maps the authority structure across companies, systems, and operating surfaces."],
  ["Doctrine", "Explains governed execution and the operational category."],
  ["Proof Surface", "Demonstrates governed execution versus blocked execution."],
  ["Trace", "Shows lineage, receipts, authority context, and replay patterns."],
  ["Console", "Simulates runtime decisioning, escalation, denial, interruption, and override flows."],
  ["Workspace Report", "Provides broad technical and operational workspace reporting."],
  ["Investor Report", "Provides this publishable investor and diligence cut."],
];

const useCases = [
  ["Banking and financial operations", "Corporate account review, payment holds, compliance routing, and senior approval gates."],
  ["Insurance", "Claims escalation, settlement approval, exception handling, and audit-ready evidence retrieval."],
  ["Procurement", "Supplier onboarding, purchase approval, contract progression, and delegated workflow execution."],
  ["Regulated operations", "Healthcare-style workflows, export control, controlled document automation, and sensitive approvals."],
  ["AI agent governance", "Control what AI agents may execute, not only what they may generate."],
];

const positioning = [
  ["AI safety", "Model behavior and outputs", "Execution authority at runtime"],
  ["Compliance", "Policies, tasks, evidence collection", "Preventive admissibility before consequence"],
  ["Observability", "Logs, metrics, traces", "Invalid transition blocking before mutation"],
  ["Access control", "User or token permission", "Transition-specific authority"],
  ["Workflow engines", "Process automation", "Constitutional state governance"],
  ["Audit tools", "Reconstruction after activity", "Preventive control plus replay"],
];

const strengths = [
  "Clear category definition around Constitutional Execution Infrastructure.",
  "Strong doctrine: Authority Before Execution.",
  "Working proof surfaces that demonstrate the execution boundary.",
  "Modular governance UI components.",
  "Static-safe investor and report routes.",
  "Commercial material already prepared for investor and enterprise discussion.",
];

const limitations = [
  "Some runtime surfaces are still simulation-heavy.",
  "Live trace behavior depends on backend service availability.",
  "Enterprise authentication and key management need production packaging.",
  "API integration guides need to be formalized.",
  "Signed execution receipts should be added for stronger external assurance.",
  "More automated tests are needed around trace integrity and transition enforcement.",
];

const roadmap = [
  ["Phase 1", "Stabilized Runtime Foundation", "Build and lint passing, App Router surfaces active, proof and console demonstrations present."],
  ["Phase 2", "Commercial Packaging", "Finalize investor report, enterprise deck, banking demo script, pilot offer, and pricing language."],
  ["Phase 3", "Integration Readiness", "Package governance core, define deployment modes, and provide CRM, ERP, and agent adapters."],
  ["Phase 4", "Assurance Layer", "Add signed receipts, evidence export formats, partner review flows, and ledger-based proof reports."],
  ["Phase 5", "Enterprise Pilot", "Run one controlled workflow pilot and convert results into commercial sales proof."],
];

function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-slate-200 py-8 print:break-inside-avoid">
      <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">{label}</div>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function TwoColumnList({ rows }: { rows: string[][] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {rows.map(([title, body]) => (
        <div key={title} className="border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">{body}</p>
        </div>
      ))}
    </div>
  );
}

export default function InvestorTechnicalReportPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-8 text-slate-950 sm:px-8 print:px-0 print:py-0">
      <style>{`
        @media print {
          a[href]::after { content: ""; }
          .no-print { display: none !important; }
          body { background: #fff; }
        }
      `}</style>

      <article className="mx-auto max-w-5xl">
        <nav className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 border border-slate-200 px-4 py-3 text-sm">
          <div className="font-semibold">PMS4U Investor Technical Report</div>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="text-blue-700 underline">
              Home
            </Link>
            <Link href="/workspace-technical-report" className="text-blue-700 underline">
              Workspace Report
            </Link>
            <Link href="/console" className="text-blue-700 underline">
              Console
            </Link>
          </div>
        </nav>

        <header className="border-b-4 border-slate-950 pb-7">
          <div className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
            PMS4U / CEI / Investor Cut
          </div>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">
            Investor Technical Report
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-700">
            PMS4U is runtime governance infrastructure for enterprises deploying AI agents,
            automation, and high-consequence digital workflows. It enforces Authority Before
            Execution: validating state, authority, admissibility, and evidence before operational
            consequence becomes real.
          </p>
          <div className="mt-6 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {facts.map(([label, value]) => (
              <div key={label} className="border border-slate-200 px-4 py-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</div>
                <div className="mt-1 font-semibold">{value}</div>
              </div>
            ))}
          </div>
        </header>

        <Section label="01" title="Executive Summary">
          <div className="space-y-4 text-sm leading-7 text-slate-700">
            <p>
              Most governance, compliance, and audit platforms operate before or after execution.
              PMS4U is positioned at the execution boundary. It validates whether a requested
              transition is currently admissible before mutation is committed.
            </p>
            <p>
              If the action is inadmissible, execution is blocked before consequence. If the action
              is admissible, PMS4U records evidence and preserves replayable lineage. This creates a
              defensible proof surface for high-trust automation, regulated workflows, and AI agent
              execution.
            </p>
            <blockquote className="border-l-4 border-slate-950 pl-4 text-base font-semibold text-slate-950">
              Is this action still authorized to execute right now?
            </blockquote>
          </div>
        </Section>

        <Section label="02" title="Product Category">
          <p className="max-w-3xl text-sm leading-7 text-slate-700">
            PMS4U implements Constitutional Execution Infrastructure. The application does not
            assume unrestricted mutation sovereignty. A user, agent, workflow, or API can request an
            action, but PMS4U decides whether that action is admissible at the final boundary before
            mutation.
          </p>
        </Section>

        <Section label="03" title="Technical Architecture">
          <TwoColumnList rows={architecture} />
        </Section>

        <Section label="04" title="Implemented Surfaces">
          <TwoColumnList rows={surfaces} />
        </Section>

        <Section label="05" title="Evidence Model">
          <p className="max-w-3xl text-sm leading-7 text-slate-700">
            PMS4U treats evidence as part of execution, not as a retrospective attachment. Evidence
            includes entity identifiers, actors, prior state, requested state, transition identifiers,
            authority levels, decisions, evidence identifiers, event hashes, timestamps, and
            replayable lineage.
          </p>
          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {[
              "What was requested?",
              "Who requested it?",
              "Was the transition allowed?",
              "What authority was required?",
              "What evidence was sealed?",
              "Can the path be reconstructed?",
            ].map((item) => (
              <div key={item} className="border border-slate-200 px-4 py-3 font-medium">
                {item}
              </div>
            ))}
          </div>
        </Section>

        <Section label="06" title="Commercial Use Cases">
          <TwoColumnList rows={useCases} />
        </Section>

        <Section label="07" title="Investor Thesis">
          <div className="space-y-4 text-sm leading-7 text-slate-700">
            <p>
              AI adoption is moving from generation to execution. The first wave produced content,
              summaries, analysis, and recommendations. The next wave will trigger APIs, move
              records, approve workflows, prepare transactions, and coordinate operational processes.
            </p>
            <p>
              That shift creates a new infrastructure requirement: enterprises need a runtime
              boundary that proves whether automated execution is allowed before it happens. PMS4U
              is positioned as that execution authority layer.
            </p>
          </div>
        </Section>

        <Section label="08" title="Competitive Positioning">
          <div className="overflow-hidden border border-slate-200">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-3">Category</th>
                  <th className="border-b border-slate-200 px-4 py-3">Typical Focus</th>
                  <th className="border-b border-slate-200 px-4 py-3">PMS4U Difference</th>
                </tr>
              </thead>
              <tbody>
                {positioning.map(([category, focus, difference]) => (
                  <tr key={category}>
                    <td className="border-b border-slate-200 px-4 py-3 font-semibold">{category}</td>
                    <td className="border-b border-slate-200 px-4 py-3 text-slate-700">{focus}</td>
                    <td className="border-b border-slate-200 px-4 py-3 text-slate-700">{difference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section label="09" title="Pilot Readiness">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold">Recommended 90-day pilot structure</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
                <li>Select one workflow with clear states and authority gates.</li>
                <li>Define allowed transitions and forbidden transitions.</li>
                <li>Map actors to authority levels.</li>
                <li>Integrate PMS4U as the runtime admissibility boundary.</li>
                <li>Run governed, unauthorized, and escalation scenarios.</li>
                <li>Measure blocked transitions, evidence retrieval, replay accuracy, and audit effort.</li>
              </ol>
            </div>
            <div className="border border-slate-200 p-4">
              <h3 className="text-sm font-semibold">Pilot success targets</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <li>Unauthorized transition prevention: 100% for governed paths.</li>
                <li>Evidence retrieval: under 5 minutes.</li>
                <li>Replay accuracy: 100% for sealed events.</li>
                <li>Audit preparation: 50% to 80% reduction.</li>
                <li>Incident reconstruction: material reduction through lineage replay.</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section label="10" title="Strengths and Limitations">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold">Technical strengths</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Current hardening points</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {limitations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section label="11" title="Roadmap">
          <div className="space-y-3">
            {roadmap.map(([phase, title, body]) => (
              <div key={phase} className="grid gap-3 border border-slate-200 p-4 md:grid-cols-[120px_1fr]">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{phase}</div>
                <div>
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section label="12" title="Publishing Cut Conclusion">
          <div className="space-y-4 text-sm leading-7 text-slate-700">
            <p>
              PMS4U is ready to be presented as an investor-facing technical category proof. The
              strongest external positioning is Constitutional Execution Infrastructure for
              enterprises deploying AI, automation, and high-consequence digital workflows.
            </p>
            <p>
              The next value increase comes from one focused enterprise pilot that converts the
              current technical proof into measurable buyer evidence.
            </p>
            <blockquote className="border-l-4 border-slate-950 pl-4 text-base font-semibold text-slate-950">
              PMS4U enforces Authority Before Execution.
            </blockquote>
          </div>
        </Section>
      </article>
    </main>
  );
}
