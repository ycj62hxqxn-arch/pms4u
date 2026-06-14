import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PMS4U Marketing Research",
  description:
    "Marketing research workspace for PMS4U runtime authority infrastructure, enterprise buyer discovery, category validation, and pilot evidence.",
};

const buyingTriggers = [
  {
    trigger: "AI moves from recommendation to action",
    signal: "Agents or automations can trigger API calls, approvals, notifications, or state changes.",
    researchQuestion: "Where does the buyer currently stop an AI or workflow before mutation?",
  },
  {
    trigger: "Audit reconstruction is slow",
    signal: "Teams need days to prove who approved what, when, and under which policy.",
    researchQuestion: "How long does it take to reconstruct one high-consequence event today?",
  },
  {
    trigger: "Approval bypass creates material risk",
    signal: "Broad role access allows actions that should require transition-specific authority.",
    researchQuestion: "Which transitions should never execute on broad access alone?",
  },
  {
    trigger: "Partners require evidence before handoff",
    signal: "External portals, regulators, auditors, or customers require proof before accepting a result.",
    researchQuestion: "What evidence must exist before a partner accepts the operational handoff?",
  },
] as const;

const buyerSegments = [
  ["Risk and compliance", "Owns operational exposure", "Blocked unauthorized execution, faster audit proof"],
  ["Operations leadership", "Owns workflow throughput", "Controlled execution without slowing every step"],
  ["CTO / platform team", "Owns integration and runtime architecture", "Authority boundary before mutation"],
  ["AI transformation lead", "Owns agent deployment risk", "Safe path from AI suggestion to governed action"],
] as const;

const alternatives = [
  ["Workflow / BPM", "Routes tasks and approvals", "Often governs process flow, not runtime authority at mutation time"],
  ["IAM / RBAC", "Grants access to systems", "Permission is broad; PMS4U checks transition-specific authority"],
  ["GRC / audit tools", "Documents policy and evidence", "Usually retrospective; PMS4U blocks before consequence"],
  ["Observability", "Shows what happened", "Observes after execution; PMS4U creates proof before mutation"],
] as const;

const interviewPrompts = [
  "Describe the last operational action that should not have executed.",
  "What did it cost to investigate, reverse, explain, or remediate?",
  "Which workflow states require named authority rather than broad system access?",
  "What evidence must be attached before customer notification, export, release, or handoff?",
  "Where would a 90-day pilot create measurable prevention proof?",
] as const;

const evidenceBacklog = [
  ["Cost evidence", "Collect three examples of unauthorized execution exposure by domain"],
  ["Pilot economics", "Define one workflow where one prevented event justifies the pilot"],
  ["Moat proof", "Show transition-specific authority and evidence lineage across two domains"],
  ["Buyer language", "Test Authority Before Consequence against risk, ops, and platform buyers"],
  ["Integration proof", "Document API boundary, event receipt, replay, and evidence export path"],
] as const;

export default function MarketingResearchPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <nav className="border-b border-white/10 px-5 py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-sm font-semibold tracking-[0.28em] text-white">
            PMS4U
          </Link>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <Link href="/bpbsolutionsltd" className="transition hover:text-white">
              BPB Site
            </Link>
            <Link href="/investor-technical-report" className="transition hover:text-white">
              Investor Report
            </Link>
            <Link href="/yai" className="transition hover:text-white">
              YAI
            </Link>
            <Link href="/console" className="font-medium text-emerald-300 transition hover:text-emerald-100">
              Console
            </Link>
          </div>
        </div>
      </nav>

      <section className="border-b border-white/10 px-5 py-14 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <div className="inline-flex border border-emerald-300/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
              Marketing research workspace
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
              Validate the buyer pain behind runtime authority.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-gray-300">
              PMS4U is not researching demand for another workflow dashboard. The research target is
              the cost, urgency, and buyer ownership of unauthorized execution before operational
              consequence becomes real.
            </p>
          </div>

          <figure className="border border-white/10 bg-black p-4">
            <Image
              src="/assets/frameworks/drift.png"
              alt="Reality Drift Boundary diagram for PMS4U market research"
              width={1536}
              height={1024}
              className="h-auto w-full border border-white/10"
              priority
            />
            <figcaption className="border-t border-white/10 px-2 pt-4 text-sm leading-6 text-gray-400">
              Research focus: where authority fails after design and before consequence.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="px-5 py-14">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {[
            ["Core thesis", "Enterprises will need authority checks at runtime as AI and automation move from suggestion to execution."],
            ["Primary wedge", "One governed workflow where unauthorized mutation has clear cost, evidence burden, and named owner."],
            ["Research output", "A pilot-ready buyer narrative with quantified pain, proof metrics, and expansion path."],
          ].map(([title, body]) => (
            <div key={title} className="border border-white/10 bg-white/[0.02] p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">{title}</h2>
              <p className="mt-4 text-sm leading-7 text-gray-300">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              Buying triggers
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
              Find the moment when prevention becomes budget.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {buyingTriggers.map((item) => (
              <div key={item.trigger} className="border border-white/10 bg-black p-5">
                <h3 className="text-lg font-semibold text-white">{item.trigger}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">{item.signal}</p>
                <p className="mt-4 border-l border-emerald-300/40 pl-4 text-sm leading-6 text-emerald-100">
                  {item.researchQuestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              Buyer map
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
              Same authority model. Different economic owner.
            </h2>
            <p className="mt-5 text-sm leading-7 text-gray-400">
              Research should separate who feels the risk, who owns the workflow, who controls the
              architecture, and who funds the pilot.
            </p>
          </div>

          <div className="overflow-x-auto border border-white/10">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-gray-500">
                <tr>
                  <th className="border-b border-white/10 px-4 py-3">Segment</th>
                  <th className="border-b border-white/10 px-4 py-3">Why they care</th>
                  <th className="border-b border-white/10 px-4 py-3">Proof to show</th>
                </tr>
              </thead>
              <tbody>
                {buyerSegments.map(([segment, care, proof]) => (
                  <tr key={segment}>
                    <td className="border-b border-white/10 px-4 py-4 font-semibold text-white">{segment}</td>
                    <td className="border-b border-white/10 px-4 py-4 text-gray-400">{care}</td>
                    <td className="border-b border-white/10 px-4 py-4 text-gray-300">{proof}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black px-5 py-14">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              Competitive alternatives
            </div>
            <div className="mt-6 space-y-3">
              {alternatives.map(([category, focus, gap]) => (
                <div key={category} className="border border-white/10 bg-white/[0.02] p-4">
                  <div className="text-sm font-semibold text-white">{category}</div>
                  <div className="mt-2 text-sm text-gray-500">{focus}</div>
                  <div className="mt-3 text-sm leading-6 text-gray-300">{gap}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              Discovery prompts
            </div>
            <ol className="mt-6 space-y-3">
              {interviewPrompts.map((prompt, index) => (
                <li key={prompt} className="grid grid-cols-[44px_1fr] border border-white/10 bg-white/[0.02]">
                  <span className="border-r border-white/10 px-4 py-4 font-mono text-sm text-emerald-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="px-4 py-4 text-sm leading-6 text-gray-200">{prompt}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              Evidence backlog
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
              Turn research into pilot proof.
            </h2>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-2">
            {evidenceBacklog.map(([item, body]) => (
              <div key={item} className="border border-white/10 bg-white/[0.02] p-5">
                <h3 className="text-base font-semibold text-white">{item}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 border border-emerald-300/30 bg-emerald-950/20 p-6">
            <p className="max-w-4xl text-lg font-semibold leading-8 text-emerald-50">
              Research target: prove that one prevented high-consequence event can justify the
              first PMS4U pilot.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
