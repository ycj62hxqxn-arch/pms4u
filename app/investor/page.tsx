import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PMS4U Investor Brief",
  description:
    "Investor page for PMS4U Constitutional Execution Infrastructure: runtime authority, admissibility control, evidence lineage, and pilot economics.",
};

const categoryRows = [
  ["AI Safety", "Model behavior and outputs", "Execution authority at runtime"],
  ["Compliance Platforms", "Policies and attestations", "Preventive admissibility before consequence"],
  ["Observability", "Logs, traces, metrics", "Invalid transition blocking before mutation"],
  ["Access Control", "User or token permission", "Transition-specific authority checks"],
  ["Workflow Engines", "Process automation", "Constitutional state governance and evidence lineage"],
];

const roadmap = [
  "Phase 1: Stabilized runtime foundation and proof surfaces.",
  "Phase 2: Commercial packaging for banking and regulated workflow demos.",
  "Phase 3: Integration readiness with API guides and deployment patterns.",
  "Phase 4: Assurance layer with signed receipts and partner review flows.",
  "Phase 5: One controlled enterprise pilot and commercial conversion proof.",
];

export default function InvestorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 inline-flex rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Constitutional Execution Infrastructure
          </div>
          <h1 className="max-w-5xl text-4xl font-bold tracking-tight sm:text-6xl">
            PMS4U Investor Brief
          </h1>
          <p className="mt-5 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg">
            PMS4U enforces Authority Before Execution for consequential AI and automation. It
            validates authority, checks transition admissibility, issues evidence, appends ledger
            truth, then commits or freezes execution.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="text-2xl font-bold text-emerald-300">Near-zero</div>
              <p className="mt-2 text-sm text-slate-400">Unauthorized transitions on governed paths.</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="text-2xl font-bold text-emerald-300">50-80%</div>
              <p className="mt-2 text-sm text-slate-400">Potential audit preparation time reduction.</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="text-2xl font-bold text-emerald-300">Minutes</div>
              <p className="mt-2 text-sm text-slate-400">Evidence retrieval instead of days.</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="text-2xl font-bold text-emerald-300">90 days</div>
              <p className="mt-2 text-sm text-slate-400">Target pilot window for one workflow.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-2xl font-semibold">Investment Thesis</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              AI adoption increases delegated execution, and delegated execution increases
              institutional risk. Static governance cannot fully control runtime consequence.
              Enterprises need enforceable boundaries where actions become real.
            </p>
            <blockquote className="mt-4 border-l-4 border-emerald-400 pl-4 text-slate-100">
              Should this action be allowed to execute right now?
            </blockquote>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="text-lg font-semibold">Execution Rule</h3>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-300">
                <li>Validate actor authority.</li>
                <li>Evaluate transition admissibility.</li>
                <li>Issue execution evidence.</li>
                <li>Append ledger event and hash chain.</li>
                <li>Commit or freeze mutation.</li>
              </ol>
            </article>

            <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="text-lg font-semibold">Runtime Primitives</h3>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
                <li>
                  <strong>EXECUTE</strong>: admissible, commit allowed.
                </li>
                <li>
                  <strong>DENY</strong>: inadmissible, hard stop.
                </li>
                <li>
                  <strong>DEFER</strong>: pending dependency or approval.
                </li>
                <li>
                  <strong>INTERRUPT</strong>: emergency intervention path.
                </li>
                <li>
                  <strong>OBSERVE</strong>: evidence capture without commit.
                </li>
              </ul>
            </article>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-2xl font-semibold">Category Positioning</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-300">
                    <th className="py-3 pr-4 font-semibold">Category</th>
                    <th className="py-3 pr-4 font-semibold">Typical Focus</th>
                    <th className="py-3 font-semibold">PMS4U Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryRows.map(([category, focus, difference]) => (
                    <tr key={category} className="border-b border-slate-800 align-top">
                      <td className="py-3 pr-4 font-medium text-slate-100">{category}</td>
                      <td className="py-3 pr-4 text-slate-300">{focus}</td>
                      <td className="py-3 text-slate-300">{difference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-2xl font-semibold">Roadmap</h2>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-300 sm:text-base">
              {roadmap.map((phase) => (
                <li key={phase}>{phase}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/investor-technical-report" className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500">
              Open full investor technical report
            </Link>
            <Link href="/workspace-technical-report" className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500">
              Open workspace report
            </Link>
            <Link href="/console" className="rounded-lg bg-emerald-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-200">
              Open governance console
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}