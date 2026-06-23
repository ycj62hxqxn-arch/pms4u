"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Bike,
  CalendarClock,
  Car,
  CheckCircle2,
  CreditCard,
  Gauge,
  MapPin,
  RadioTower,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

type VehicleType = "car" | "bike";
type AppView = "rider" | "driver" | "admin";

type Driver = {
  id: string;
  name: string;
  vehicle: VehicleType;
  zone: string;
  rating: number;
  subscription: "active" | "grace" | "expired";
  verified: boolean;
  distanceKm: number;
};

const zones = [
  "Hurghada Marina",
  "Sheraton Road",
  "El Dahar",
  "Hurghada Airport",
  "Senzo Mall",
  "El Gouna",
  "Sahl Hasheesh",
  "Makadi Bay",
] as const;

const drivers: Driver[] = [
  {
    id: "DRV-HRG-014",
    name: "Mina Adel",
    vehicle: "car",
    zone: "Sheraton Road",
    rating: 4.8,
    subscription: "active",
    verified: true,
    distanceKm: 1.8,
  },
  {
    id: "DRV-HRG-022",
    name: "Omar Hassan",
    vehicle: "bike",
    zone: "Hurghada Marina",
    rating: 4.7,
    subscription: "active",
    verified: true,
    distanceKm: 1.2,
  },
  {
    id: "DRV-HRG-031",
    name: "Karim Said",
    vehicle: "car",
    zone: "El Dahar",
    rating: 4.5,
    subscription: "grace",
    verified: true,
    distanceKm: 3.4,
  },
  {
    id: "DRV-HRG-044",
    name: "Hany Nabil",
    vehicle: "bike",
    zone: "Senzo Mall",
    rating: 4.4,
    subscription: "expired",
    verified: true,
    distanceKm: 5.1,
  },
];

const subscriptionPlans = [
  ["Bike pilot", "EGP 950 / month", "Two-wheel access inside approved Hurghada zones."],
  ["Car pilot", "EGP 1,750 / month", "Standard car access with direct rider payment."],
  ["Fleet account", "Manual approval", "For hotels, tour operators, and managed local fleets."],
] as const;

function estimateDistance(pickup: string, dropoff: string) {
  if (pickup === dropoff) return 2.2;
  const spread = Math.abs(zones.indexOf(pickup as (typeof zones)[number]) - zones.indexOf(dropoff as (typeof zones)[number]));
  return Math.max(3.5, spread * 4.2 + 2.8);
}

function estimateFare(distanceKm: number, vehicle: VehicleType) {
  const base = vehicle === "car" ? 35 : 18;
  const perKm = vehicle === "car" ? 12 : 7;
  return Math.round(base + distanceKm * perKm);
}

function makeTraceId() {
  return `HRG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function HurghadaPilotApp() {
  const [view, setView] = useState<AppView>("rider");
  const [pickup, setPickup] = useState("Hurghada Marina");
  const [dropoff, setDropoff] = useState("Hurghada Airport");
  const [vehicle, setVehicle] = useState<VehicleType>("car");
  const [traceId, setTraceId] = useState("HRG-PILOT-BOOT");
  const [selectedDriverId, setSelectedDriverId] = useState("");

  const distanceKm = useMemo(() => estimateDistance(pickup, dropoff), [pickup, dropoff]);
  const fare = useMemo(() => estimateFare(distanceKm, vehicle), [distanceKm, vehicle]);
  const eligibleDrivers = useMemo(
    () =>
      drivers
        .filter((driver) => driver.vehicle === vehicle && driver.verified && driver.subscription !== "expired")
        .sort((a, b) => a.distanceKm - b.distanceKm),
    [vehicle]
  );
  const selectedDriver = eligibleDrivers.find((driver) => driver.id === selectedDriverId) ?? eligibleDrivers[0];

  function requestMatch() {
    setTraceId(makeTraceId());
    setSelectedDriverId(selectedDriver?.id ?? "");
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">Hurghada pilot city</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal sm:text-4xl">
              Monthly-fee mobility app
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-1">
            {[
              ["rider", "Rider"],
              ["driver", "Driver"],
              ["admin", "Admin"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key as AppView)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  view === key ? "bg-white text-black" : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[1fr_360px]">
        <div className="min-h-[680px] border border-white/10 bg-black/50">
          {view === "rider" && (
            <div className="grid gap-5 p-5 xl:grid-cols-[0.9fr_1.1fr]">
              <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-3">
                  <MapPin className="size-5 text-emerald-300" />
                  <h2 className="text-xl font-semibold">Request ride</h2>
                </div>

                <div className="mt-5 grid gap-4">
                  <label className="grid gap-2 text-sm">
                    <span className="text-gray-400">Pickup</span>
                    <select
                      value={pickup}
                      onChange={(event) => setPickup(event.target.value)}
                      className="rounded-lg border border-white/10 bg-black px-3 py-3 text-white outline-none focus:border-emerald-300/60"
                    >
                      {zones.map((zone) => (
                        <option key={zone}>{zone}</option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm">
                    <span className="text-gray-400">Drop-off</span>
                    <select
                      value={dropoff}
                      onChange={(event) => setDropoff(event.target.value)}
                      className="rounded-lg border border-white/10 bg-black px-3 py-3 text-white outline-none focus:border-emerald-300/60"
                    >
                      {zones.map((zone) => (
                        <option key={zone}>{zone}</option>
                      ))}
                    </select>
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["car", Car, "Car"],
                      ["bike", Bike, "Motorbike"],
                    ].map(([key, Icon, label]) => {
                      const TypedIcon = Icon as typeof Car;
                      return (
                        <button
                          key={key as string}
                          type="button"
                          onClick={() => setVehicle(key as VehicleType)}
                          className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                            vehicle === key
                              ? "border-emerald-300/60 bg-emerald-950/40 text-emerald-100"
                              : "border-white/10 bg-white/[0.02] text-gray-300 hover:border-white/25"
                          }`}
                        >
                          <TypedIcon className="size-4" />
                          {label as string}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={requestMatch}
                    className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-100"
                  >
                    Find eligible driver
                  </button>
                </div>
              </section>

              <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Pilot estimate</p>
                    <h2 className="mt-1 text-2xl font-semibold">EGP {fare}</h2>
                  </div>
                  <div className="rounded-lg border border-white/10 px-3 py-2 text-right text-sm">
                    <p className="font-semibold">{distanceKm.toFixed(1)} km</p>
                    <p className="text-gray-500">estimated distance</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {eligibleDrivers.map((driver) => (
                    <button
                      key={driver.id}
                      type="button"
                      onClick={() => setSelectedDriverId(driver.id)}
                      className={`w-full rounded-lg border p-4 text-left transition ${
                        selectedDriver?.id === driver.id
                          ? "border-emerald-300/60 bg-emerald-950/25"
                          : "border-white/10 bg-black/35 hover:border-white/25"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{driver.name}</p>
                          <p className="mt-1 text-xs text-gray-500">{driver.id}</p>
                        </div>
                        <span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-bold text-black">
                          {driver.subscription}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-gray-400">
                        <span>{driver.zone}</span>
                        <span>{driver.distanceKm.toFixed(1)} km away</span>
                        <span>{driver.rating.toFixed(1)} rating</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {view === "driver" && (
            <div className="grid gap-5 p-5 xl:grid-cols-[0.95fr_1.05fr]">
              <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-3">
                  <CreditCard className="size-5 text-emerald-300" />
                  <h2 className="text-xl font-semibold">Driver subscription</h2>
                </div>
                <div className="mt-5 grid gap-3">
                  {subscriptionPlans.map(([title, price, body]) => (
                    <article key={title} className="rounded-lg border border-white/10 bg-black/45 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold">{title}</h3>
                        <span className="text-sm font-semibold text-emerald-300">{price}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-gray-400">{body}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-3">
                  <RadioTower className="size-5 text-sky-300" />
                  <h2 className="text-xl font-semibold">Available requests</h2>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    ["REQ-8841", "Hurghada Marina", "Sheraton Road", "EGP 62", "Bike eligible"],
                    ["REQ-8842", "Airport", "El Gouna", "EGP 218", "Car eligible"],
                    ["REQ-8843", "Senzo Mall", "Sahl Hasheesh", "EGP 144", "Car eligible"],
                  ].map(([id, from, to, price, rule]) => (
                    <article key={id} className="rounded-lg border border-white/10 bg-black/45 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-mono text-sm text-gray-400">{id}</p>
                        <span className="text-sm font-semibold">{price}</span>
                      </div>
                      <p className="mt-3 font-semibold">
                        {from} → {to}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">{rule}. Active subscription required before accept.</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}

          {view === "admin" && (
            <div className="grid gap-5 p-5 xl:grid-cols-[1fr_1fr]">
              <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-3">
                  <UserCheck className="size-5 text-emerald-300" />
                  <h2 className="text-xl font-semibold">Driver verification queue</h2>
                </div>
                <div className="mt-5 space-y-3">
                  {drivers.map((driver) => (
                    <article key={driver.id} className="rounded-lg border border-white/10 bg-black/45 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{driver.name}</p>
                          <p className="mt-1 text-xs text-gray-500">{driver.id}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            driver.subscription === "expired"
                              ? "bg-red-400 text-black"
                              : "bg-emerald-300 text-black"
                          }`}
                        >
                          {driver.subscription}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
                        <span>{driver.vehicle}</span>
                        <span>{driver.zone}</span>
                        <span>{driver.verified ? "KYC pass" : "KYC pending"}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-5 text-sky-300" />
                  <h2 className="text-xl font-semibold">Governance log</h2>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    ["PASS", "Driver approval requires KYC, license, vehicle, and insurance evidence."],
                    ["PASS", "Expired subscription blocks new ride acceptance."],
                    ["REVIEW", "Payout, suspension, refund, and data export require accountable operator."],
                    ["TRACE", `Current request trace: ${traceId}`],
                  ].map(([state, body]) => (
                    <article key={body} className="rounded-lg border border-white/10 bg-black/45 p-4">
                      <div className="flex gap-3">
                        {state === "REVIEW" ? (
                          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" />
                        ) : (
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                        )}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">{state}</p>
                          <p className="mt-1 text-sm leading-6 text-gray-300">{body}</p>
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
              <Gauge className="size-5 text-emerald-300" />
              <h2 className="font-semibold">Pilot metrics</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {[
                ["Pilot zone", "Hurghada"],
                ["Active drivers", "3 / 4"],
                ["Monthly fee model", "Enabled"],
                ["Commission", "0% pilot assumption"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <CalendarClock className="size-5 text-sky-300" />
              <h2 className="font-semibold">Pilot checklist</h2>
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-300">
              {[
                "Confirm legal operating model for Hurghada.",
                "Recruit first 25 verified drivers.",
                "Test monthly subscription collection.",
                "Run manual support before full automation.",
                "Measure driver retention and trip completion.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </section>
    </main>
  );
}
