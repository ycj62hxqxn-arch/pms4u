import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, BookOpen, FileText, Network, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Specification 1.0 — Constitutional Runtime Governance",
  description:
    "PMS4U Specification 1.0 defining the constitutional model, runtime authority, admissibility, evidence, execution gate, consequence, and conformance.",
};

const facts = [
  ["Identifier", "SPEC-001"],
  ["Title", "Specification 1.0 — Constitutional Runtime Governance"],
  ["Series", "PMS4U Core Specification"],
  ["Status", "Published draft"],
  ["Version", "1.0"],
  ["Canonical route", "/research/specification-1-0"],
];

const glossary = [
  [
    "Constitutional Model",
    "The independent governing model that defines authority conditions, permissible transitions, evidence obligations, and consequence ownership before runtime execution is considered.",
  ],
  [
    "Runtime Authority",
    "The live verification layer that checks whether a specific actor, system, or delegated process may request a consequence-bearing transition now.",
  ],
  [
    "Admissibility",
    "The execution-time determination that authority, constraints, policy state, and evidentiary sufficiency survive immediately before mutation.",
  ],
  [
    "Evidence",
    "The runtime material used to justify, bind, and later replay a decision: state snapshots, authority context, receipts, signatures, hashes, and verification context.",
  ],
  [
    "Execution Gate",
    "The final boundary that blocks, releases, defers, interrupts, or observes consequence-bearing mutation.",
  ],
  [
    "Consequence",
    "The real-world or system-level effect created when a governed transition is committed.",
  ],
  [
    "Conformance",
    "The degree to which runtime behavior, evidence continuity, and implementation outputs remain consistent with the constitutional model and specification.",
  ],
];

const sections = [
  {
    label: "01",
    title: "Purpose",
    body: [
      "This specification defines PMS4U as constitutional runtime governance infrastructure. Its purpose is to establish how authority, admissibility, evidence, execution, and consequence relate at the execution boundary.",
      "The specification is intended to be the primary reference. Technical notes then expand specific parts of the model without replacing the normative structure described here.",
    ],
  },
  {
    label: "02",
    title: "Normative Thesis",
    body: [
      "Evidence is not merely a post-gate audit residue. Evidence participates in admissibility itself. A decision cannot be legitimate unless the runtime can inspect sufficient evidence to justify why the requested transition may occur now.",
      "For that reason, admissibility should be understood as a live evaluation informed by both policy state and evidence. Evidence continues after execution, but it also exists before and during the decision as part of what makes the decision constitutionally defensible.",
    ],
  },
  {
    label: "03",
    title: "Constitutional Model",
    body: [
      "The constitutional model defines authority sources, delegation rules, constraint boundaries, evidence obligations, escalation paths, and consequence ownership outside the runtime verifier itself.",
      "It must remain inspectable independently from the operational runtime so that the verifier does not become the sole author, interpreter, and enforcer of its own legitimacy.",
    ],
  },
  {
    label: "04",
    title: "Runtime Authority",
    body: [
      "Runtime authority is the live check executed immediately before consequence-bearing mutation. It tests whether the requesting actor, system, or delegated process still holds valid authority in the current context.",
      "Runtime authority is not equivalent to access control. Permission may grant system reachability; runtime authority determines whether a specific consequential transition is legitimate now.",
    ],
  },
  {
    label: "05",
    title: "Admissibility",
    body: [
      "Admissibility is the execution-time evaluation that integrates constitutional constraints, runtime authority, current policy state, consequence classification, and evidence sufficiency.",
      "A request may be technically executable and still inadmissible if delegated legitimacy has drifted, evidence is incomplete, consequence ownership is unclear, or policy state no longer supports the transition.",
    ],
  },
  {
    label: "06",
    title: "Evidence",
    body: [
      "Evidence has two roles. First, it feeds the decision: identity context, state proofs, signatures, prior receipts, and verifiable runtime inputs support admissibility evaluation. Second, it preserves continuity after the decision: receipt, hash lineage, replay context, and verification artifacts remain available for audit and reconstruction.",
      "Therefore the model must treat evidence as both a decision input and a continuity output, not only as a post-execution log.",
    ],
  },
  {
    label: "07",
    title: "Execution and Consequence",
    body: [
      "Execution occurs only through the execution gate after admissibility resolves. The gate is the final mechanism that turns a validated request into actual mutation, release, dispatch, commit, or other consequence-bearing effect.",
      "Consequence is where governance becomes real. The system must be able to show why the outcome was allowed, who owned the authority, what evidence existed, and what state survived at the moment of release.",
    ],
  },
  {
    label: "08",
    title: "Conformance",
    body: [
      "Conformance requires that implementations preserve the independence of the constitutional model, runtime revalidation before mutation, evidence continuity, and replayable verification paths.",
      "A system that stores logs after execution but cannot prove admissibility before execution does not conform to this specification.",
    ],
  },
];

const modelLayers = [
  ["Constitutional Model", "Defines authority sources, boundaries, delegation, evidence duties, and consequence ownership."],
  ["Runtime Authority", "Checks whether the live actor or system still holds valid authority for this specific transition."],
  ["Admissibility Evaluation", "Integrates authority, policy state, consequence class, and evidence sufficiency before mutation."],
  ["Evidence + Policy State", "Evidence and policy state jointly inform whether execution remains constitutionally defensible now."],
  ["Execution Gate", "Blocks or releases mutation only after admissibility resolves."],
  ["Consequence", "Commits the governed real-world or system effect."],
  ["Evidence Continuity", "Preserves replayable receipts, hashes, signatures, and decision context after the consequence."],
];

const sequence = [
  ["TN-001", "Verifier Integrity", "Why the runtime verifier cannot self-legitimate."],
  ["TN-002", "Runtime Authority", "Why authority is not reducible to static permission."],
  ["TN-003", "Admissibility", "How execution-time legitimacy is evaluated."],
  ["TN-004", "Evidence Continuity", "How evidence spans both decision support and post-decision replay."],
  ["TN-005", "Execution Gate", "How consequence is released only after admissibility survives."],
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

export default function SpecificationOnePage() {
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
            <Link href="/research/technical-notes/tn-001" className="text-blue-700 underline">
              TN-001
            </Link>
            <Link href="/ops/research-assets" className="text-blue-700 underline">
              Asset inventory
            </Link>
          </div>
        </nav>

        <header className="border-b-4 border-slate-950 pb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
            <span className="inline-flex items-center gap-2">
              <BookOpen size={15} />
              PMS4U Core Specification
            </span>
            <span>SPEC-001</span>
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            Specification 1.0 — Constitutional Runtime Governance
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            The foundational specification for constitutional model, runtime authority,
            admissibility, evidence, execution gate, consequence, and conformance.
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

        <Section label="Core Thesis" title="Evidence participates in admissibility.">
          <div className="border-l-4 border-slate-950 bg-slate-50 p-5">
            <p className="text-xl leading-8 text-slate-900">
              Evidence is not only the trace left after a runtime decision. It is part of what
              allows a runtime decision to be constitutionally justified before consequence occurs.
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

        <Section label="Glossary" title="Core terms">
          <div className="grid gap-3">
            {glossary.map(([term, body]) => (
              <div key={term} className="grid gap-3 border border-slate-200 p-4 sm:grid-cols-[220px_1fr]">
                <h3 className="font-semibold text-slate-950">{term}</h3>
                <p className="text-sm leading-6 text-slate-700">{body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Reference Model" title="Conceptual flow">
          <div className="grid gap-3">
            {modelLayers.map(([title, body], index) => (
              <div key={title} className="grid gap-4 border border-slate-200 p-4 sm:grid-cols-[90px_220px_1fr] sm:items-center">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="font-semibold text-slate-950">{title}</h3>
                <p className="text-sm leading-6 text-slate-700">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-800">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              <Network size={14} />
              Canonical sequence
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[13px] leading-6 text-slate-800">{`Constitutional Model
        ↓
Runtime Authority
        ↓
Admissibility Evaluation
   ↙            ↘
Evidence      Policy State
        ↓
Execution Gate
        ↓
Consequence
        ↓
Evidence Continuity`}</pre>
          </div>
        </Section>

        <Section label="Corpus Structure" title="How technical notes extend the specification">
          <div className="grid gap-3">
            {sequence.map(([id, title, body]) => (
              <div key={id} className="grid gap-3 border border-slate-200 p-4 sm:grid-cols-[100px_220px_1fr]">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{id}</div>
                <h3 className="font-semibold text-slate-950">{title}</h3>
                <p className="text-sm leading-6 text-slate-700">{body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Publication Use" title="Why this specification matters now">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-slate-200 p-5">
              <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                <ShieldCheck size={16} />
                Research function
              </div>
              <p className="text-sm leading-6 text-slate-700">
                This document gives specialists one stable reference for discussing data model,
                runtime authority, admissibility, safety integration, evidence continuity, and
                execution control without depending on isolated posts.
              </p>
            </div>
            <div className="border border-slate-200 p-5">
              <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                <FileText size={16} />
                Citation rule
              </div>
              <p className="text-sm leading-6 text-slate-700">
                Treat this specification as the normative base. Treat numbered technical notes as
                focused expansions that sharpen one architectural problem at a time.
              </p>
            </div>
          </div>
        </Section>
      </article>
    </main>
  );
}