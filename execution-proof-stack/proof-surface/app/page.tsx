"use client";

import { useEffect, useState } from "react";
import styles from "./proof-surface.module.css";

type EvidenceRecord = {
  correlation_id?: string;
  evidence_id?: string;
  timestamp?: string;
  authority_chain?: string[];
  verdict?: string;
  reason?: string;
  mutation_status?: string;
  consequence_domain?: string;
  runtime_hash?: string;
  execution_trace?: string[] | string;
  ledger_position?: string | number;
  seal_state?: string;
  prev_hash?: string;
  current_hash?: string;
};

const executionSteps = [
  { step: 1, label: "AI requests execution" },
  { step: 2, label: "Governance layer evaluates (authority, risk, policy, context)" },
  { step: 3, label: "Context changes" },
  { step: 4, label: "Admissibility reevaluated" },
  { step: 5, label: "Execution blocked/allowed" },
  { step: 6, label: "Ledger append occurs" },
  { step: 7, label: "Evidence chain preserved" },
  { step: 8, label: "Operator escalation triggered (if needed)" },
];

export default function ProofSurfacePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [latestEvidence, setLatestEvidence] = useState<EvidenceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvidence() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api-latest-evidence");
        const data = (await res.json()) as { latest?: EvidenceRecord };
        if (data.latest) setLatestEvidence(data.latest);
        else setError("No evidence found");
      } catch {
        setError("Could not fetch evidence");
      }
      setLoading(false);
    }

    fetchEvidence();
  }, []);

  const handleNext = () => {
    if (currentStep < executionSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReset = () => setCurrentStep(1);

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Constitutional Execution Proof Surface</h1>
      <div style={{ marginBottom: 24, padding: 16, background: "#f5f5f5", borderRadius: 8, border: "1px solid #e0e0e0" }}>
        {loading ? (
          <span>Loading latest execution proof…</span>
        ) : error ? (
          <span style={{ color: "#b71c1c" }}>{error}</span>
        ) : latestEvidence ? (
          <>
            <div>
              <strong>Correlation ID:</strong>{" "}
              <span style={{ color: "#1976d2" }}>{latestEvidence.correlation_id}</span>
            </div>
            <div>
              <strong>Evidence ID:</strong> {latestEvidence.evidence_id}
            </div>
            <div>
              <strong>Timestamp:</strong> {latestEvidence.timestamp}
            </div>
            <div>
              <strong>Authority Chain:</strong> {latestEvidence.authority_chain?.join(" → ")}
            </div>
            <div>
              <strong>Verdict:</strong>{" "}
              <span
                style={{
                  color:
                    latestEvidence.verdict === "ALLOW"
                      ? "#388e3c"
                      : latestEvidence.verdict === "DENY"
                        ? "#b71c1c"
                        : latestEvidence.verdict === "HOLD"
                          ? "#fbc02d"
                          : "#1976d2",
                }}
              >
                {latestEvidence.verdict}
              </span>
            </div>
            <div>
              <strong>Reason:</strong> {latestEvidence.reason}
            </div>
            <div>
              <strong>Mutation Status:</strong> {latestEvidence.mutation_status}
            </div>
            <div>
              <strong>Consequence Domain:</strong> {latestEvidence.consequence_domain}
            </div>
            <div>
              <strong>Runtime Hash:</strong> {latestEvidence.runtime_hash}
            </div>
            <div>
              <strong>Execution Trace:</strong>{" "}
              {Array.isArray(latestEvidence.execution_trace)
                ? latestEvidence.execution_trace.join(" → ")
                : latestEvidence.execution_trace}
            </div>
            <div>
              <strong>Ledger Position:</strong> {latestEvidence.ledger_position}
            </div>
            <div>
              <strong>Seal State:</strong> {latestEvidence.seal_state}
            </div>
            <div>
              <strong>Prev Hash:</strong>{" "}
              <span style={{ fontFamily: "monospace", fontSize: 12 }}>{latestEvidence.prev_hash}</span>
            </div>
            <div>
              <strong>Current Hash:</strong>{" "}
              <span style={{ fontFamily: "monospace", fontSize: 12 }}>{latestEvidence.current_hash}</span>
            </div>
          </>
        ) : null}
      </div>
      <ol className={styles.steps}>
        {executionSteps.map(({ step, label }) => {
          let status: "done" | "pending" | "next" = "pending";
          if (step < currentStep) status = "done";
          else if (step === currentStep) status = "next";
          return (
            <li
              key={step}
              className={
                status === "done"
                  ? styles.stepDone
                  : status === "next"
                    ? styles.stepNext
                    : styles.stepPending
              }
            >
              <span className={styles.icon}>
                {status === "done" ? "✔️" : status === "next" ? "➡️" : "⏳"}
              </span>
              <span>{label}</span>
            </li>
          );
        })}
      </ol>
      <div className={styles.footer}>
        <strong>Live Proof:</strong> Step {currentStep} of {executionSteps.length}
        <br />
        <button onClick={handleNext} disabled={currentStep === executionSteps.length} className={styles.buttonNext}>
          Next
        </button>
        <button onClick={handleReset} className={styles.buttonReset}>
          Reset
        </button>
        <div className={styles.footerInfo}>
          {currentStep === executionSteps.length
            ? "Scenario complete. All steps proven."
            : "Advance to see each proof step live."}
        </div>
      </div>
    </main>
  );
}
