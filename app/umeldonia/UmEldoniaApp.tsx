"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Compass,
  Home,
  Hotel,
  MapPin,
  MessageCircle,
  Plane,
  Search,
  ShieldCheck,
  ShipWheel,
  Sparkles,
  UserCheck,
} from "lucide-react";

type ProductType = "Sea" | "Culture" | "Desert" | "Private" | "Stay" | "Property";
type AppView = "discover" | "book" | "operator";

type Experience = {
  id: string;
  type: ProductType;
  title: string;
  location: string;
  duration: string;
  price: string;
  description: string;
  proof: string;
};

const experiences: Experience[] = [
  {
    id: "orange-bay",
    type: "Sea",
    title: "Orange Bay day trip",
    location: "Hurghada",
    duration: "Full day",
    price: "from EUR 45",
    description: "Boat transfer, beach time, snorkeling stops, and hotel pickup coordination.",
    proof: "Operator confirmation required before customer payment request.",
  },
  {
    id: "dolphin-house",
    type: "Sea",
    title: "Dolphin House snorkeling",
    location: "Hurghada",
    duration: "Full day",
    price: "from EUR 42",
    description: "Red Sea snorkeling route with local crew, pickup, and guest-language support.",
    proof: "Weather and boat availability checked before confirmation.",
  },
  {
    id: "luxor-private",
    type: "Culture",
    title: "Private Luxor route",
    location: "Luxor",
    duration: "Full day",
    price: "from EUR 145",
    description: "Valley of the Kings, Karnak, Nile view, and private guide coordination.",
    proof: "Guide, vehicle, and pickup time recorded in the booking trace.",
  },
  {
    id: "desert-safari",
    type: "Desert",
    title: "Desert safari evening",
    location: "Hurghada Desert",
    duration: "Half day",
    price: "from EUR 38",
    description: "Quad route, desert sunset, Bedouin program, and transfer planning.",
    proof: "Safety and transfer status visible to the operator before departure.",
  },
  {
    id: "long-stay",
    type: "Stay",
    title: "Long-stay apartment request",
    location: "Hurghada / El Gouna",
    duration: "Monthly",
    price: "on request",
    description: "Structured intake for guests who want to live, work, or spend winter in Egypt.",
    proof: "Budget, dates, guest profile, and viewing route captured before handoff.",
  },
  {
    id: "property-access",
    type: "Property",
    title: "Property buyer intake",
    location: "Red Sea Coast",
    duration: "By appointment",
    price: "qualified request",
    description: "Buyer-intent workflow for property search, visits, and partner handoff.",
    proof: "No partner handoff before intent, budget, and consent are recorded.",
  },
];

const operatingSteps = [
  ["NEW_REQUEST", "Customer intent captured from app or WhatsApp."],
  ["OPERATOR_REVIEW", "Local operator checks availability, route, and risk."],
  ["CUSTOMER_CONFIRM", "Customer receives clear offer, pickup, and payment instruction."],
  ["SCHEDULED", "Tour, stay, or viewing is locked with accountable operator."],
  ["REPLAY_READY", "Booking lineage can be reconstructed for support or dispute."],
] as const;

const channels = [
  ["Tours", "Sea, culture, safari, and private Egypt experiences."],
  ["Long stays", "Monthly rentals, winter stays, and relocation-style requests."],
  ["Property", "Buyer intake, viewing routes, and partner handoff control."],
  ["WhatsApp", "Local conversation captured into structured operator work."],
] as const;

function makeLeadId() {
  return `UME-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function UmEldoniaApp() {
  const [view, setView] = useState<AppView>("discover");
  const [selectedId, setSelectedId] = useState("orange-bay");
  const [guestName, setGuestName] = useState("Guest from Germany");
  const [travelDate, setTravelDate] = useState("2026-07-15");
  const [partySize, setPartySize] = useState(2);
  const [leadId, setLeadId] = useState("UME-PILOT-BOOT");

  const selectedExperience = useMemo(
    () => experiences.find((experience) => experience.id === selectedId) ?? experiences[0],
    [selectedId]
  );

  const operatorQueue = useMemo(
    () => [
      ["UME-2026-018", "Orange Bay day trip", "Deposit pending", "Operator: Mona"],
      ["UME-2026-019", "Long-stay apartment request", "Needs budget check", "Operator: Aalaa"],
      ["UME-2026-020", selectedExperience.title, "New app request", `Lead: ${leadId}`],
    ],
    [leadId, selectedExperience.title]
  );

  function createLead() {
    setLeadId(makeLeadId());
    setView("operator");
  }

  return (
    <main className="min-h-screen bg-[#07100f] text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#07100f]/90 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.28em] text-white">
            UmEldonia
          </Link>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-300">
            <Link href="/ecosystem" className="transition hover:text-white">
              Ecosystem
            </Link>
            <Link href="/subscription-mobility" className="transition hover:text-white">
              Mobility
            </Link>
            <a href="https://aegyptenhautnah.com/" className="transition hover:text-white">
              Aegypten Hautnah
            </a>
            <Link href="/yai" className="font-medium text-emerald-300 transition hover:text-emerald-100">
              Ask YAI
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[620px] overflow-hidden border-b border-white/10">
        <Image
          src="/assets/umeldonia/red-sea-hero.png"
          alt="Red Sea coastline near Hurghada for the UmEldonia Egypt travel app"
          width={1536}
          height={864}
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,16,15,0.95)_0%,rgba(7,16,15,0.78)_38%,rgba(7,16,15,0.22)_72%,rgba(7,16,15,0.12)_100%)]" />
        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-end px-4 py-12">
          <div className="max-w-3xl pb-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-300">
              Aegypten Hautnah app
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-normal sm:text-7xl">
              UmEldonia opens Egypt through one governed booking app.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-200">
              Tours, long stays, property requests, and WhatsApp intake move into one operator
              workflow for Hurghada first, then wider Egypt.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setView("book")}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-100"
              >
                <CalendarDays className="size-4" />
                Start booking
              </button>
              <button
                type="button"
                onClick={() => setView("operator")}
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:border-white"
              >
                <ShieldCheck className="size-4" />
                Operator view
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black/20 px-4 py-4">
        <div className="mx-auto grid max-w-7xl gap-2 sm:grid-cols-3">
          {[
            ["discover", Compass, "Discover"],
            ["book", MessageCircle, "Book"],
            ["operator", ClipboardList, "Operator"],
          ].map(([key, Icon, label]) => {
            const TypedIcon = Icon as typeof Compass;
            return (
              <button
                key={key as string}
                type="button"
                onClick={() => setView(key as AppView)}
                className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                  view === key
                    ? "border-emerald-300 bg-emerald-300 text-black"
                    : "border-white/10 bg-white/[0.03] text-stone-300 hover:border-white/30 hover:text-white"
                }`}
              >
                <TypedIcon className="size-4" />
                {label as string}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[1fr_360px]">
        <div className="min-h-[700px] border border-white/10 bg-black/35">
          {view === "discover" && (
            <div className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
                    Customer marketplace
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">
                    Sell experiences, stays, and buyer access from one app.
                  </h2>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-stone-200">
                  Pilot city: Hurghada
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {experiences.map((experience) => (
                  <button
                    key={experience.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(experience.id);
                      setView("book");
                    }}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-emerald-300/60 hover:bg-emerald-950/20"
                  >
                    <span className="inline-flex rounded-full bg-emerald-300 px-3 py-1 text-xs font-bold text-black">
                      {experience.type}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold">{experience.title}</h3>
                    <p className="mt-3 min-h-20 text-sm leading-6 text-stone-300">{experience.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2 text-xs text-stone-400">
                      <span className="rounded-full border border-white/10 px-3 py-1">{experience.location}</span>
                      <span className="rounded-full border border-white/10 px-3 py-1">{experience.duration}</span>
                      <span className="rounded-full border border-white/10 px-3 py-1">{experience.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {view === "book" && (
            <div className="grid gap-5 p-5 xl:grid-cols-[0.95fr_1.05fr]">
              <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-3">
                  <Search className="size-5 text-emerald-300" />
                  <h2 className="text-xl font-semibold">Request builder</h2>
                </div>

                <div className="mt-5 grid gap-4">
                  <label className="grid gap-2 text-sm">
                    <span className="text-stone-400">Experience</span>
                    <select
                      value={selectedId}
                      onChange={(event) => setSelectedId(event.target.value)}
                      className="rounded-lg border border-white/10 bg-black px-3 py-3 text-white outline-none focus:border-emerald-300/60"
                    >
                      {experiences.map((experience) => (
                        <option key={experience.id} value={experience.id}>
                          {experience.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm">
                    <span className="text-stone-400">Guest name</span>
                    <input
                      value={guestName}
                      onChange={(event) => setGuestName(event.target.value)}
                      className="rounded-lg border border-white/10 bg-black px-3 py-3 text-white outline-none focus:border-emerald-300/60"
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm">
                      <span className="text-stone-400">Date</span>
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(event) => setTravelDate(event.target.value)}
                        className="rounded-lg border border-white/10 bg-black px-3 py-3 text-white outline-none focus:border-emerald-300/60"
                      />
                    </label>

                    <label className="grid gap-2 text-sm">
                      <span className="text-stone-400">Guests</span>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={partySize}
                        onChange={(event) => setPartySize(Number(event.target.value))}
                        className="rounded-lg border border-white/10 bg-black px-3 py-3 text-white outline-none focus:border-emerald-300/60"
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={createLead}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-100"
                  >
                    <MessageCircle className="size-4" />
                    Create governed lead
                  </button>
                </div>
              </section>

              <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                      Selected request
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">{selectedExperience.title}</h2>
                  </div>
                  <span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-bold text-black">
                    {selectedExperience.price}
                  </span>
                </div>
                <p className="mt-4 leading-7 text-stone-300">{selectedExperience.description}</p>

                <div className="mt-5 grid gap-3 rounded-lg border border-white/10 bg-black/35 p-4 text-sm">
                  {[
                    ["Guest", guestName || "Not set"],
                    ["Date", travelDate],
                    ["Party", `${partySize} guest${partySize === 1 ? "" : "s"}`],
                    ["Location", selectedExperience.location],
                    ["Lead ID", leadId],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-3 border-b border-white/10 pb-2 last:border-b-0 last:pb-0">
                      <span className="text-stone-500">{label}</span>
                      <span className="text-right font-semibold">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-lg border border-emerald-300/25 bg-emerald-950/20 p-4">
                  <div className="flex gap-3">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-300" />
                    <p className="text-sm leading-6 text-emerald-50">{selectedExperience.proof}</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {view === "operator" && (
            <div className="grid gap-5 p-5 xl:grid-cols-[1fr_1fr]">
              <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-3">
                  <UserCheck className="size-5 text-emerald-300" />
                  <h2 className="text-xl font-semibold">Operator queue</h2>
                </div>
                <div className="mt-5 space-y-3">
                  {operatorQueue.map(([id, title, state, owner]) => (
                    <article key={id} className="rounded-lg border border-white/10 bg-black/40 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-mono text-sm text-stone-400">{id}</p>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-stone-300">
                          {state}
                        </span>
                      </div>
                      <h3 className="mt-3 font-semibold">{title}</h3>
                      <p className="mt-2 text-sm text-stone-500">{owner}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-5 text-sky-300" />
                  <h2 className="text-xl font-semibold">Governed workflow</h2>
                </div>
                <div className="mt-5 space-y-3">
                  {operatingSteps.map(([state, body]) => (
                    <article key={state} className="rounded-lg border border-white/10 bg-black/40 p-4">
                      <div className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">{state}</p>
                          <p className="mt-1 text-sm leading-6 text-stone-300">{body}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <Sparkles className="size-5 text-emerald-300" />
              <h2 className="font-semibold">Pilot channels</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {channels.map(([title, body]) => (
                <div key={title} className="rounded-lg border border-white/10 bg-black/35 p-4">
                  <p className="font-semibold">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <MapPin className="size-5 text-sky-300" />
              <h2 className="font-semibold">Launch geography</h2>
            </div>
            <div className="mt-5 grid gap-3 text-sm">
              {[
                [ShipWheel, "Hurghada", "Tours, sea trips, airport pickup, long-stay demand."],
                [Hotel, "El Gouna", "Premium stays, private experiences, property visits."],
                [Plane, "Cairo / Luxor", "Culture routes coordinated from Red Sea demand."],
                [Home, "Red Sea Coast", "Buyer and rental requests routed to partners."],
              ].map(([Icon, title, body]) => {
                const TypedIcon = Icon as typeof ShipWheel;
                return (
                  <div key={title as string} className="flex gap-3 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                    <TypedIcon className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                    <div>
                      <p className="font-semibold">{title as string}</p>
                      <p className="mt-1 leading-6 text-stone-400">{body as string}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <BadgeCheck className="size-5 text-emerald-300" />
              <h2 className="font-semibold">MVP truth</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-stone-300">
              This app is the pilot surface. Payment, supplier contracts, and production booking
              guarantees still need business-side validation before public claims.
            </p>
          </section>
        </aside>
      </section>
    </main>
  );
}
