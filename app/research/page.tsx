import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  Download,
  FileText,
  Layers,
  Network,
  ScrollText,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "PMS4U Research — Runtime Governance Knowledge Layer",
  description:
    "PMS4U Research publishes the core specification, technical notes, doctrine, white papers, reference architecture, and standards for constitutional runtime governance.",
};

const coreSpecification = {
  id: "SPEC-001",
  title: "Specification 1.0 — Constitutional Runtime Governance",
  status: "Published",
  href: "/research/specification-1-0",
  summary:
    "Foundational specification defining the constitutional model, runtime authority, admissibility, evidence, execution gate, consequence, and conformance.",
};

const technicalNotes = [
  {
    id: "TN-001",
    title: "Who Verifies the Verifier?",
    theme: "Runtime Authority",
    status: "Published",
    href: "/research/technical-notes/tn-001",
    summary:
      "Why runtime authority cannot be self-legitimating, and why constitutional admissibility must exist outside the verifier.",
  },
  {
    id: "TN-002",
    title: "Authority vs Permission",
    theme: "Runtime Authority",
    status: "Queued",
    href: null,
    summary:
      "Permission grants access. Authority determines whether a specific consequence-bearing transition may occur now.",
  },
  {
    id: "TN-003",
    title: "Admissibility",
    theme: "Admissibility",
    status: "Queued",
    href: null,
    summary:
      "How authority, policy state, evidence, and consequence classification determine whether execution may proceed now.",
  },
  {
    id: "TN-004",
    title: "Evidence Continuity",
    theme: "Evidence",
    status: "Queued",
    href: null,
    summary:
      "How evidence supports admissibility before consequence and remains replayable after consequence.",
  },
  {
    id: "TN-005",
    title: "Execution Gate",
    theme: "Execution Governance",
    status: "Queued",
    href: null,
    summary:
      "How consequence is released only after admissibility survives at the final mutation boundary.",
  },
  {
    id: "TN-006",
    title: "Authority Drift",
    theme: "Runtime Risk",
    status: "Queued",
    href: null,
    summary:
      "How authority becomes stale when workflows, tools, users, vendors, or agent capabilities change faster than governance controls.",
  },
  {
    id: "TN-007",
    title: "Delegated Authority",
    theme: "Institutional Control",
    status: "Queued",
    href: null,
    summary:
      "Delegation as a bounded constitutional act, not a loose transfer of operational power.",
  },
];

const doctrine = [
  ["DG-001", "Runtime Governance Doctrine", "How execution requests move through authority, admissibility, evidence, and trace."],
  ["DG-002", "Constitutional Governance Doctrine", "The independent model that constrains the runtime verifier."],
  ["DG-003", "Consequence Governance Doctrine", "How ownership, liability, and operational consequence shape execution control."],
];

const researchTracks = [
  ["Constitutional Governance", "Independent authority model, delegated constraints, admissibility boundary, and verifier accountability."],
  ["Execution Governance", "State transitions, denial, deferral, interruption, receipts, lineage, and replayable proof."],
  ["Runtime Authority", "Authority checks that survive immediately before mutation, not only at login or workflow start."],
  ["Consequence Governance", "Who owns the consequence, who may approve it, and what evidence must exist before execution."],
];

const referenceArchitecture = [
  ["Constitutional Model", "Defines authority, constraints, roles, evidence rules, and consequence ownership outside the runtime verifier."],
  ["Runtime Authority", "Evaluates whether the actor and context may execute the requested transition at this moment."],
  ["Admissibility Evaluation", "Resolves whether execution is defensible now using authority, policy state, evidence, and consequence context."],
  ["Evidence Spine", "Feeds admissibility with verifiable proof material and then binds receipts, hashes, signatures, transitions, and trace context after the decision."],
  ["Product Layer", "GTCS4U turns the research model into console, pilot, demo, and case-study surfaces."],
];

const downloads = [
  ["TN PDFs", "Technical note PDFs exported from the canonical HTML pages."],
  ["Doctrine Packs", "Versioned doctrine documents after every 5-6 technical notes."],
  ["Architecture Diagrams", "Reference architecture diagrams for enterprise and audit discussions."],
  ["Runtime SDK", "Developer package surface for JavaScript/Python adoption patterns."],
  ["Playground Reports", "Decision snapshots (allow/deny/review/defer) for demos and workshops."],
  ["Pilot Briefs", "Commercial pilot briefs that translate research into GTCS4U implementation scope."],
];

function StatusBadge({ status }: { status: string }) {
  const live = status === "Published";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
        live
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      {status}
    </span>
  );
}

function SectionHeader({
  icon,
  label,
  title,
  body,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
          <span className="text-slate-900">{icon}</span>
          {label}
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
      </div>
      <p className="max-w-xl text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-sm font-bold tracking-[0.28em] text-slate-950">
            PMS4U RESEARCH
          </Link>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            <a href="#technical-notes" className="hover:text-slate-950">
              Technical Notes
            </a>
            <a href="#doctrine" className="hover:text-slate-950">
              Doctrine
            </a>
            <a href="#architecture" className="hover:text-slate-950">
              Architecture
            </a>
            <Link href="/playground" className="hover:text-slate-950">
              Playground
            </Link>
            <Link href="/research/runtime-sdk" className="hover:text-slate-950">
              Runtime SDK
            </Link>
            <Link href="/case-studies" className="hover:text-slate-950">
              Case Studies
            </Link>
            <Link href="/adopt" className="hover:text-slate-950">
              Adopt PMS4U
            </Link>
            <Link href="/ops" className="hover:text-slate-950">
              Ops Control Plane
            </Link>
            <Link href="/gtcs4u" className="hover:text-slate-950">
              GTCS4U Platform
            </Link>
            <Link href="/console" className="font-semibold text-emerald-700 hover:text-emerald-900">
              Console
            </Link>
          </div>
        </div>
      </nav>

      <section className="border-b border-slate-200 bg-white px-5 py-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 border border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-600">
              <BookOpen size={15} />
              Knowledge Layer
            </div>
            <h1 className="max-w-5xl text-4xl font-semibold leading-[1.04] tracking-normal text-slate-950 sm:text-6xl">
              Runtime governance research, numbered and citable.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              PMS4U Research is the canonical corpus behind the platform: technical notes,
              doctrine, white papers, reference architecture, and standards for constitutional
              runtime governance.
            </p>
          </div>

          <div className="border border-slate-200 bg-slate-50 p-5">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Identity separation
            </div>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
                <span className="font-semibold text-slate-950">PMS4U</span>
                <span className="text-right text-slate-600">pms.bpbsolutionsltd.com / research and knowledge layer</span>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
                <span className="font-semibold text-slate-950">GTCS4U</span>
                <span className="text-right text-slate-600">gtcs4u.com / platform, pilot, console, demo</span>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
                <span className="font-semibold text-slate-950">BPB</span>
                <span className="text-right text-slate-600">bpbsolutionsltd.com / corporate identity</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="font-semibold text-slate-950">Aegypten Hautnah</span>
                <span className="text-right text-slate-600">aegyptenhautnah.com / independent operating project</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {researchTracks.map(([title, body]) => (
            <article key={title} className="border border-slate-200 bg-white p-5">
              <h2 className="text-base font-semibold text-slate-950">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-2">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            icon={<Layers size={16} />}
            label="Normative Base"
            title="Core Specification"
            body="The specification is the reference document. Technical notes extend it; they do not replace it."
          />

          <Link href={coreSpecification.href} className="block">
            <article className="border border-slate-200 bg-white p-6 transition hover:border-slate-400">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{coreSpecification.id}</div>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950">{coreSpecification.title}</h3>
                </div>
                <StatusBadge status={coreSpecification.status} />
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">{coreSpecification.summary}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                Read specification
                <ArrowRight size={15} />
              </div>
            </article>
          </Link>
        </div>
      </section>

      <section id="technical-notes" className="px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            icon={<FileText size={16} />}
            label="Corpus"
            title="Technical Notes"
            body="Every LinkedIn thesis should end with a numbered technical note. The note becomes the durable citation target; the post becomes distribution."
          />

          <div className="grid gap-4 lg:grid-cols-2">
            {technicalNotes.map((note) => {
              const content = (
                <article className="h-full border border-slate-200 bg-white p-5 transition hover:border-slate-400">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{note.id}</div>
                      <h3 className="mt-2 text-xl font-semibold text-slate-950">{note.title}</h3>
                    </div>
                    <StatusBadge status={note.status} />
                  </div>
                  <p className="mt-4 text-sm font-medium text-slate-500">{note.theme}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{note.summary}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                    {note.href ? "Read technical note" : "Draft queued"}
                    {note.href ? <ArrowRight size={15} /> : null}
                  </div>
                </article>
              );

              return note.href ? (
                <Link key={note.id} href={note.href} className="block">
                  {content}
                </Link>
              ) : (
                <div key={note.id}>{content}</div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="doctrine" className="border-y border-slate-200 bg-white px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            icon={<ScrollText size={16} />}
            label="Doctrine"
            title="Doctrine Documents"
            body="After every 5-6 technical notes, PMS4U consolidates the argument into versioned doctrine documents."
          />

          <div className="grid gap-4 md:grid-cols-3">
            {doctrine.map(([id, title, body]) => (
              <article key={id} className="border border-slate-200 p-5">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{id}</div>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="architecture" className="px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            icon={<Network size={16} />}
            label="Reference Architecture"
            title="Constitutional Runtime Governance"
            body="The architecture separates the constitutional model from the runtime verifier, then binds admissible execution to evidence."
          />

          <div className="grid gap-3">
            {referenceArchitecture.map(([title, body], index) => (
              <div key={title} className="grid gap-4 border border-slate-200 bg-white p-5 md:grid-cols-[120px_240px_1fr] md:items-center">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Layer {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
                <p className="text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 px-5 py-10 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
              <ShieldCheck size={16} />
              Publication Rule
            </div>
            <h2 className="text-3xl font-semibold tracking-tight">Every public claim gets a citation target.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              LinkedIn creates attention. PMS4U Research preserves the argument. GTCS4U converts
              the argument into demos, pilots, console flows, and enterprise adoption.
            </p>
          </div>

          <div className="grid gap-3">
            {downloads.map(([title, body]) => (
              <article key={title} className="border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <Download className="mt-1 text-emerald-300" size={16} />
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border border-slate-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Product conversion path</div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Research explains the category. GTCS4U demonstrates the platform.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/research/technical-notes/tn-001"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:border-slate-950"
            >
              <FileText size={16} />
              Read TN-001
            </Link>
            <Link
              href="/gtcs4u"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Layers size={16} />
              Open GTCS4U
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
