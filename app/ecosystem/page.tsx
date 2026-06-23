import Link from "next/link";

export const metadata = {
  title: "BPB Ecosystem Index | PMS4U",
  description:
    "Separated BPB ecosystem index for commercial fronts, infrastructure systems, authority layers, and proof surfaces.",
};

const sections = [
  {
    id: "commercial",
    kicker: "Commercial fronts",
    title: "Pages that sell directly.",
    body: "These surfaces stay simple: offer, price or from-price, proof, contact, and one next action.",
    cards: [
      {
        tag: "Commercial",
        name: "Aegypten Hautnah",
        purpose:
          "Governed access to Egypt: explore, live, and invest through tours, rentals, property requests, and structured WhatsApp intake.",
        status: "Live front-office cash path",
        use: "Travelers, long-stay guests, rental leads, and buyer-intent property clients.",
        actions: [
          ["Open site", "https://aegyptenhautnah.com/"],
          ["UmEldonia app", "/umeldonia"],
          ["Vercel preview", "https://vercel-site-tau-six.vercel.app/"],
        ],
      },
      {
        tag: "Commercial",
        name: "CARSHUNTER",
        purpose:
          "Verified automotive sourcing and export access for high-intent vehicle requests, dealer workflows, and controlled offer drops.",
        status: "Commercial surface candidate",
        use: "Vehicle buyers, dealers, sourcing partners, and export/logistics stakeholders.",
        actions: [["Drops proof", "/carshunter-drops"]],
      },
    ],
  },
  {
    id: "infrastructure",
    kicker: "Infrastructure layer",
    title: "Systems that operate the businesses.",
    body: "These surfaces are for technical buyers, operators, partners, and internal control.",
    cards: [
      {
        tag: "Infrastructure",
        name: "PMS4U",
        purpose:
          "Governed operating system for leads, bookings, replay, authority control, and business workflows.",
        status: "Runtime governance OS",
        use: "Execution boundary, evidence lineage, replay, authority decisions, and operational control.",
        actions: [
          ["Console", "/console"],
          ["Trace", "/trace"],
          ["Workspace report", "/workspace-technical-report"],
        ],
      },
      {
        tag: "Infrastructure",
        name: "YAI Local",
        purpose:
          "Operator guidance and governance assistant for controlled execution steps, policy checks, and local fallback.",
        status: "Assistant layer",
        use: "Governed recommendations, execution evaluation, and operator support.",
        actions: [["Open YAI", "/yai"]],
      },
      {
        tag: "Infrastructure",
        name: "UmEldonia",
        purpose:
          "Aegypten Hautnah app surface for tours, long stays, property requests, WhatsApp intake, and governed operator workflow.",
        status: "Pilot app surface",
        use: "Travel customers, long-stay guests, property leads, and local operators.",
        actions: [
          ["Open app", "/umeldonia"],
          ["Booking machine", "/aegyptenhautnah_booking_machine/booking-machine.de.html"],
        ],
      },
      {
        tag: "Infrastructure",
        name: "Booking Registry",
        purpose:
          "Structured lead and booking records for travel, property, and mixed-access requests.",
        status: "Operational module",
        use: "Lead capture, replay, request trace, and operational status.",
        actions: [["Aegypten machine", "/aegyptenhautnah_booking_machine/booking-machine.de.html"]],
      },
      {
        tag: "Application MVP",
        name: "Subscription Mobility",
        purpose:
          "Ride-hailing blueprint for cars and motorbikes where drivers pay a monthly access fee instead of per-ride commission.",
        status: "MVP blueprint",
        use: "Driver economics, rider flow, subscription controls, admin verification, and governed execution gates.",
        actions: [
          ["Open MVP", "/subscription-mobility"],
          ["Hurghada pilot", "/hurghada-mobility"],
        ],
      },
    ],
  },
  {
    id: "authority",
    kicker: "Authority layer",
    title: "Surfaces that sell trust.",
    body: "These pages explain compliance logic, execution authority, evidence lineage, and business governance.",
    cards: [
      {
        tag: "Authority",
        name: "GTCS4U",
        purpose:
          "B2B governance and compliance infrastructure for trade, AI systems, and execution authority.",
        status: "B2B authority brand",
        use: "Enterprise, trade, compliance, partner, and governance clients.",
        actions: [["Open GTCS4U", "/gtcs4u"]],
      },
      {
        tag: "Ecosystem",
        name: "BPB governance ecosystem",
        purpose:
          "Routing surface for execution infrastructure, governed systems, commercial ventures, and authority-controlled operations.",
        status: "Product ecosystem routing",
        use: "Product navigation, partner orientation, and proof-surface discovery.",
        actions: [["Open hub", "/bpbsolutionsltd"]],
      },
    ],
  },
  {
    id: "proof",
    kicker: "Proof layer",
    title: "Evidence before trust.",
    body: "Every project gets a proof card: name, purpose, status, proof, commercial use, and next action.",
    cards: [
      {
        tag: "Proof",
        name: "Runtime Console",
        purpose:
          "Shows authority, admissibility, escalation, governed refusal, and trace before consequence.",
        status: "Technical proof",
        use: "Demos, partner diligence, and technical buyer proof.",
        actions: [["Open console", "/console"]],
      },
      {
        tag: "Proof",
        name: "Workspace Technical Report",
        purpose:
          "Native technical report covering doctrine, milestones, domains, sectors, architecture, and project impact.",
        status: "Diligence proof",
        use: "Investor, partner, and internal alignment.",
        actions: [["Read report", "/workspace-technical-report"]],
      },
      {
        tag: "Proof",
        name: "Authority Audit Sprint",
        purpose:
          "Paid 7-10 day audit that identifies one high-risk unauthorized execution path and turns it into a pilot scope.",
        status: "Paid entry offer",
        use: "Monetizing PMS4U before a full platform sale.",
        actions: [["Book sprint", "/authority-audit-sprint"]],
      },
    ],
  },
] as const;

export default function EcosystemPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/85 px-5 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.32em]">
            BPB Ecosystem Index
          </Link>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="transition hover:text-white">
                {section.kicker.replace(" layer", "").replace(" fronts", "")}
              </a>
            ))}
            <Link href="/console" className="font-medium text-emerald-300 transition hover:text-emerald-100">
              Console
            </Link>
          </div>
        </div>
      </nav>

      <section className="border-b border-white/10 px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-300">
            Separated operating layers
          </p>
          <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-[1.04] tracking-normal sm:text-7xl">
            One ecosystem, four different jobs.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-gray-300">
            The BPB governance ecosystem separates sales fronts, infrastructure systems,
            authority layers, and proof surfaces. Each visitor should land on the layer that
            matches their intent.
          </p>
          <div className="mt-10 grid border border-white/10 md:grid-cols-4">
            {[
              ["Buyer", "Show offer, price, proof, and next action."],
              ["Partner", "Show business surface, scope, and trust signals."],
              ["Technical", "Show system, API, console, and status."],
              ["Compliance", "Show authority, evidence, case files, and reports."],
            ].map(([title, body]) => (
              <div key={title} className="border-b border-white/10 p-5 md:border-b-0 md:border-r md:last:border-r-0">
                <div className="font-semibold text-white">{title}</div>
                <p className="mt-2 text-sm leading-6 text-gray-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={`px-5 py-20 ${index % 2 === 1 ? "border-y border-white/10 bg-white/[0.03]" : ""}`}
        >
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-300">{section.kicker}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">{section.title}</h2>
            <p className="mt-5 max-w-3xl leading-7 text-gray-400">{section.body}</p>

            <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {section.cards.map((card) => (
                <article key={card.name} className="flex min-h-[320px] flex-col rounded-lg border border-white/10 bg-black/40 p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">{card.tag}</p>
                  <h3 className="mt-4 text-2xl font-semibold">{card.name}</h3>
                  <p className="mt-3 leading-7 text-gray-300">{card.purpose}</p>
                  <div className="mt-auto pt-6">
                    <p className="text-sm leading-6 text-gray-500">{card.use}</p>
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">{card.status}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {card.actions.map(([label, href]) => (
                        <Link
                          key={`${card.name}-${label}`}
                          href={href}
                          className="rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-white transition hover:border-white"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
