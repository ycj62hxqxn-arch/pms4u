import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PMS4U Executive Brief",
  description:
    "Six-minute executive brief for PMS4U: problem, risk, architecture, business value, and adoption path.",
};

const riskRows = [
  ["Wrong payment or release", "Financial and audit exposure"],
  ["Unauthorized shipment/export", "Operational and compliance exposure"],
  ["Customer data export", "Liability and trust exposure"],
] as const;

const valueRows = [
  ["Before consequence control", "Authority and admissibility checked before mutation"],
  ["Audit readiness", "Evidence and replay chain by default"],
  ["Operational continuity", "Deny, defer, interrupt, observe at runtime"],
] as const;

export default function ExecutiveBriefPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="border border-white/10 bg-white/[0.03] p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">PMS4U</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Executive Brief</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-gray-300">
            PMS4U is execution governance infrastructure: it resolves authority and admissibility before
            consequence-bearing actions are allowed to mutate reality.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold">Problem</h2>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              Most systems validate access at session start, then allow workflows to continue without
              transition-specific authority checks at execution time.
            </p>
          </article>

          <article className="border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold">What changes with PMS4U</h2>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              Execution requests pass through runtime authority resolution and admissibility checks first,
              then produce traceable evidence if approved.
            </p>
          </article>
        </section>

        <section className="border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Risk Lens</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border border-white/10 bg-white/[0.04]">
                  <th className="px-3 py-2 text-left">Risk Event</th>
                  <th className="px-3 py-2 text-left">Enterprise Impact</th>
                </tr>
              </thead>
              <tbody>
                {riskRows.map(([a, b]) => (
                  <tr key={a} className="border border-white/10">
                    <td className="px-3 py-2">{a}</td>
                    <td className="px-3 py-2 text-gray-300">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Business Value</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border border-white/10 bg-white/[0.04]">
                  <th className="px-3 py-2 text-left">Value Dimension</th>
                  <th className="px-3 py-2 text-left">What PMS4U Provides</th>
                </tr>
              </thead>
              <tbody>
                {valueRows.map(([a, b]) => (
                  <tr key={a} className="border border-white/10">
                    <td className="px-3 py-2">{a}</td>
                    <td className="px-3 py-2 text-gray-300">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Adoption Path</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-gray-300">
            <li>Choose one consequential workflow.</li>
            <li>Map allowed transitions and authority levels.</li>
            <li>Integrate PMS4U as runtime admissibility boundary.</li>
            <li>Run governed, denied, deferred, and escalation scenarios.</li>
            <li>Review evidence, replay, and latency metrics.</li>
          </ol>
        </section>

        <footer className="flex flex-wrap gap-3 border-t border-white/10 pt-8">
          <Link href="/reference-architecture" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-100">
            Open Reference Architecture
          </Link>
          <Link href="/authority-audit-sprint" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-white">
            Book Executive Sprint
          </Link>
        </footer>
      </div>
    </main>
  );
}
