import Link from "next/link";
import {
  BadgeCheck,
  Bike,
  Car,
  CreditCard,
  Gauge,
  MapPinned,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";

export const metadata = {
  title: "Subscription Mobility MVP | PMS4U",
  description:
    "MVP blueprint for a ride-hailing platform where drivers pay a fixed monthly fee instead of per-ride commission.",
};

const economics = [
  ["Driver monthly plan", "Fixed fee unlocks ride access for verified drivers."],
  ["No ride commission", "Driver keeps fare revenue after direct rider payment."],
  ["Hybrid option", "Part-time drivers can use low daily pass or pay-per-active-day."],
  ["Governed locks", "Expired subscription blocks new ride acceptance, not historical records."],
] as const;

const appSurfaces = [
  {
    title: "Rider app",
    icon: Smartphone,
    points: [
      "Register with phone or email",
      "Set pickup and drop-off",
      "Choose car or motorbike",
      "See fare estimate and driver distance",
      "Track ride and rate driver",
    ],
  },
  {
    title: "Driver app",
    icon: Car,
    points: [
      "Upload license, ID, vehicle, and insurance",
      "Pay monthly subscription",
      "Accept or reject ride requests",
      "See active plan and renewal date",
      "View ride history and rider ratings",
    ],
  },
  {
    title: "Admin console",
    icon: ShieldCheck,
    points: [
      "Approve driver applications",
      "Monitor subscription status",
      "Handle disputes and safety incidents",
      "Suspend drivers with traceable reason",
      "Export evidence only with authority",
    ],
  },
] as const;

const architecture = [
  ["Mobile apps", "React Native or Flutter for rider and driver apps."],
  ["Backend API", "Node.js or Django API for auth, ride matching, plans, and notifications."],
  ["Database", "PostgreSQL for users, rides, subscriptions, audit logs, and payments."],
  ["Maps", "Google Maps or Mapbox for geocoding, live tracking, and distance pricing."],
  ["Payments", "Stripe Billing, PayPal, or local provider for driver subscriptions."],
  ["Notifications", "Firebase Cloud Messaging for trip requests, renewal reminders, and alerts."],
] as const;

const launchPhases = [
  ["1", "Pilot city", "Pick one city, define legal requirements, and recruit a controlled driver cohort."],
  ["2", "Driver economics", "Validate fixed monthly fee, daily pass, and low-commission fallback."],
  ["3", "MVP build", "Ship rider request flow, driver acceptance, subscription status, and admin review."],
  ["4", "Closed beta", "Run limited trips with support, incident logging, and manual dispute handling."],
  ["5", "Public launch", "Scale only after payment, safety, and driver verification controls pass."],
] as const;

const governanceGates = [
  ["Driver approval", "KYC, license, insurance, vehicle status, and operating region must pass."],
  ["Subscription access", "Only active or grace-period drivers can accept new ride requests."],
  ["Incident handling", "Suspension, refund, payout hold, or evidence export needs an accountable operator."],
  ["Data export", "No rider, driver, or trip evidence export without trace ID and authority reason."],
] as const;

export default function SubscriptionMobilityPage() {
  return (
    <main className="min-h-screen bg-[#060606] text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/85 px-5 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.28em]">
            PMS4U Mobility MVP
          </Link>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
            <a href="#economics" className="transition hover:text-white">
              Economics
            </a>
            <a href="#apps" className="transition hover:text-white">
              Apps
            </a>
            <a href="#architecture" className="transition hover:text-white">
              Architecture
            </a>
            <a href="#governance" className="transition hover:text-white">
              Governance
            </a>
            <Link href="/yai" className="font-medium text-emerald-300 transition hover:text-emerald-100">
              Ask YAI
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden border-b border-white/10 px-5 py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-no-repeat opacity-[0.18]"
          style={{
            backgroundImage: 'url("/assets/frameworks/background.png")',
            backgroundPosition: "center 20px",
            backgroundSize: "min(760px, 82vw) auto",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(180deg,rgba(6,6,6,0.12)_0%,rgba(6,6,6,0.82)_74%,#060606_100%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-300">
              Monthly-fee driver marketplace
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-normal sm:text-6xl">
              Ride-hailing where drivers pay access, not commission.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              A practical MVP for cars and motorbikes: riders book trips, drivers keep fares, and
              the platform earns from transparent monthly driver subscriptions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#apps"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-100"
              >
                <Smartphone className="size-4" />
                View app scope
              </a>
              <a
                href="#governance"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white"
              >
                <ShieldCheck className="size-4" />
                Governance gates
              </a>
            </div>
          </div>

          <div className="grid gap-3 border border-white/10 bg-black/60 p-4 backdrop-blur-sm sm:grid-cols-2">
            {[
              ["Driver income", "Fare retained by driver"],
              ["Platform income", "Monthly access fee"],
              ["Vehicle types", "Cars and motorbikes"],
              ["Control layer", "Verification and trace"],
            ].map(([label, value]) => (
              <div key={label} className="border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">{label}</p>
                <p className="mt-2 text-lg font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="economics" className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-300">
                Business model
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">
                Replace per-ride commission with subscription access.
              </h2>
            </div>
            <div className="rounded-lg border border-emerald-300/30 bg-emerald-950/20 px-4 py-3 text-sm font-semibold text-emerald-100">
              Driver pays monthly. Platform does not tax every trip.
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {economics.map(([title, body]) => (
              <article key={title} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <CreditCard className="size-5 text-emerald-300" />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="apps" className="border-y border-white/10 bg-white/[0.02] px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-300">MVP surfaces</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">
            Build three apps first: rider, driver, admin.
          </h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {appSurfaces.map((surface) => {
              const Icon = surface.icon;
              return (
                <article key={surface.title} className="rounded-lg border border-white/10 bg-black/55 p-6">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center border border-white/10 bg-white/[0.04]">
                      <Icon className="size-5 text-emerald-300" />
                    </div>
                    <h3 className="text-xl font-semibold">{surface.title}</h3>
                  </div>
                  <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-300">
                    {surface.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="architecture" className="px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300">
              Technical architecture
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">
              Start with boring, scalable parts.
            </h2>
            <p className="mt-5 leading-7 text-gray-400">
              The MVP does not need exotic AI. It needs accurate location, reliable matching,
              subscription enforcement, driver verification, and traceable admin decisions.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {architecture.map(([title, body]) => (
              <article key={title} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-300">Launch plan</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">
            Controlled rollout before public scale.
          </h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-5">
            {launchPhases.map(([step, title, body]) => (
              <article key={step} className="rounded-lg border border-white/10 bg-black/55 p-5">
                <div className="grid size-10 place-items-center rounded-full bg-white text-sm font-bold text-black">
                  {step}
                </div>
                <h3 className="mt-5 font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="governance" className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-300">
            PMS4U control layer
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">
            Cheap commission is not enough. The platform needs governed execution.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {governanceGates.map(([title, body]) => (
              <article key={title} className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center gap-3">
                  <Gauge className="size-5 text-emerald-300" />
                  <h3 className="font-semibold">{title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-400">{body}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 grid gap-4 border border-white/10 bg-black/55 p-5 md:grid-cols-3">
            {[
              [MapPinned, "Matching", "Nearest eligible driver receives the trip first."],
              [Users, "Safety", "Every user, driver, dispute, and admin action has an owner."],
              [Bike, "Motorbike mode", "Two-wheel rides use separate pricing, radius, and safety rules."],
            ].map(([Icon, title, body]) => {
              const TypedIcon = Icon as typeof Bike;
              return (
                <div key={title as string} className="flex gap-3">
                  <TypedIcon className="mt-1 size-5 shrink-0 text-emerald-300" />
                  <div>
                    <h3 className="font-semibold">{title as string}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-400">{body as string}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
