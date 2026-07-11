"use client";

import { FormEvent, useMemo, useState } from "react";

type Decision = "ALLOW" | "DENY" | "REVIEW" | "DEFER";

type PlaygroundResult = {
  decision: Decision;
  reasoning: string[];
};

function evaluate(action: string, authority: string, evidence: string): PlaygroundResult {
  const normalizedAction = action.trim().toLowerCase();
  const normalizedAuthority = authority.trim().toLowerCase();
  const normalizedEvidence = evidence.trim().toLowerCase();

  const reasoning: string[] = [];

  const hasAuthority = normalizedAuthority.includes("sig_") || normalizedAuthority.includes("director") || normalizedAuthority.includes("legal") || normalizedAuthority.includes("ops");
  const hasEvidence = normalizedEvidence.includes("trace") || normalizedEvidence.includes("hash") || normalizedEvidence.includes("receipt") || normalizedEvidence.includes("signature");
  const highRisk = normalizedAction.includes("release") || normalizedAction.includes("transfer") || normalizedAction.includes("commit") || normalizedAction.includes("publish");

  if (!normalizedAction) {
    return { decision: "DEFER", reasoning: ["No action was provided."] };
  }

  if (!hasAuthority) {
    reasoning.push("Authority context is insufficient for runtime resolution.");
    return { decision: "DENY", reasoning };
  }

  if (!hasEvidence) {
    reasoning.push("Evidence context is incomplete for admissibility evaluation.");
    return { decision: "REVIEW", reasoning };
  }

  if (highRisk && !normalizedEvidence.includes("signature")) {
    reasoning.push("High-consequence action requires stronger evidence (e.g., signature/receipt continuity).");
    return { decision: "DEFER", reasoning };
  }

  reasoning.push("Authority resolved and evidence sufficiency passed for current admissibility check.");
  return { decision: "ALLOW", reasoning };
}

export function PlaygroundClient() {
  const [action, setAction] = useState("release_order");
  const [authority, setAuthority] = useState("sig_ops / CARSHUNTER");
  const [evidence, setEvidence] = useState("trace_id: trc_001, state_hash: sha256:..., signature: sig_legal");
  const [result, setResult] = useState<PlaygroundResult | null>(null);

  const decisionTone = useMemo(() => {
    if (!result) return "border-slate-200 bg-slate-50 text-slate-700";
    if (result.decision === "ALLOW") return "border-emerald-200 bg-emerald-50 text-emerald-700";
    if (result.decision === "DENY") return "border-rose-200 bg-rose-50 text-rose-700";
    if (result.decision === "REVIEW") return "border-amber-200 bg-amber-50 text-amber-700";
    return "border-blue-200 bg-blue-50 text-blue-700";
  }, [result]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(evaluate(action, authority, evidence));
  }

  return (
    <>
      <section className="enterprise-card">
        <form onSubmit={onSubmit} className="enterprise-grid md:grid-cols-3">
          <label className="text-sm font-semibold text-slate-700">
            Action
            <input
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="mt-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Authority
            <input
              value={authority}
              onChange={(e) => setAuthority(e.target.value)}
              className="mt-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Evidence
            <input
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className="mt-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </label>
          <div className="md:col-span-3">
            <button type="submit" className="rounded border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
              Evaluate Runtime Decision
            </button>
          </div>
        </form>
      </section>

      <section className="enterprise-card">
        <h2 className="text-2xl font-semibold">Decision Output</h2>
        <div className={`mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${decisionTone}`}>
          {result ? result.decision : "No decision yet"}
        </div>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
          {(result?.reasoning ?? ["Submit the form to view runtime reasoning."]).map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
