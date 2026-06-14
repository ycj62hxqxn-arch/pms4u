import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const bookingMessage =
  "I want to book a PMS4U Authority Audit Sprint. Company: . Workflow at risk: . Estimated cost of one wrong execution: .";
const bookingHref = `https://wa.me/491723256044?text=${encodeURIComponent(bookingMessage)}`;

export const metadata: Metadata = {
  title: "PMS4U Authority Audit Sprint",
  description:
    "A paid 7-10 day enterprise audit sprint that identifies one high-risk unauthorized execution path and turns it into a PMS4U pilot scope.",
};

const deliverables = [
  "Map one high-consequence workflow",
  "Identify where unauthorized execution can happen",
  "Define required authority and evidence",
  "Produce a replayable risk report",
  "Recommend a 90-day pilot scope",
] as const;

const riskExamples = [
  ["Wrong payment release", "Finance approval, vendor payout, refund release", "EUR 5k - EUR 500k exposure"],
  ["Unauthorized shipment or export", "Partner portal, customer handoff, customs evidence", "EUR 10k - EUR 1M+ exposure"],
  ["Customer data deletion or export", "CRM, support system, data room, evidence bundle", "Recovery, liability, and compliance exposure"],
] as const;

const sprintSteps = [
  ["01", "Choose one risky workflow", "Pick the operational action where a wrong execution would be expensive or hard to reverse."],
  ["02", "Trace authority and evidence", "Map who can act, which state changes are allowed, what proof must exist, and where bypass can occur."],
  ["03", "Define the pilot boundary", "Convert the risk into a 90-day PMS4U pilot with measurable prevention proof."],
] as const;

const qualificationFields = [
  "Company",
  "Workflow at risk",
  "Estimated cost of one wrong execution",
  "Who owns the workflow",
  "Preferred contact",
] as const;

export default function AuthorityAuditSprintPage() {
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
              Paid enterprise sprint
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
              Find the execution risk that can pay for the pilot.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-gray-300">
              PMS4U runs a 7-10 day Authority Audit Sprint to identify one high-risk workflow where
              unauthorized execution could create financial, operational, or compliance damage.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={bookingHref}
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-100"
              >
                Book paid audit sprint
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white"
              >
                View pricing
              </a>
            </div>
          </div>

          <figure className="border border-white/10 bg-black p-4">
            <Image
              src="/assets/frameworks/drift.png"
              alt="Reality Drift Boundary diagram for PMS4U authority audit sprint"
              width={1536}
              height={1024}
              className="h-auto w-full border border-white/10"
              priority
            />
            <figcaption className="border-t border-white/10 px-2 pt-4 text-sm leading-6 text-gray-400">
              Audit target: the boundary where a valid-looking request becomes a real consequence.
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="pricing" className="px-5 py-14">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          <div className="border border-emerald-300/30 bg-emerald-950/20 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
              First paid offer
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal">Authority Audit Sprint</h2>
            <div className="mt-5 text-4xl font-semibold text-white">EUR 2,500 - EUR 7,500</div>
            <p className="mt-4 text-sm leading-7 text-gray-300">
              Fixed-fee audit, 7-10 days, focused on one consequential workflow and one pilot-ready
              prevention case.
            </p>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Upsell path
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal">90-Day Runtime Authority Pilot</h2>
            <div className="mt-5 text-4xl font-semibold text-white">EUR 15,000 - EUR 50,000</div>
            <p className="mt-4 text-sm leading-7 text-gray-400">
              Implement the authority boundary, evidence capture, trace replay, and operator handoff
              for the selected workflow.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] px-5 py-14">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              What the buyer gets
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
              A report that turns risk into a paid pilot.
            </h2>
            <p className="mt-5 text-sm leading-7 text-gray-400">
              The sprint is designed for risk, operations, compliance, and platform teams that need
              proof before buying a full platform rollout.
            </p>
          </div>
          <div className="grid gap-3">
            {deliverables.map((item) => (
              <div key={item} className="border border-white/10 bg-black px-5 py-4 text-sm text-gray-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              Where money is lost
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
              Start with a consequence the buyer already understands.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {riskExamples.map(([title, context, cost]) => (
              <div key={title} className="border border-white/10 bg-white/[0.02] p-5">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">{context}</p>
                <p className="mt-4 border-l border-emerald-300/40 pl-4 text-sm font-semibold leading-6 text-emerald-100">
                  {cost}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black px-5 py-14">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {sprintSteps.map(([number, title, body]) => (
            <div key={number} className="border border-white/10 bg-white/[0.02] p-5">
              <div className="font-mono text-sm text-emerald-300">{number}</div>
              <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-14">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              Qualification
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
              Send the minimum data needed to price the sprint.
            </h2>
            <p className="mt-5 text-sm leading-7 text-gray-400">
              The first conversation should identify one workflow, one accountable owner, and the
              likely cost of one wrong execution.
            </p>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-5">
            <div className="text-sm font-semibold text-white">Send this in WhatsApp</div>
            <div className="mt-5 space-y-3">
              {qualificationFields.map((field) => (
                <div key={field} className="border border-white/10 bg-black px-4 py-3 text-sm text-gray-300">
                  {field}
                </div>
              ))}
            </div>
            <a
              href={bookingHref}
              className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-100"
            >
              Start WhatsApp booking
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-14">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold tracking-normal sm:text-5xl">
            One prevented high-consequence event can justify the pilot.
          </h2>
          <p className="mt-5 text-base leading-7 text-gray-400">
            PMS4U sells authority before consequence: proof that an action should execute before it
            mutates money, data, shipment, customer state, or partner evidence.
          </p>
          <a
            href={bookingHref}
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-100"
          >
            Book paid audit sprint
          </a>
        </div>
      </section>
    </main>
  );
}
