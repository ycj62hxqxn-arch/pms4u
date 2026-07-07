import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PMS4U Reference Architecture",
  description:
    "Reference architecture for governed execution: authority resolution, admissibility, execution control, and evidence lineage.",
};

const architectureFlow = [
  "Authority Context",
  "Authority Resolver",
  "Admissibility Engine",
  "Execution Gate",
  "Evidence Spine",
  "Consequence Commit",
] as const;

const components = [
  ["Authority Resolver", "Resolves who may perform this exact transition now."],
  ["Admissibility Engine", "Checks if transition is currently permissible within policy/state."],
  ["Execution Gate", "Applies allow/deny/defer/interrupt/observe before mutation."],
  ["Evidence Spine", "Seals receipts, hashes, and replay lineage for independent verification."],
] as const;

export default function ReferenceArchitecturePage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="border border-white/10 bg-white/[0.03] p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">PMS4U</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Reference Architecture</h1>
          <p className="mt-5 max-w-4xl text-base leading-8 text-gray-300">
            Execution governance architecture for consequence-bearing transitions across human workflows,
            software automation, and AI-driven systems.
          </p>
        </header>

        <section className="border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Canonical Flow</h2>
          <div className="mt-5 grid gap-2 md:grid-cols-6">
            {architectureFlow.map((step, idx) => (
              <div key={step} className="border border-emerald-300/30 bg-emerald-950/20 px-3 py-3 text-center text-sm font-medium text-emerald-100">
                {step}
                {idx < architectureFlow.length - 1 && <div className="mt-2 text-emerald-300">↓</div>}
              </div>
            ))}
          </div>
        </section>

        <section className="border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Core Components</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {components.map(([title, body]) => (
              <article key={title} className="border border-white/10 bg-white/[0.02] p-5">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-gray-300">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Implementation Notes</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-gray-300">
            <li>Transition-specific authority must be resolved at runtime, not inferred from static role alone.</li>
            <li>Admissibility decisions are evaluated before state mutation.</li>
            <li>Each admissible transition should emit evidence artifacts with hash continuity.</li>
            <li>Replay and trace are first-class requirements, not optional diagnostics.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
