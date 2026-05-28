import React from "react";
import styles from "./page.module.css";

export default function ProofSurface() {
  return (
    <main className={styles.container}>
      <section className={styles.section}>
        <h1 className={styles.heading}>
          Constitutional Execution Infrastructure (CEI)
        </h1>
        <h2 className={styles.subheading}>Category</h2>
        <p>Constitutional Execution Infrastructure (CEI)</p>
        <p className={styles.italic}>
          A runtime governance architecture category where consequential execution cannot occur outside constitutional admissibility boundaries.
        </p>
        <hr className={styles.hr} />
        <h2 className={styles.subheading}>Core Doctrine</h2>
        <p className={styles.bold}>Authority Before Execution.</p>
        <p>No irreversible mutation may occur outside the Constitutional Execution Boundary.</p>
        <hr className={styles.hr} />
        <h2 className={styles.subheading}>What This System Does</h2>
        <p>The Constitutional Execution Gateway intercepts consequential execution requests before mutation occurs.</p>
        <ul>
          <li>authority integrity,</li>
          <li>runtime admissibility,</li>
          <li>contextual validity,</li>
          <li>consequence classification,</li>
          <li>execution policy,</li>
          <li>and evidence requirements</li>
        </ul>
        <p>before allowing execution continuation.</p>
        <p>If admissibility fails during runtime:</p>
        <ul>
          <li>execution freezes,</li>
          <li>evidence seals,</li>
          <li>replay lineage persists,</li>
          <li>and irreversible mutation is prevented.</li>
        </ul>
        <hr className={styles.hr} />
        <h2 className={styles.subheading}>Why This Category Exists</h2>
        <p>Traditional governance systems operate:</p>
        <ul>
          <li>after execution,</li>
          <li>outside runtime,</li>
          <li>or through static policy documentation.</li>
        </ul>
        <p>Autonomous systems execute faster than retrospective governance can respond.</p>
        <p>This architecture moves governance into execution itself.</p>
        <hr className={styles.hr} />
        <h2 className={styles.subheading}>Core Capabilities</h2>
        <ul>
          <li>Runtime Admissibility Evaluation</li>
          <li>Constitutional Freeze Enforcement</li>
          <li>Evidence-bound Execution</li>
          <li>Replayable Consequence Lineage</li>
          <li>Authority Integrity Validation</li>
          <li>Consequence-aware Runtime Control</li>
          <li>Context Drift Detection</li>
          <li>Constitutional Verdict Objects</li>
        </ul>
        <hr className={styles.hr} />
        <h2 className={styles.subheading}>Signature Principle</h2>
        <p>Proof before power.<br />Evidence before consequence.<br />Authority before execution.</p>
        <section style={{ margin: '2rem 0' }}>
          <h2>Canonical Enforcement Demo (MOV)</h2>
          <video controls width="640" style={{ borderRadius: '12px', boxShadow: '0 2px 16px #0002' }}>
            <source src="/assets/demo_enforcement.mov" type="video/quicktime" />
            Your browser does not support the video tag.
          </video>
        </section>
      </section>
    </main>
  );
}
