import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PMS4U Runtime SDK",
  description:
    "Developer adoption surface for PMS4U runtime governance with JavaScript and Python SDK contracts.",
};

const jsExample = `import { evaluateAction } from "@pms4u/runtime";

const result = await evaluateAction({
  action: "release_order",
  authority: { actor: "sig_ops", role: "CARSHUNTER" },
  evidence: { traceId: "trc_01", stateHash: "sha256:..." },
});

console.log(result.decision); // ALLOW | DENY | REVIEW | DEFER`;

const pyExample = `from pms4u import evaluate_action

result = evaluate_action(
    action="release_order",
    authority={"actor": "sig_ops", "role": "CARSHUNTER"},
    evidence={"trace_id": "trc_01", "state_hash": "sha256:..."}
)

print(result["decision"])  # ALLOW | DENY | REVIEW | DEFER`;

const roadmap = [
  ["Contract", "Unified request/decision schema aligned to constitutional runtime."],
  ["Adapters", "HTTP adapter for governance-core plus local simulator mode."],
  ["Evidence helpers", "Receipt/hash helpers for continuity and replay references."],
  ["Tracing hooks", "Trace ID propagation and decision metadata helpers."],
];

export default function RuntimeSdkPage() {
  return (
    <main className="enterprise-shell py-12">
      <div className="enterprise-wrap space-y-8">
        <header className="enterprise-hero">
          <div className="enterprise-kicker">Developer Adoption</div>
          <h1 className="enterprise-h1">PMS4U Runtime SDK</h1>
          <p className="enterprise-lead">
            SDK surfaces are introduced to accelerate implementation adoption. The runtime model remains
            authority-first, admissibility-first, and evidence-bound before consequence.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="enterprise-chip">npm install @pms4u/runtime</span>
            <span className="enterprise-chip">pip install pms4u</span>
          </div>
        </header>

        <section className="enterprise-card">
          <h2 className="text-2xl font-semibold">JavaScript package</h2>
          <pre className="mt-4 overflow-x-auto rounded border border-slate-200 bg-slate-950 p-4 text-xs leading-6 text-slate-100">
{jsExample}
          </pre>
        </section>

        <section className="enterprise-card">
          <h2 className="text-2xl font-semibold">Python package</h2>
          <pre className="mt-4 overflow-x-auto rounded border border-slate-200 bg-slate-950 p-4 text-xs leading-6 text-slate-100">
{pyExample}
          </pre>
        </section>

        <section className="enterprise-card">
          <h2 className="text-2xl font-semibold">SDK release scope</h2>
          <table className="enterprise-table mt-4">
            <thead>
              <tr><th>Layer</th><th>Purpose</th></tr>
            </thead>
            <tbody>
              {roadmap.map(([layer, purpose]) => (
                <tr key={layer}>
                  <td className="font-semibold">{layer}</td>
                  <td className="text-slate-600">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm text-slate-600">
            Next: publish package manifests and versioned changelog with conformance tests against
            governance-core decision contracts.
          </p>
        </section>

        <section className="enterprise-card">
          <h2 className="text-2xl font-semibold">Related surfaces</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Link href="/reference-architecture" className="rounded border border-slate-200 p-4 text-sm font-semibold hover:border-slate-400">Reference Architecture</Link>
            <Link href="/playground" className="rounded border border-slate-200 p-4 text-sm font-semibold hover:border-slate-400">Public Playground</Link>
            <Link href="/case-studies" className="rounded border border-slate-200 p-4 text-sm font-semibold hover:border-slate-400">Case Studies</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
