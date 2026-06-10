import Link from "next/link";
import type { ReactNode } from "react";
import reportData from "./report-data.mjs";

export const metadata = reportData.metadata;

const {
  header,
  quickFacts,
  summary,
  milestones,
  how,
  why,
  changes,
  impact,
  domains,
  sectors,
  projects,
  projectsSection,
  swot,
  sources,
  stackNotes,
} = reportData;

function Section({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="border-b border-white/10 px-6 py-5 sm:px-8">
        <p className="text-xs font-mono uppercase tracking-[0.28em] text-cyan-300">{kicker}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
      </div>
      <div className="px-6 py-6 sm:px-8">{children}</div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
      <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-2 text-base font-semibold text-white">{value}</div>
    </div>
  );
}

export default function WorkspaceTechnicalReportPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.04] to-transparent px-6 py-8 shadow-[0_30px_120px_rgba(0,0,0,0.4)] sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.14),transparent_26%),radial-gradient(circle_at_80%_10%,rgba(212,175,55,0.12),transparent_24%),radial-gradient(circle_at_50%_110%,rgba(34,197,94,0.08),transparent_24%)]" />
          <div className="relative">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-4xl">
                <p className="inline-flex items-center rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
                  {header.eyebrow}
                </p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">{header.title}</h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">{header.lead}</p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <Link
                  href="/"
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-slate-200 transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
                >
                  Home
                </Link>
                <Link
                  href="/authority"
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-slate-200 transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
                >
                  Authority
                </Link>
                <Link
                  href="/trace"
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-slate-200 transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
                >
                  Trace
                </Link>
                <Link
                  href="/workspace-technical-report/print"
                  className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-amber-100 transition hover:border-amber-300/60 hover:bg-amber-300/20"
                >
                  Print / Export
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {quickFacts.map((fact) => (
                <StatCard key={fact.label} label={fact.label} value={fact.value} />
              ))}
            </div>
          </div>
        </header>

        <div className="mt-8 space-y-8">
          <Section kicker="Summary" title={summary.title}>
            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
              <div className="space-y-4 text-sm leading-7 text-slate-300 sm:text-base">
                {summary.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5">
                <div className="text-[11px] font-mono uppercase tracking-[0.24em] text-amber-200">{summary.calloutTitle}</div>
                <div className="mt-3 text-lg font-medium text-white">{summary.calloutLead}</div>
                <div className="mt-3 text-sm leading-6 text-amber-50/80">{summary.calloutBody}</div>
              </div>
            </div>
          </Section>

          <Section kicker="When" title="Milestones achieved">
            <div className="space-y-4">
              {milestones.map((item) => (
                <div
                  key={item.date}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5 transition hover:border-cyan-300/40"
                >
                  <div className="text-xs font-mono uppercase tracking-[0.24em] text-cyan-300">{item.date}</div>
                  <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section kicker="How" title={how.title}>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">{how.implementationTitle}</h3>
                <p className="text-sm leading-6 text-slate-300">{how.implementationBody}</p>
                <div className="flex flex-wrap gap-2">
                  {stackNotes.map((note) => (
                    <span
                      key={note}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">{how.deliveryTitle}</h3>
                <p className="text-sm leading-6 text-slate-300">{how.deliveryBody}</p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full border-collapse text-left">
                <thead className="bg-white/[0.04]">
                  <tr>
                    {how.projectsTableHeaders.map((headerCell) => (
                      <th
                        key={headerCell}
                        className="px-4 py-3 text-xs font-mono uppercase tracking-[0.18em] text-slate-400"
                      >
                        {headerCell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.name} className="border-t border-white/10 bg-black/20 align-top">
                      <td className="px-4 py-4 font-semibold text-white">{project.name}</td>
                      <td className="px-4 py-4 text-sm leading-6 text-slate-300">{project.impact}</td>
                      <td className="px-4 py-4 text-sm leading-6 text-slate-300">{project.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section kicker="Why" title={why.title}>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">{why.problemTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{why.problemBody}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">{why.rationaleTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{why.rationaleBody}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="text-sm font-semibold text-white">{why.categoryTitle}</div>
                <p className="mt-2 text-sm leading-7 text-slate-300">{why.categoryBody}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="text-sm font-semibold text-white">{why.businessTitle}</div>
                <p className="mt-2 text-sm leading-7 text-slate-300">{why.businessBody}</p>
              </div>
            </div>
          </Section>

          <Section kicker="Changes and impact" title={changes.title}>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">{changes.documentationTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{changes.documentationBody}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">{changes.assetsTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{changes.assetsBody}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">{changes.routesTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{changes.routesBody}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">{changes.hygieneTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{changes.hygieneBody}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {changes.impactStats.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
          </Section>

          <Section kicker="Impact" title={impact.title}>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">{impact.securityTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{impact.securityBody}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">{impact.trustTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{impact.trustBody}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">{impact.coherenceTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{impact.coherenceBody}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">{impact.maintainabilityTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{impact.maintainabilityBody}</p>
              </div>
            </div>
          </Section>

          <Section kicker="Domains and sectors" title={sectors.title}>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full border-collapse text-left">
                <thead className="bg-white/[0.04]">
                  <tr>
                    <th className="px-4 py-3 text-xs font-mono uppercase tracking-[0.18em] text-slate-400">Domain</th>
                    <th className="px-4 py-3 text-xs font-mono uppercase tracking-[0.18em] text-slate-400">Repository</th>
                    <th className="px-4 py-3 text-xs font-mono uppercase tracking-[0.18em] text-slate-400">Sector</th>
                    <th className="px-4 py-3 text-xs font-mono uppercase tracking-[0.18em] text-slate-400">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {domains.map((item) => (
                    <tr key={item.domain} className="border-t border-white/10 bg-black/20 align-top">
                      <td className="px-4 py-4 font-semibold text-white">{item.domain}</td>
                      <td className="px-4 py-4 text-sm text-slate-300">{item.repo}</td>
                      <td className="px-4 py-4 text-sm text-slate-300">{item.sector}</td>
                      <td className="px-4 py-4 text-sm leading-6 text-slate-300">{item.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">Sector coverage</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{sectors.coverage}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">Operating model</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{sectors.operatingModel}</p>
              </div>
            </div>
          </Section>

          <Section kicker="Projects completed" title={projectsSection.title}>
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <div key={project.name} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{project.impact}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{project.method}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section kicker="SWOT" title={swot.title}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {swot.items.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <h3 className={`text-lg font-semibold ${item.tone}`}>{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">{swot.conclusionTitle}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{swot.conclusionBody}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">{swot.mitigationTitle}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{swot.mitigationBody}</p>
              </div>
            </div>
          </Section>

          <Section kicker="Sources" title={sources.title}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">Primary sources</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                  {sources.primary.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">Implementation sources</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                  {sources.implementation.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}
