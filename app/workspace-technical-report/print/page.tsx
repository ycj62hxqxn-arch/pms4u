import Link from "next/link";
import reportData from "../report-data.mjs";

export const metadata = reportData.metadata;

const { header, quickFacts, milestones, how, why, changes, impact, domains, sectors, projects, swot } =
  reportData;

export default function WorkspaceTechnicalReportPrintPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black print:bg-white">
      <style>{`
        @media print {
          a[href]::after { content: ""; }
          .no-print { display: none !important; }
          body { background: #fff; }
        }
      `}</style>

      <div className="mx-auto max-w-4xl">
        <div className="no-print mb-6 flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm">
          <div>
            Print-friendly export view.
            <span className="ml-2 text-gray-500">Use browser print or save as PDF.</span>
          </div>
          <div className="flex gap-3">
            <Link href="/workspace-technical-report" className="text-blue-700 underline">
              Native report
            </Link>
            <Link href="/" className="text-blue-700 underline">
              Home
            </Link>
          </div>
        </div>

        <header className="border-b-2 border-black pb-6">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">PMS4U / CEI</div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">{header.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-700">{header.lead}</p>
        </header>

        <section className="mt-8">
          <h2 className="text-xl font-bold">Quick Facts</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {quickFacts.map((item) => (
              <div key={item.label} className="rounded border border-gray-200 p-4">
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500">{item.label}</div>
                <div className="mt-1 font-semibold">{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">{header.title}</h2>
          {reportData.summary.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-sm leading-7 text-gray-700">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">{why.title}</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div className="rounded border border-gray-200 p-4">
              <div className="font-semibold">{why.problemTitle}</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{why.problemBody}</p>
            </div>
            <div className="rounded border border-gray-200 p-4">
              <div className="font-semibold">{why.rationaleTitle}</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{why.rationaleBody}</p>
            </div>
            <div className="rounded border border-gray-200 p-4">
              <div className="font-semibold">{why.categoryTitle}</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{why.categoryBody}</p>
            </div>
            <div className="rounded border border-gray-200 p-4">
              <div className="font-semibold">{why.businessTitle}</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{why.businessBody}</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">{how.title}</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div className="rounded border border-gray-200 p-4">
              <div className="font-semibold">{how.implementationTitle}</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{how.implementationBody}</p>
            </div>
            <div className="rounded border border-gray-200 p-4">
              <div className="font-semibold">{how.deliveryTitle}</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{how.deliveryBody}</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">Milestones</h2>
          <div className="mt-3 space-y-3">
            {milestones.map((item) => (
              <div key={item.date} className="rounded border border-gray-200 p-4">
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500">{item.date}</div>
                <div className="mt-1 font-semibold">{item.title}</div>
                <p className="mt-2 text-sm leading-7 text-gray-700">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">{changes.title}</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div className="rounded border border-gray-200 p-4">
              <div className="font-semibold">{changes.documentationTitle}</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{changes.documentationBody}</p>
            </div>
            <div className="rounded border border-gray-200 p-4">
              <div className="font-semibold">{changes.assetsTitle}</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{changes.assetsBody}</p>
            </div>
            <div className="rounded border border-gray-200 p-4">
              <div className="font-semibold">{changes.routesTitle}</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{changes.routesBody}</p>
            </div>
            <div className="rounded border border-gray-200 p-4">
              <div className="font-semibold">{changes.hygieneTitle}</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{changes.hygieneBody}</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">{impact.title}</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div className="rounded border border-gray-200 p-4">
              <div className="font-semibold">{impact.securityTitle}</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{impact.securityBody}</p>
            </div>
            <div className="rounded border border-gray-200 p-4">
              <div className="font-semibold">{impact.trustTitle}</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{impact.trustBody}</p>
            </div>
            <div className="rounded border border-gray-200 p-4">
              <div className="font-semibold">{impact.coherenceTitle}</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{impact.coherenceBody}</p>
            </div>
            <div className="rounded border border-gray-200 p-4">
              <div className="font-semibold">{impact.maintainabilityTitle}</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{impact.maintainabilityBody}</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">{sectors.title}</h2>
          <p className="mt-3 text-sm leading-7 text-gray-700">{sectors.coverage}</p>
          <p className="mt-3 text-sm leading-7 text-gray-700">{sectors.operatingModel}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">Domains and Sectors</h2>
          <div className="mt-3 overflow-hidden rounded border border-gray-200">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b border-gray-200 px-4 py-3">Domain</th>
                  <th className="border-b border-gray-200 px-4 py-3">Sector</th>
                </tr>
              </thead>
              <tbody>
                {domains.map((item) => (
                  <tr key={item.domain}>
                    <td className="border-b border-gray-200 px-4 py-3 font-medium">{item.domain}</td>
                    <td className="border-b border-gray-200 px-4 py-3 text-gray-700">{item.sector}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">{reportData.projectsSection.title}</h2>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-gray-700">
            {projects.map((project) => (
              <li key={project.name}>
                <strong>{project.name}:</strong> {project.impact} {project.method}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">{swot.title}</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {swot.items.map((item) => (
              <div key={item.title} className="rounded border border-gray-200 p-4">
                <div className="font-semibold">{item.title}</div>
                <p className="mt-2 text-sm leading-7 text-gray-700">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded border border-gray-200 p-4">
              <div className="font-semibold">{swot.conclusionTitle}</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{swot.conclusionBody}</p>
            </div>
            <div className="rounded border border-gray-200 p-4">
              <div className="font-semibold">{swot.mitigationTitle}</div>
              <p className="mt-2 text-sm leading-7 text-gray-700">{swot.mitigationBody}</p>
            </div>
          </div>
        </section>

        <footer className="mt-10 border-t border-gray-200 pt-4 text-xs text-gray-500">
          Source: PMS4U workspace technical report. Use the native route for the interactive version.
        </footer>
      </div>
    </main>
  );
}
