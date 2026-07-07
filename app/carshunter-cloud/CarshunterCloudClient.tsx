"use client";

import Image from "next/image";
import {
  ArrowDown,
  BadgeCheck,
  Building2,
  Car,
  CheckCircle2,
  Cloud,
  Database,
  FileCheck2,
  GitBranch,
  Globe2,
  LineChart,
  Loader2,
  LockKeyhole,
  Route,
  ShieldCheck,
  TrendingUp,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";

function CarshunterLogo() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/35 bg-emerald-300/10">
      <Image
        src="/assets/CARSHUNTER_LOGO.png"
        alt="CARSHUNTER"
        width={40}
        height={40}
        className="object-contain rounded-full"
      />
    </div>
  );
}

type VehicleStatus = "Ready" | "Validate" | "Hold";

type VehicleLead = {
  id: string;
  model: string;
  region: string;
  price: string;
  margin: string;
  risk: "Low" | "Medium" | "High";
  status: VehicleStatus;
  evidence: string[];
};

type GateResponse = {
  executionId: string;
  decision: "ALLOW" | "DENY" | "NEED_REVIEW";
  reason: string;
  status: string;
  policyPack?: { id: string; name: string };
  receipt?: { signature: string; finalHash: string; issuedAt: string };
  trace?: {
    evidenceHash?: string;
    finalHash?: string;
    gateHash?: string;
    ledgerPath?: string;
  };
};

type ReplayEvent = {
  timestamp?: string;
  kind?: string;
  payload?: Record<string, unknown>;
  time?: string;
  text?: string;
};

const vehicles: VehicleLead[] = [
  {
    id: "CH-DE-X7-241",
    model: "BMW X7 40d xDrive",
    region: "Germany to GCC",
    price: "EUR 118,400",
    margin: "14.2%",
    risk: "Medium",
    status: "Validate",
    evidence: ["VIN source", "dealer invoice", "export path"],
  },
  {
    id: "CH-NL-X5-087",
    model: "BMW X5 30d xDrive",
    region: "Netherlands to UAE",
    price: "EUR 92,900",
    margin: "11.8%",
    risk: "Low",
    status: "Ready",
    evidence: ["spec sheet", "seller proof", "price benchmark"],
  },
  {
    id: "CH-US-RR-019",
    model: "Range Rover Sport P400",
    region: "US to Qatar",
    price: "USD 109,500",
    margin: "9.6%",
    risk: "High",
    status: "Hold",
    evidence: ["title gap", "customs review", "sanction check"],
  },
];

const agents = [
  { name: "Sourcing", icon: Car, state: "market scan", tone: "text-cyan-300" },
  { name: "Pricing", icon: LineChart, state: "margin model", tone: "text-emerald-300" },
  { name: "Compliance", icon: ShieldCheck, state: "policy check", tone: "text-amber-300" },
  { name: "Logistics", icon: Truck, state: "route plan", tone: "text-sky-300" },
  { name: "Identity / Authority", icon: LockKeyhole, state: "user permissions", tone: "text-violet-300" },
  { name: "Governance", icon: LockKeyhole, state: "PMS4U gate", tone: "text-lime-300" },
];

const cloudServices = [
  { name: "Next.js UI", detail: "operator console", icon: Globe2 },
  { name: "Cloud Run", detail: "FastAPI agents", icon: Cloud },
  { name: "Cloud SQL", detail: "orders and leads", icon: Database },
  { name: "BigQuery", detail: "market analytics", icon: LineChart },
  { name: "Cloud Storage", detail: "documents and images", icon: FileCheck2 },
  { name: "GitHub Actions", detail: "CI/CD release path", icon: GitBranch },
];

const cloudFlow = [
  "Identity",
  "API Gateway",
  "YAI",
  "Agent Orchestrator",
  "Runtime Authority",
  "Execution",
  "Evidence Ledger",
];

const policyChecks = [
  "Buyer authority",
  "Source reliability",
  "Price anomaly",
  "Customs path",
  "Evidence completeness",
];

function statusTone(status: VehicleStatus) {
  if (status === "Ready") return "border-emerald-400/35 bg-emerald-400/10 text-emerald-200";
  if (status === "Validate") return "border-amber-400/35 bg-amber-400/10 text-amber-200";
  return "border-rose-400/35 bg-rose-400/10 text-rose-200";
}

function decisionTone(decision?: string) {
  if (decision === "ALLOW") return "border-emerald-400/40 bg-emerald-400/10 text-emerald-200";
  if (decision === "DENY") return "border-rose-400/40 bg-rose-400/10 text-rose-200";
  if (decision === "NEED_REVIEW") return "border-amber-400/40 bg-amber-400/10 text-amber-200";
  return "border-slate-600 bg-slate-900 text-slate-300";
}

function classNames(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatReplayText(event: ReplayEvent) {
  if (event.text) return event.text;
  const details = [event.kind, event.payload ? JSON.stringify(event.payload) : ""].filter(Boolean);
  return details.join(" — ");
}

export default function CarshunterCloudClient() {
  const [selectedId, setSelectedId] = useState(vehicles[0].id);
  const [buyer, setBuyer] = useState("GCC premium buyer");
  const [intent, setIntent] = useState("Prepare non-executing vehicle sourcing recommendation");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    governedDecisions: 0,
    deniedExecutions: 0,
    evidenceReceipts: 0,
    authorityFailures: 0,
    policyViolations: 0,
    evidenceFailures: 0,
    totalRuntimeMs: 0,
    runCount: 0,
    replaySuccess: 0,
    interruptedExecutions: 0,
  });
  const [replayEvents, setReplayEvents] = useState<ReplayEvent[]>([]);
  const [showReplay, setShowReplay] = useState(false);

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === selectedId) ?? vehicles[0],
    [selectedId]
  );

  async function runGovernanceGate() {
    setLoading(true);
    setError(null);
    setResult(null);
    const startTime = performance.now();

    try {
      const response = await fetch("/api/agent/inbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actorId: "carshunter-operator-01",
          actorRole: "ops-supervisor",
          useCase: "carshunter-cloud-sourcing",
          targetSystem: "carshunter-cloud-run",
          requestedAction: intent,
          prompt: [
            "Create a proposed-actions-only sourcing plan.",
            `Buyer context: ${buyer}.`,
            `Vehicle: ${selectedVehicle.model}.`,
            `Reference: ${selectedVehicle.id}.`,
            `Route: ${selectedVehicle.region}.`,
            `Listed price: ${selectedVehicle.price}.`,
            `Risk: ${selectedVehicle.risk}.`,
            `Evidence available: ${selectedVehicle.evidence.join(", ")}.`,
            "Do not reserve, contact, purchase, ship, or execute external actions.",
          ].join("\n"),
        }),
      });

      const payload = (await response.json().catch(() => null)) as GateResponse | null;
      if (!response.ok || !payload) {
        if (response.status >= 500) {
          setError("Runtime unavailable. The governance service is temporarily unavailable. Reference: GOV-RUNTIME-001");
        } else {
          setError(payload?.reason ?? `Request failed (${response.status}).`);
        }
        setMetrics((current) => ({
          ...current,
          interruptedExecutions: current.interruptedExecutions + 1,
        }));
        return;
      }

      setResult(payload);
      const durationMs = Math.max(0, performance.now() - startTime);
      setMetrics((current) => ({
        governedDecisions: current.governedDecisions + 1,
        deniedExecutions: current.deniedExecutions + (payload.decision === "DENY" ? 1 : 0),
        evidenceReceipts: current.evidenceReceipts + 1,
        authorityFailures: current.authorityFailures + (payload.decision === "NEED_REVIEW" ? 1 : 0),
        policyViolations: current.policyViolations + (payload.decision === "DENY" ? 1 : 0),
        evidenceFailures: current.evidenceFailures + (payload.decision !== "ALLOW" ? 1 : 0),
        totalRuntimeMs: current.totalRuntimeMs + durationMs,
        runCount: current.runCount + 1,
        replaySuccess: current.replaySuccess,
        interruptedExecutions: current.interruptedExecutions,
      }));
    } catch (caught) {
      setError(
        caught instanceof Error && caught.name === "AbortError"
          ? "Runtime timeout. The governance service did not respond in time. Reference: GOV-RUNTIME-001"
          : "Runtime unavailable. The governance service encountered an unexpected error. Reference: GOV-RUNTIME-001"
      );
      setMetrics((current) => ({
        ...current,
        interruptedExecutions: current.interruptedExecutions + 1,
      }));
    } finally {
      setLoading(false);
    }
  }

  async function fetchReplay(executionId: string) {
    setReplayEvents([]);
    setShowReplay(true);

    try {
      const res = await fetch(
        `/api/agent/inbound/events?executionId=${encodeURIComponent(executionId)}&limit=100`,
        { cache: "no-store" }
      );
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        setReplayEvents([{ time: new Date().toISOString(), text: "Replay unavailable" }]);
        return;
      }
      setReplayEvents(data.events ?? []);
      setMetrics((current) => ({ ...current, replaySuccess: current.replaySuccess + 1 }));
    } catch {
      setReplayEvents([{ time: new Date().toISOString(), text: "Replay fetch failed" }]);
    }
  }

  const averageRuntime = metrics.runCount ? Math.round(metrics.totalRuntimeMs / metrics.runCount) : 0;
  const dashboardCards = [
    { value: String(metrics.governedDecisions), label: "Governed Decisions", icon: CheckCircle2 },
    { value: String(metrics.deniedExecutions), label: "Denied Executions", icon: ShieldCheck },
    { value: String(metrics.evidenceReceipts), label: "Evidence Receipts", icon: FileCheck2 },
    { value: `${averageRuntime} ms`, label: "Average Gate Latency", icon: TrendingUp },
    { value: String(metrics.policyViolations), label: "Policy Violations", icon: LockKeyhole },
  ];

  return (
    <main className="min-h-screen bg-[#07100f] text-slate-100">
      <div className="border-b border-white/10 bg-[#0b1715]/95">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <CarshunterLogo />
            <div>
              <div className="text-sm font-bold tracking-[0.22em]">CARSHUNTER</div>
              <div className="text-xs text-slate-400">Cloud-native Reference Implementation</div>
              <div className="text-xs text-slate-500">Governed AI Execution for Enterprise Vehicle Sourcing</div>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2 text-xs text-slate-300">
            <a href="#sourcing" className="rounded-md border border-white/10 px-3 py-2 hover:border-emerald-300/50">Sourcing</a>
            <a href="#agents" className="rounded-md border border-white/10 px-3 py-2 hover:border-emerald-300/50">Agents</a>
            <a href="#cloud" className="rounded-md border border-white/10 px-3 py-2 hover:border-emerald-300/50">Cloud</a>
          </nav>
        </div>
      </div>

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_12%_12%,rgba(45,212,191,0.16),transparent_30%),radial-gradient(circle_at_86%_8%,rgba(250,204,21,0.12),transparent_28%),linear-gradient(180deg,#07100f_0%,#0b1715_100%)] px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
              <Cloud className="size-4" />
              Reference Implementation
            </div>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Every international vehicle purchase carries <span className="font-semibold text-emerald-100">commercial, regulatory, and financial risk</span>.
            </p>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              <span className="font-semibold text-cyan-100">CARSHUNTER Cloud</span> is the official reference implementation of <span className="font-semibold text-cyan-100">PMS4U</span>, demonstrating how runtime authority governs AI-assisted decisions before consequence.
            </p>
          </div>

          <div className="mb-12 rounded-lg border border-emerald-300/20 bg-emerald-300/5 p-8 text-center">
            <div className="text-lg text-slate-400">The Core Principle</div>
            <h1 className="mt-3 text-4xl font-bold leading-[1.1] sm:text-5xl">
              Each agent proposes.<br />
              <span className="text-emerald-100">PMS4U decides before consequence.</span>
            </h1>
          </div>

          <div className="mb-12 grid gap-4 sm:grid-cols-5">
            {dashboardCards.map(({ value, label, icon: Icon }) => (
              <div key={label} className="rounded-lg border border-white/10 bg-black/30 p-5">
                <Icon className="size-5 text-emerald-200" />
                <div className="mt-3 text-3xl font-bold text-emerald-100">{value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{label}</div>
              </div>
            ))}
          </div>

          <div className="mb-12 space-y-6">
            <div className="rounded-lg border border-rose-400/20 bg-rose-400/5 p-6">
              <h3 className="font-semibold text-rose-100">Traditional AI Workflow</h3>
              <div className="mt-4 space-y-2 text-slate-300">
                {[
                  "AI recommends",
                  "Human approves",
                  "Action executes",
                  "Audit later",
                ].map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-rose-400/30 bg-rose-400/10 text-xs font-semibold text-rose-200">{index + 1}</div>
                    <div>{step}</div>
                    {index < 3 ? <ArrowDown className="ml-auto size-4 text-rose-400/50" /> : null}
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-md border border-rose-400/30 bg-rose-400/10 px-3 py-3 text-xs text-rose-200/80">
                Unauthorized actions can complete before governance catches them.
              </div>
            </div>

            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-6">
              <h3 className="font-semibold text-emerald-100">PMS4U Governed Workflow</h3>
              <div className="mt-4 space-y-2 text-slate-300">
                {[
                  "AI recommends",
                  "Authority verified",
                  "Policy checked",
                  "Evidence validated",
                  "Execution allowed",
                  "Receipt created",
                ].map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-xs font-semibold text-emerald-200">{index + 1}</div>
                    <div>{step}</div>
                    {index < 5 ? <ArrowDown className="ml-auto size-4 text-emerald-400/50" /> : null}
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-3 text-xs text-emerald-200/80">
                Runtime authority enforces policy and evidence before execution.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={runGovernanceGate}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-300 px-6 py-3 text-sm font-semibold text-[#07100f] shadow-lg shadow-emerald-950/40 transition hover:bg-emerald-200 disabled:opacity-60"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
              Run Live Governance Demo
            </button>
            <a
              href="mailto:info@bpbsolutionsltd.com?subject=CARSHUNTER%20Enterprise%20Walkthrough"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/40 hover:bg-emerald-300/10"
            >
              <Globe2 className="size-4" />
              Book Enterprise Walkthrough
            </a>
            <a
              href="/reference-architecture"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
            >
              <Route className="size-4" />
              See PMS4U in Action
            </a>
          </div>
        </div>
      </section>

      <section id="sourcing" className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Governed Decision Queue</h2>
              <p className="mt-1 text-sm text-slate-400">Pending decisions are evaluated through runtime authority before execution</p>
            </div>
            <BadgeCheck className="size-6 text-emerald-200" />
          </div>
          <div className="mt-5 space-y-3">
            {vehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => setSelectedId(vehicle.id)}
                className={classNames(
                  "w-full rounded-md border p-4 text-left transition",
                  selectedId === vehicle.id
                    ? "border-emerald-300/60 bg-emerald-300/10"
                    : "border-white/10 bg-black/20 hover:border-white/25"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{vehicle.model}</div>
                    <div className="mt-1 text-xs text-slate-400">{vehicle.id}</div>
                  </div>
                  <span className={classNames("rounded-md border px-2 py-1 text-xs", statusTone(vehicle.status))}>
                    {vehicle.status}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
                  <span>{vehicle.region}</span>
                  <span>{vehicle.price}</span>
                  <span>Margin {vehicle.margin}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#0d1514] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Runtime Governance Gate</h2>
              <p className="mt-1 text-sm text-slate-400">Submit this sourcing recommendation through PMS4U</p>
            </div>
            <span className={classNames("rounded-md border px-3 py-2 text-xs font-semibold", decisionTone(result?.decision))}>
              {result?.decision ?? "PENDING"}
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-500">Buyer context</span>
              <input
                value={buyer}
                onChange={(event) => setBuyer(event.target.value)}
                className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-slate-100 outline-none focus:border-emerald-300"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-500">Requested action</span>
              <input
                value={intent}
                onChange={(event) => setIntent(event.target.value)}
                className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-slate-100 outline-none focus:border-emerald-300"
              />
            </label>
          </div>

          <div className="mt-5 rounded-md border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">{selectedVehicle.model}</div>
                <div className="mt-1 text-sm text-slate-400">{selectedVehicle.region}</div>
              </div>
              <div className="text-right text-sm">
                <div className="font-semibold text-emerald-200">{selectedVehicle.price}</div>
                <div className="text-slate-500">Risk {selectedVehicle.risk}</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedVehicle.evidence.map((item) => (
                <span key={item} className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-xs text-cyan-100">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-5">
            {policyChecks.map((check) => (
              <div key={check} className="rounded-md border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-300">
                <CheckCircle2 className="mb-2 size-4 text-emerald-300" />
                {check}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-md border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
            <div className="font-semibold text-slate-100">Execution Journey</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Operator",
                "AI Recommendation",
                "Specialized Agents",
                "Runtime Authority",
                "Decision",
                "Execution",
                "Evidence Ledger",
                "Audit Replay",
              ].map((step) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs uppercase tracking-[0.12em] text-slate-300">
                  {step}
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={runGovernanceGate}
            disabled={loading}
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-300 px-4 py-2 text-sm font-semibold text-[#07100f] shadow-lg shadow-emerald-950/40 transition hover:bg-emerald-200 disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
            Run PMS4U gate
          </button>

          {error ? (
            <div className="mt-4 rounded-md border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</div>
          ) : null}

          {result ? (
            <div className="mt-4 rounded-md border border-white/10 bg-black/30 p-4">
              <div className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Execution Receipt</div>
              <div className="grid gap-4 text-sm md:grid-cols-2">
                <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Decision</div>
                  <div className="mt-1 text-lg font-semibold text-emerald-200">{result.decision}</div>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Authority</div>
                  <div className="mt-1 text-lg font-semibold text-emerald-200">{result.decision === "ALLOW" ? "Verified ✓" : "Checked"}</div>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Policy</div>
                  <div className="mt-1 text-sm text-slate-200">{result.policyPack?.name ?? "Policy package unavailable"}</div>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Evidence</div>
                  <div className="mt-1 text-sm text-slate-200">{result.receipt?.signature ? "Complete" : "Pending"}</div>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Runtime Authority</div>
                  <div className="mt-1 text-sm text-slate-200">{result.decision === "ALLOW" ? "Valid" : "Review required"}</div>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Execution Time</div>
                  <div className="mt-1 text-sm text-slate-200">{averageRuntime} ms</div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-xs text-slate-400 md:grid-cols-2">
                <div>
                  <div className="uppercase tracking-[0.16em] text-slate-500">Correlation ID</div>
                  <div className="mt-1 break-all font-mono text-xs text-slate-300">{result.executionId}</div>
                </div>
                <div>
                  <div className="uppercase tracking-[0.16em] text-slate-500">Execution Hash</div>
                  <div className="mt-1 break-all font-mono text-xs text-slate-300">{result.trace?.finalHash ?? result.trace?.gateHash ?? "n/a"}</div>
                </div>
                <div>
                  <div className="uppercase tracking-[0.16em] text-slate-500">Evidence Hash</div>
                  <div className="mt-1 break-all font-mono text-xs text-slate-300">{result.trace?.evidenceHash ?? "n/a"}</div>
                </div>
                <div>
                  <div className="uppercase tracking-[0.16em] text-slate-500">Timestamp</div>
                  <div className="mt-1 break-all font-mono text-xs text-slate-300">{result.receipt?.issuedAt ?? "n/a"}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="uppercase tracking-[0.16em] text-slate-500">Verifier Chain</div>
                  <div className="mt-1 break-all font-mono text-xs text-slate-300">{result.trace?.ledgerPath ?? "n/a"}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="uppercase tracking-[0.16em] text-slate-500">Signed by</div>
                  <div className="mt-1 text-sm text-slate-200">PMS4U</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => fetchReplay(result.executionId)}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-emerald-300/40 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-300/15"
                >
                  <BadgeCheck className="size-4" />
                  View Replay
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {showReplay ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6">
          <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-slate-950/80">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm uppercase tracking-[0.18em] text-slate-500">Replay Receipt</div>
                <div className="text-xl font-semibold">Execution Timeline</div>
              </div>
              <button
                type="button"
                onClick={() => setShowReplay(false)}
                className="rounded-full border border-white/10 bg-slate-900 p-2 text-slate-200 hover:bg-slate-800"
              >
                Close
              </button>
            </div>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              {replayEvents.length > 0 ? (
                replayEvents.map((event, index) => {
                  const time = event.timestamp || event.time || "n/a";
                  const text = formatReplayText(event);
                  return (
                    <div key={time + "-" + index} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{time}</div>
                      <div className="mt-2 text-sm text-slate-200">{text}</div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-400">No replay events available.</div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <section id="agents" className="border-y border-white/10 bg-[#0b1715] px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Multi-Agent Architecture</div>
            <h2 className="mt-4 text-3xl font-semibold">Many Agents. One Runtime Authority.</h2>
            <p className="mt-3 max-w-2xl text-slate-300 mx-auto">Agents specialize in their domain, while PMS4U enforces identity, policy, and evidence before any execution proceeds.</p>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <article key={agent.name} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <Icon className={classNames("size-6", agent.tone)} />
                  <h3 className="mt-4 font-semibold">{agent.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{agent.state}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="cloud" className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold">Cloud Deployment Blueprint</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">This reference app maps directly to a production enterprise architecture: managed API runtime, relational storage, analytics, evidence objects, observability, and CI/CD.</p>
            <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center gap-3">
                <Route className="size-5 text-amber-200" />
                <div className="font-semibold">Controlled path</div>
              </div>
              <div className="mt-2 space-y-2 text-sm leading-6 text-slate-400">
                <p>Identity → API Gateway → YAI → Agent Orchestrator → Runtime Authority → Execution → Evidence Ledger</p>
                <p>Cloud SQL, Cloud Storage, BigQuery persist lineage, evidence, and analytics.</p>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {cloudFlow.map((step) => (
                  <div key={step} className="rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-xs uppercase tracking-[0.12em] text-slate-300">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cloudServices.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.name} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <Icon className="size-5 text-emerald-200" />
                  <h3 className="mt-4 font-semibold">{service.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{service.detail}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
