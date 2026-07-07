import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Download, FileText, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "TN-001 — Who Verifies the Verifier?",
  description:
    "PMS4U Technical Note 001 on runtime authority, constitutional admissibility, and the need for an independent constitutional model.",
};

const facts = [
  ["Identifier", "TN-001"],
  ["Title", "Who Verifies the Verifier?"],
  ["Series", "PMS4U Technical Notes"],
  ["Track", "Runtime Authority"],
  ["Status", "Published draft"],
  ["Canonical route", "/research/technical-notes/tn-001"],
];

const sections = [
  {
    label: "01",
    title: "Abstract",
    body: [
      "Runtime authority is often treated as a technical verifier: a service, policy engine, guardrail, approval workflow, or access layer that decides whether execution may proceed. That is not enough for consequence-bearing AI systems.",
      "If runtime authority must remain continuously admissible, then admissibility cannot be a property of the runtime layer alone. The verifier cannot be the only source of its own legitimacy. A separate constitutional model must define delegated authority, governing constraints, evidence obligations, and consequence ownership before runtime verification begins.",
    ],
  },
  {
    label: "02",
    title: "Problem",
    body: [
      "Most systems answer the wrong question. They ask whether an actor has permission, whether a workflow step is available, or whether a token can call an endpoint. These checks can be correct and still fail to establish whether a specific execution is legitimate now.",
      "The execution may be technically allowed while the underlying authority has expired, drifted, been delegated incorrectly, lost evidentiary support, or become inadmissible because the consequence has changed.",
    ],
  },
  {
    label: "03",
    title: "Architectural Gap",
    body: [
      "A runtime verifier can enforce policy, but it should not be the sole author of the policy conditions that make its own decision legitimate. When the verifier defines, interprets, and enforces its own authority boundary, governance collapses into self-attestation.",
      "This becomes dangerous in AI-assisted systems because agents can draft, recommend, route, escalate, approve, or trigger workflows faster than humans can reconstruct the authority chain after the fact.",
    ],
  },
  {
    label: "04",
    title: "Constitutional Model",
    body: [
      "The constitutional model is an independent layer that defines the conditions under which execution authority can exist. It is not the runtime, not the UI, not the workflow, and not the model output. It is the governing structure that the runtime must consult before it permits consequence.",
      "It defines delegated authority, permitted transitions, constraint boundaries, evidence requirements, escalation duties, and the accountable owner of the consequence.",
    ],
  },
  {
    label: "05",
    title: "Runtime Authority",
    body: [
      "Runtime authority is the operational check performed immediately before execution. Its role is to verify that constitutional conditions still survive in the live context: actor, state, evidence, transition, authority level, and consequence.",
      "The runtime authority does not merely ask whether the request is possible. It asks whether the requested mutation is admissible at the moment it would create consequence.",
    ],
  },
  {
    label: "06",
    title: "Implications",
    body: [
      "Governance architectures become more explainable when the constitutional model and runtime verifier are separated. Auditors can inspect the governing conditions independently from the service that enforced them.",
      "Enterprise AI systems become more portable when authority is expressed as a reference architecture rather than embedded inside a single product, workflow engine, or agent implementation.",
    ],
  },
  {
    label: "07",
    title: "Open Questions",
    body: [
      "How should constitutional models be versioned when authority rules change?",
      "When should a runtime authority interrupt execution instead of denying it?",
      "What evidence is sufficient to prove that authority was valid immediately before execution?",
      "How should consequence ownership be represented across human, agent, and system actors?",
    ],
  },
];

const modelRows = [
  ["Constitutional Model", "Defines the authority conditions before the runtime decides."],
  ["Runtime Authority", "Checks whether those conditions still survive in the live execution context."],
  ["Admissibility Gate", "Returns allow, deny, defer, interrupt, or observe before mutation."],
  ["Evidence Spine", "Preserves receipt, state, authority context, and replayable trace."],
];

function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-slate-200 py-8 print:break-inside-avoid">
      <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">{label}</div>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function TechnicalNote001Page() {
  return (
    <main className="min-h-screen bg-white px-5 py-8 text-slate-950 sm:px-8 print:px-0 print:py-0">
      <style>{`
        @media print {
          a[href]::after { content: ""; }
          .no-print { display: none !important; }
          body { background: #fff; }
        }
      `}</style>

      <article className="mx-auto max-w-5xl">
        <nav className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 border border-slate-200 px-4 py-3 text-sm">
          <Link href="/research" className="inline-flex items-center gap-2 font-semibold text-slate-950">
            <ArrowLeft size={16} />
            PMS4U Research
          </Link>
          <div className="flex flex-wrap gap-4">
            <Link href="/gtcs4u" className="text-blue-700 underline">
              GTCS4U
            </Link>
            <Link href="/console" className="text-blue-700 underline">
              Console
            </Link>
            <span
              className="inline-flex cursor-default items-center gap-2 text-slate-400"
              aria-disabled="true"
              title="Use browser print to save as PDF"
            >
              <Download size={15} />
              PDF via print
            </span>
          </div>
        </nav>

        <header className="border-b-4 border-slate-950 pb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
            <span className="inline-flex items-center gap-2">
              <FileText size={15} />
              PMS4U Technical Notes
            </span>
            <span>TN-001</span>
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            Who Verifies the Verifier?
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            Runtime authority, constitutional admissibility, and the case for a governance model
            that exists independently of the verifier.
          </p>
        </header>

        <section className="grid gap-3 border-b border-slate-200 py-6 text-sm sm:grid-cols-2">
          {facts.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[140px_1fr] gap-3 border border-slate-200 px-4 py-3">
              <div className="font-semibold text-slate-500">{label}</div>
              <div className="font-medium text-slate-950">{value}</div>
            </div>
          ))}
        </section>

        <Section label="Core Thesis" title="Admissibility cannot be self-certified by the runtime.">
          <div className="border-l-4 border-slate-950 bg-slate-50 p-5">
            <p className="text-xl leading-8 text-slate-900">
              If runtime authority must itself remain continuously admissible, then the runtime
              verifier cannot be the only source of the conditions that make its decision legitimate.
            </p>
          </div>
        </Section>

        {sections.map((section) => (
          <Section key={section.label} label={section.label} title={section.title}>
            <div className="grid gap-4">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-slate-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </Section>
        ))}

        <Section label="Reference Model" title="Separation of authority layers">
          <div className="grid gap-3">
            {modelRows.map(([title, body], index) => (
              <div key={title} className="grid gap-4 border border-slate-200 p-4 sm:grid-cols-[90px_220px_1fr] sm:items-center">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="font-semibold text-slate-950">{title}</h3>
                <p className="text-sm leading-6 text-slate-700">{body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Publication Use" title="How this note should be cited">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-slate-200 p-5">
              <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                <ShieldCheck size={16} />
                LinkedIn ending
              </div>
              <p className="text-sm leading-6 text-slate-700">
                Read the Technical Note: PMS4U TN-001, “Who Verifies the Verifier?”
              </p>
            </div>
            <div className="border border-slate-200 p-5">
              <div className="mb-3 text-sm font-semibold text-slate-950">Corpus link</div>
              <p className="text-sm leading-6 text-slate-700">
                PMS4U Research / Technical Notes / TN-001. Future notes should link forward and
                backward to build a connected body of work.
              </p>
            </div>
          </div>
        </Section>
      </article>
    </main>
  );
}
