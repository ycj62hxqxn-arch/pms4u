"use client";

import { useState } from "react";
import styles from "./page.module.css";

const steps = [
  { label: "REQUEST RECEIVED" },
  { label: "AUTHORITY VERIFIED" },
  { label: "ADMISSIBILITY EVALUATED" },
  { label: "CONSTITUTIONAL VERDICT" },
  { label: "FREEZE ENGAGED" },
  { label: "LEDGER SEALED" },
];

type VerdictType = "allow" | "freeze";

export default function ProofSurfacePage() {
  const [verdict, setVerdict] = useState<VerdictType>("freeze");

  return (
    <main className={styles.container}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Execution is admissible.</h1>
        <div className={styles.heroSubtitle}>
          No irreversible mutation may occur outside the constitutional execution boundary.
        </div>
      </div>
      <section className={styles.surfaceSection}>
        <div className={styles.timelineWrapper}>
          {steps.map((step, idx) => (
            <div
              key={step.label}
              className={
                styles.timelineStep +
                (verdict === "freeze" && idx === 4 ? ` ${styles.freezeStep}` : "") +
                (verdict === "allow" && idx === 4 ? ` ${styles.allowStep}` : "") +
                (idx < 4 ? ` ${styles.activeStep}` : "") +
                (idx > 4 ? ` ${styles.fadedStep}` : "")
              }
            >
              <div className={styles.timelineDot} />
              <div className={styles.timelineLabel}>{step.label}</div>
              {verdict === "freeze" && idx === 4 && (
                <div className={styles.freezeOverlay}>
                  <div className={styles.verdictSeal}>CONSTITUTIONAL FREEZE</div>
                  <div className={styles.freezeText}>Mutation blocked before consequence binding.</div>
                </div>
              )}
              {verdict === "allow" && idx === 4 && (
                <div className={styles.allowOverlay}>
                  <div className={styles.verdictSealAllow}>EXECUTION ALLOWED</div>
                  <div className={styles.allowText}>Mutation proceeds. Ledger will be sealed.</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.evidenceChainWrapper}>
          <div className={styles.evidenceTitle}>Evidence Chain</div>
          <div className={styles.evidenceChain}>
            <div className={styles.evidenceMarker + " " + styles.verified}>Signer Chain Verified</div>
            <div className={styles.evidenceMarker + " " + styles.sealed}>Evidence Hash Sealed</div>
            <div className={styles.evidenceMarker + " " + styles.persisted}>Replay Lineage Persisted</div>
          </div>
        </div>
        <div className={styles.buttonRow}>
          <button
            className={styles.toggleBtn}
            onClick={() => setVerdict(verdict === "freeze" ? "allow" : "freeze")}
          >
            {verdict === "freeze" ? "Simulate ALLOW" : "Simulate FREEZE"}
          </button>
        </div>
        <div className={styles.videoRow}>
          <video controls width="640" className={styles.proofVideo}>
            <source src="/assets/demo_enforcement.mov" type="video/quicktime" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
    </main>
  );
}
