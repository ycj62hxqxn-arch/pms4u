import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, ExternalLink, ShieldCheck, Target, Workflow } from "lucide-react";
import BackNavButton from "../components/BackNavButton";

export const metadata: Metadata = {
  title: "Services | PMS4U",
  description:
    "Buyable BPB Solutions LTD services for authority-first AI and process governance, including governance assessments, pilots, workshops, and trade assessments.",
};

const engagements = [
  {
    name: "AI Governance Assessment",
    audience: "Best suited for organizations evaluating or expanding AI use across business operations.",
    duration: "2-week engagement",
    summary:
      "We assess your AI systems, approval processes, execution risks, and governance maturity so leadership can see where authority and control are weak or missing.",
    price: "Starting from €2,500",
    deliverables: ["Executive report", "Risk register", "Governance gap analysis", "Implementation roadmap"],
  },
  {
    name: "Runtime Governance Pilot",
    audience: "Designed for organizations ready to test governance controls in one production workflow.",
    duration: "30 days",
    summary:
      "We implement governance checkpoints within one selected workflow, introducing authority verification, human approval where appropriate, and traceable decision records so your team can evaluate the operational impact before wider adoption.",
    price: "Starting from €10,000",
    examples: ["AI agent approval", "Document approval", "Trade workflow", "Financial approval"],
    deliverables: ["Working pilot", "Evidence trail", "Operational metrics", "Final report"],
    featured: true,
  },
  {
    name: "Enterprise AI Strategy Workshop",
    audience: "For executives planning AI adoption and a governance model before scaling further.",
    duration: "1 day",
    summary:
      "For executive teams planning AI adoption and needing a clear governance and execution model before scaling further.",
    price: "Starting from €3,000",
    topics: ["Governance", "Compliance", "AI risk", "Architecture", "Roadmap"],
  },
  {
    name: "GTCS4U Trade Assessment",
    audience: "Best for import/export organizations that want a structured review before automation or scale-up.",
    duration: "Focused assessment",
    summary:
      "For import/export businesses that want a structured review of trade, document, approval, and compliance workflows before automation or scale-up.",
    price: "Starting from €4,500",
    deliverables: ["Trade process review", "Compliance review", "Automation opportunities", "Improvement roadmap"],
  },
] as const;

const outcomes = [
  "Prevent unauthorized execution before business consequences occur.",
  "Ensure only authorized people or systems can approve high-impact actions.",
  "Make critical decisions traceable and independently verifiable.",
  "Introduce human approval where execution should not be automatic.",
] as const;

const processSteps = ["Current workflow", "Governance assessment", "Pilot implementation", "Executive review"] as const;

const whyBpB = [
  "We combine governance research with practical implementation.",
  "Our work includes public specifications, reference architectures, and deployed software prototypes.",
  "We apply authority-first execution principles to your operational context without overstating claims or implying client deployments where none exist.",
] as const;

const industries = ["Manufacturing", "Healthcare", "Financial Services", "Trade", "Government", "Enterprise Operations"] as const;

const credibilityStrip = ["Public Research", "Specifications", "Reference Architecture", "Working Prototype", "Governance Workshops"] as const;

const bookingFlow = ["Discovery", "Current workflow review", "Authority mapping", "Findings workshop", "Executive report"] as const;

const customerScenario = {
  title: "Example: AI assistant approving supplier invoices",
  intro:
    "An organization wants an AI assistant to approve supplier invoices. Before deployment, we examine authority, evidence, review points, and the audit trail.",
  bullets: [
    "Approval authority",
    "Evidence requirements",
    "Human review points",
    "Audit trail",
  ],
  outcome:
    "The outcome is a documented governance assessment, not an automated approval system.",
};

const technicalCapability = [
  {
    title: "Authority-first execution controls",
    body: "Resolve authority, admissibility, and approval state before a workflow, API, or AI-assisted action can proceed.",
  },
  {
    title: "Evidence and traceability",
    body: "Every critical business decision can produce signed evidence, trace continuity, and replayable records for audit and review.",
  },
  {
    title: "Policy and approval architecture",
    body: "Model roles, approval thresholds, signer requirements, and escalation paths for consequence-bearing operations.",
  },
  {
    title: "Governed AI workflow surfaces",
    body: "Deploy controlled planning tools and operator-facing flows with explicit review, fallback handling, and bounded execution behavior.",
  },
] as const;

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <BackNavButton fallbackHref="/" />

      <nav className="border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <Link href="/services" className="text-sm font-semibold tracking-[0.3em] text-white">
            SERVICES
          </Link>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
            <a href="#engagements" className="hover:text-white">
              Engagements
            </a>
            <a href="#outcomes" className="hover:text-white">
              Outcomes
            </a>
            <a href="#capability" className="hover:text-white">
              Capability
            </a>
            <Link href="/bpbsolutionsltd" className="hover:text-white">
              BPB Solutions LTD
            </Link>
          </div>
        </div>
      </nav>

      <section className="border-b border-white/10 px-5 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
              <ShieldCheck size={15} />
              Authority-First AI & Process Governance
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] sm:text-6xl">
              AI adoption is accelerating, but many organizations still rely on governance processes that stop before execution.
              <span className="block pt-3">
                We help organizations introduce authority-first governance into AI-assisted and critical business workflows through structured assessments, implementation pilots, and executive workshops.
              </span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Many organizations have governance policies, but fewer have mechanisms that verify authority before high-impact actions occur. Our engagements make the next step concrete.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/authority-audit-sprint"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-100"
              >
                Book a Governance Assessment
              </Link>
              <a
                href="mailto:info@bpbsolutionsltd.com?subject=Discovery%20Call"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white"
              >
                Book a Discovery Call
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                <Target size={15} />
                What a buyer gets
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
                <li>• A named engagement with scope and duration</li>
                <li>• Clear deliverables leadership can review</li>
                <li>• A defined next step for one workflow or domain</li>
                <li>• Governance-safe implementation language without abstract overhead</li>
              </ul>
            </div>
            <div className="border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                <Workflow size={15} />
                Simple process
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-200">
                {processSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/10 text-xs font-semibold text-emerald-200">
                      {index + 1}
                    </div>
                    <div>{step}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-white/10 bg-black/30 p-5 text-sm leading-7 text-slate-300">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Commercial note</div>
              Indicative starting prices are shown to give buyers an order of magnitude. Final scope depends on the workflow, domain, and required governance depth.
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {credibilityStrip.map((item) => (
              <div key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Why BPB Solutions?</div>
            <h2 className="mt-3 text-3xl font-semibold">Governance research plus practical implementation.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {whyBpB.map((item) => (
              <div key={item} className="border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="engagements" className="border-b border-white/10 px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Choose your engagement</div>
            <h2 className="mt-3 text-3xl font-semibold">What exactly you can buy next week.</h2>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {engagements.map((item) => (
              <article
                key={item.name}
                className={`border p-6 ${"featured" in item && item.featured ? "border-emerald-300/50 bg-emerald-300/[0.08] shadow-[0_0_0_1px_rgba(110,231,183,0.15),0_20px_60px_rgba(16,185,129,0.08)] xl:col-span-2 xl:grid xl:grid-cols-[1.15fr_0.85fr] xl:gap-8" : "border-white/10 bg-white/[0.03]"}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-semibold">{item.name}</h3>
                    <div className="mt-2 text-sm font-medium text-emerald-300">{item.duration}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {"featured" in item && item.featured ? (
                      <div className="rounded-full border border-emerald-300/30 bg-emerald-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black">
                        Most Popular
                      </div>
                    ) : null}
                    <div className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-sm font-semibold text-emerald-200">
                      {item.price}
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-300">{item.summary}</p>

                <div className="mt-4 rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-slate-200">
                  <span className="font-semibold text-emerald-300">Who it is for:</span> {item.audience}
                </div>

                {"examples" in item ? (
                  <div className="mt-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Examples</div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-200">
                      {item.examples.map((entry) => (
                        <li key={entry} className="flex items-start gap-2">
                          <CheckCircle2 size={16} className="mt-0.5 text-emerald-300" />
                          <span>{entry}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {"topics" in item ? (
                  <div className="mt-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Topics</div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-200">
                      {item.topics.map((entry) => (
                        <li key={entry} className="flex items-start gap-2">
                          <CheckCircle2 size={16} className="mt-0.5 text-emerald-300" />
                          <span>{entry}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {"deliverables" in item ? (
                  <div className="mt-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Deliverables</div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-200">
                      {item.deliverables.map((entry) => (
                        <li key={entry} className="flex items-start gap-2">
                          <CheckCircle2 size={16} className="mt-0.5 text-emerald-300" />
                          <span>{entry}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {"featured" in item && item.featured ? (
                  <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-black/25 p-5 xl:mt-0">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">What happens after booking?</div>
                    <div className="mt-4 space-y-2 text-sm text-slate-200">
                      {bookingFlow.map((step, index) => (
                        <div key={step} className="flex items-center gap-3">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/10 text-xs font-semibold text-emerald-200">
                            {index + 1}
                          </div>
                          <div>{step}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Concrete scenario</div>
              <h2 className="mt-3 text-3xl font-semibold">{customerScenario.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{customerScenario.intro}</p>
            </div>
            <div className="border border-white/10 bg-white/[0.03] p-6">
              <div className="grid gap-2 sm:grid-cols-2">
                {customerScenario.bullets.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-200">
                    <CheckCircle2 size={16} className="text-emerald-300" />
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-300">{customerScenario.outcome}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Industries</div>
            <h2 className="mt-3 text-3xl font-semibold">Teams we typically support.</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {industries.map((item) => (
              <div key={item} className="border border-white/10 bg-black/30 px-4 py-3 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="outcomes" className="border-b border-white/10 px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Outcome language</div>
            <h2 className="mt-3 text-3xl font-semibold">What changes for the buyer.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {outcomes.map((item) => (
              <div key={item} className="border border-white/10 bg-black/30 p-5 text-base leading-8 text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="capability" className="border-b border-white/10 px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Technical capability</div>
            <h2 className="mt-3 text-3xl font-semibold">How we deliver it.</h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
              Once a buyer understands the engagement, this is the capability layer underneath it: authority controls, evidence, replay, approval modeling, and governed workflow surfaces.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {technicalCapability.map((item) => (
              <article key={item.title} className="border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  <Workflow size={14} />
                  Capability
                </div>
                <h3 className="mt-3 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-5xl border border-emerald-300/25 bg-emerald-300/10 p-8 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">Next step</div>
          <h2 className="mt-3 text-3xl font-semibold">Not sure where to start?</h2>
          <p className="mt-4 text-base leading-8 text-slate-200">
            Bring one workflow. In a 30-minute discovery session, we&apos;ll assess where authority, approvals, or evidence could be strengthened and recommend the most suitable engagement.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:info@bpbsolutionsltd.com?subject=Free%2030-minute%20discovery%20call"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-100"
            >
              Book discovery call
            </a>
            <Link
              href="/bpbsolutionsltd"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white"
            >
              Contact BPB Solutions LTD
              <ExternalLink size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}