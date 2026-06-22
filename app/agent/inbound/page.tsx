"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type ApiResponse = {
  executionId: string;
  decision: "ALLOW" | "DENY" | "NEED_REVIEW";
  reason: string;
  status: string;
  policyPack?: {
    id: string;
    name: string;
  };
  receipt?: {
    executionId: string;
    decision: string;
    policyPackId: string;
    gateHash: string;
    finalHash: string;
    issuedAt: string;
    signature: string;
  };
  output?: {
    executionMode: string;
    agentResult: unknown;
  };
  trace: {
    gateHash: string;
    finalHash: string;
    ledgerPath: string;
  };
};

type LiveEvent = {
  eventId: string;
  timestamp: string;
  kind: string;
  executionId: string;
  payload: Record<string, unknown>;
  hash: string;
};

const initialForm = {
  actorId: "ops-user-01",
  actorRole: "ops-supervisor",
  useCase: "check-lead",
  targetSystem: "pms4u-runtime",
  requestedAction: "check lead and propose next action",
  prompt: "Check lead quality and propose a non-executing follow-up plan.",
};

const quickTasks = [
  {
    label: "Check lead",
    useCase: "check-lead",
    requestedAction: "check lead and propose next action",
    prompt: "Check lead quality and propose a non-executing follow-up plan.",
  },
  {
    label: "Send email",
    useCase: "send-email",
    requestedAction: "draft email content for approval",
    prompt: "Prepare an email draft only. Do not send. Return approval-ready text.",
  },
  {
    label: "Create report",
    useCase: "create-report",
    requestedAction: "prepare report outline",
    prompt: "Create a report outline and KPI checklist without executing external actions.",
  },
  {
    label: "Validate shipment",
    useCase: "validate-shipment",
    requestedAction: "validate shipment gate preconditions",
    prompt: "Validate shipment conditions and produce a recommendation only.",
  },
];

const EVENT_LABELS: Record<string, string> = {
  INBOUND_REQUEST: "Inbound Request Received",
  AUTHORITY_CHECK: "Authority Validation",
  ADMISSIBILITY_CHECK: "Admissibility Check",
  PMS_GATE_DECISION: "PMS Decision",
  EVIDENCE_RECORD: "Evidence Record",
  AGENT_PROMPT: "Agent Prompt Prepared",
  AGENT_TOOL_CALL: "OpenAI Tool Call",
  AGENT_TOOL_RESULT: "OpenAI Tool Result",
  AGENT_PLAN: "Suggested Response Generated",
  AGENT_SKIPPED: "Agent Execution Blocked",
  SIGNED_RECEIPT: "Signed Receipt Generated",
};

function renderEventLabel(event: LiveEvent): string {
  if (event.kind === "PMS_GATE_DECISION") {
    return `PMS Decision: ${String(event.payload.decision ?? "UNKNOWN")}`;
  }
  return EVENT_LABELS[event.kind] ?? event.kind;
}

function decisionTone(decision?: string): string {
  if (decision === "ALLOW") return "border-emerald-500/30 bg-emerald-500/15 text-emerald-300";
  if (decision === "DENY") return "border-rose-500/30 bg-rose-500/15 text-rose-300";
  return "border-amber-500/30 bg-amber-500/15 text-amber-300";
}

export default function AgentInboundPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verification, setVerification] = useState<{
    chainValid: boolean;
    entriesScanned: number;
    issues: string[];
  } | null>(null);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [eventsError, setEventsError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/agent/inbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        const message =
          (payload as { detail?: string; message?: string } | null)?.detail ??
          (payload as { detail?: string; message?: string } | null)?.message ??
          `Request failed with status ${res.status}`;
        throw new Error(message);
      }

      const data = payload as ApiResponse;
      setResult(data);
      setVerification(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed. Please retry.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyExecutionTrace() {
    if (!result?.executionId) {
      return;
    }

    setError(null);
    const res = await fetch(`/api/agent/inbound/verify?executionId=${encodeURIComponent(result.executionId)}`);
    const data = (await res.json().catch(() => null)) as {
      chainValid: boolean;
      entriesScanned: number;
      issues: string[];
      detail?: string;
      message?: string;
    } | null;

    if (!res.ok || !data) {
      setError(data?.detail ?? data?.message ?? `Verification failed (${res.status})`);
      return;
    }

    setVerification(data);
  }

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    let isMounted = true;

    async function loadEvents() {
      try {
        const res = await fetch("/api/agent/inbound/events?limit=25", { cache: "no-store" });
        const data = (await res.json().catch(() => null)) as { events: LiveEvent[] } | null;
        if (!res.ok || !data) {
          throw new Error(`Live feed failed (${res.status})`);
        }
        if (isMounted) {
          setEvents(data.events ?? []);
          setEventsError(null);
        }
      } catch {
        if (isMounted) {
          setEventsError("Live events unavailable");
        }
      }
    }

    loadEvents();
    timer = setInterval(loadEvents, 3000);

    return () => {
      isMounted = false;
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  const dashboardStats = useMemo(() => {
    const counts = {
      allow: 0,
      deny: 0,
      review: 0,
      receipts: 0,
    };

    for (const event of events) {
      if (event.kind === "PMS_GATE_DECISION") {
        const decision = String(event.payload.decision ?? "");
        if (decision === "ALLOW") counts.allow += 1;
        if (decision === "DENY") counts.deny += 1;
        if (decision === "NEED_REVIEW") counts.review += 1;
      }

      if (event.kind === "SIGNED_RECEIPT") {
        counts.receipts += 1;
      }
    }

    return counts;
  }, [events]);

  const scopedEvents = useMemo(() => {
    if (!result?.executionId) {
      return [] as LiveEvent[];
    }

    return events.filter((entry) => entry.executionId === result.executionId).slice().reverse();
  }, [events, result?.executionId]);

  const authorityState = useMemo(() => {
    const event = scopedEvents.find((entry) => entry.kind === "AUTHORITY_CHECK");
    if (!event) return "PENDING";
    return event.payload.authorityAllowed ? "VALID" : "INVALID";
  }, [scopedEvents]);

  const admissibilityState = useMemo(() => {
    const event = scopedEvents.find((entry) => entry.kind === "ADMISSIBILITY_CHECK");
    if (!event) return "PENDING";
    return String(event.payload.admissibilityState ?? "PENDING");
  }, [scopedEvents]);

  const evidenceState = useMemo(() => {
    return scopedEvents.some((entry) => entry.kind === "EVIDENCE_RECORD") ? "PRESENT" : "PENDING";
  }, [scopedEvents]);

  const executionState = useMemo(() => {
    if (scopedEvents.some((entry) => entry.kind === "AGENT_PLAN")) return "RUN_COMPLETED";
    if (scopedEvents.some((entry) => entry.kind === "AGENT_SKIPPED")) return "BLOCKED";
    return "PENDING";
  }, [scopedEvents]);

  return (
      <main className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_8%_12%,rgba(14,116,144,0.18),transparent_34%),radial-gradient(circle_at_86%_6%,rgba(16,185,129,0.14),transparent_34%),linear-gradient(180deg,#020617_0%,#020617_52%,#030712_100%)] px-6 py-10 text-slate-100 sm:px-10 sm:py-12">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-slate-800/90 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70 p-7 shadow-[0_0_0_1px_rgba(15,23,42,0.2),0_24px_60px_-32px_rgba(16,185,129,0.25)] backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">PMS4U</p>
              <h1 className="mt-1 text-2xl font-bold sm:text-4xl sm:leading-[1.08]">Authority Before Execution</h1>
              <p className="mt-2 text-sm text-slate-300">
                A web-accessible OpenAI agent that cannot act unless PMS authorizes the execution.
              </p>
              <p className="mt-2 text-xs text-slate-400">Not a dashboard. Not a workflow engine. A control plane for execution.</p>
            </div>
            <span className="rounded-full border border-emerald-500/35 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 shadow-sm shadow-emerald-500/20">
              🟢 PMS ONLINE
            </span>
          </div>
        </header>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-300">
            <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-cyan-300">Runtime</span>
            <span className="rounded border border-slate-700 bg-slate-950/60 px-2 py-1">Authority Gate</span>
            <span className="rounded border border-slate-700 bg-slate-950/60 px-2 py-1">Admissibility</span>
            <span className="rounded border border-slate-700 bg-slate-950/60 px-2 py-1">Evidence Chain</span>
            <span className="rounded border border-slate-700 bg-slate-950/60 px-2 py-1">Trace Replay</span>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["ALLOW", dashboardStats.allow, "text-emerald-300"],
            ["DENY", dashboardStats.deny, "text-rose-300"],
            ["REVIEW", dashboardStats.review, "text-amber-300"],
            ["RECEIPTS", dashboardStats.receipts, "text-sky-300"],
          ].map(([label, value, tone]) => (
            <article key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{label}</p>
              <p className={`mt-2 text-3xl font-bold ${tone}`}>{value}</p>
              <div className="mt-3 h-px bg-slate-800" />
              <p className="mt-2 text-[11px] uppercase tracking-[0.1em] text-slate-500">Live governed count</p>
            </article>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div className="space-y-6">
        <form onSubmit={onSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
          <h2 className="text-xl font-semibold">Inbound Agent Request</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">Controlled ingress • policy-aware prompting • gated execution</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["actorId", "Actor ID"],
              ["actorRole", "Actor Role"],
              ["useCase", "Use Case"],
              ["targetSystem", "Target System"],
              ["requestedAction", "Requested Action"],
            ].map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-slate-400">{label}</span>
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/90 px-3 py-2 font-mono text-[13px] text-slate-100 outline-none ring-0 focus:border-cyan-400"
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                />
              </label>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickTasks.map((task) => (
              <button
                key={task.label}
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    useCase: task.useCase,
                    requestedAction: task.requestedAction,
                    prompt: task.prompt,
                  }))
                }
                className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs text-slate-300 hover:border-cyan-400"
              >
                {task.label}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Inbound Agent Request Snapshot</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <p><span className="text-slate-400">Actor:</span> <span className="font-semibold">{form.actorId}</span></p>
              <p><span className="text-slate-400">Role:</span> <span className="font-semibold">{form.actorRole}</span></p>
              <p><span className="text-slate-400">Target:</span> <span className="font-semibold">{form.targetSystem}</span></p>
              <p><span className="text-slate-400">Action:</span> <span className="font-semibold">{form.requestedAction}</span></p>
            </div>
          </div>

          <label className="mt-4 block text-sm">
            <span className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-slate-400">Prompt</span>
            <textarea
              className="min-h-36 w-full rounded-lg border border-slate-700 bg-slate-950/90 px-3 py-2 font-mono text-[13px] text-slate-100 outline-none ring-0 focus:border-cyan-400"
              value={form.prompt}
              onChange={(e) => setForm((prev) => ({ ...prev, prompt: e.target.value }))}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/20 disabled:opacity-60"
          >
            {loading ? "Evaluating..." : "Submit through PMS Gate"}
          </button>
        </form>

        {error ? (
          <div className="rounded-xl border border-rose-700 bg-rose-950/30 p-4 text-sm text-rose-200">{error}</div>
        ) : null}

        {result ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
            <h2 className="text-lg font-semibold">Decision Zone</h2>
            <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-slate-500">Authority • Admissibility • Evidence • Execution</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <p className="text-xs text-slate-400">AUTHORITY</p>
                <p className={`mt-1 text-sm font-bold ${authorityState === "VALID" ? "text-emerald-300" : "text-rose-300"}`}>{authorityState}</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <p className="text-xs text-slate-400">ADMISSIBILITY</p>
                <p className={`mt-1 text-sm font-bold ${admissibilityState === "PASS" ? "text-emerald-300" : admissibilityState === "DENY" ? "text-rose-300" : "text-amber-300"}`}>{admissibilityState}</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <p className="text-xs text-slate-400">EVIDENCE</p>
                <p className={`mt-1 text-sm font-bold ${evidenceState === "PRESENT" ? "text-emerald-300" : "text-amber-300"}`}>{evidenceState}</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <p className="text-xs text-slate-400">EXECUTION</p>
                <p className={`mt-1 text-sm font-bold ${executionState === "RUN_COMPLETED" ? "text-emerald-300" : executionState === "BLOCKED" ? "text-rose-300" : "text-amber-300"}`}>{executionState}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="flex items-center gap-3">
                <span className={`rounded-full border px-4 py-2 text-sm font-bold ${decisionTone(result.decision)}`}>{result.decision}</span>
                <p className="text-sm text-slate-300">{result.reason}</p>
              </div>
            </div>

            {result.policyPack ? (
              <p className="mt-1 text-xs text-slate-400">
                Policy Pack: {result.policyPack.name} ({result.policyPack.id})
              </p>
            ) : null}

            <div className="mt-4 grid gap-2 text-xs text-slate-400">
              <div>Execution ID: {result.executionId}</div>
              <div>Gate Hash: {result.trace.gateHash}</div>
              <div>Final Hash: {result.trace.finalHash}</div>
              <div>Ledger: {result.trace.ledgerPath}</div>
            </div>

            {result.output ? (
              <pre className="mt-4 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200">
                {JSON.stringify(result.output, null, 2)}
              </pre>
            ) : null}

            <button
              type="button"
              onClick={verifyExecutionTrace}
              className="mt-4 rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400"
            >
              Verify hash chain and receipt signature
            </button>

            {verification ? (
              <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
                <div>Chain Valid: {verification.chainValid ? "true" : "false"}</div>
                <div>Entries Scanned: {verification.entriesScanned}</div>
                {verification.issues.length > 0 ? <div>Issues: {verification.issues.join(" | ")}</div> : null}
              </div>
            ) : null}
          </section>
        ) : null}
          </div>

          <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Live Event Feed</h2>
              <span className="text-xs text-slate-500">{(scopedEvents.length || events.length).toString()} visible</span>
            </div>

            <div className="mb-2 grid grid-cols-[90px_1fr] gap-2 border-b border-slate-800 pb-2 text-[10px] uppercase tracking-[0.12em] text-slate-500">
              <span>Time</span>
              <span>Event</span>
            </div>

            {eventsError ? <div className="mb-3 text-xs text-rose-300">{eventsError}</div> : null}

            <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
              {(scopedEvents.length > 0 ? scopedEvents : events).map((event) => (
                <div key={event.eventId} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                  <div className="grid grid-cols-[78px_1fr] gap-3">
                    <span className="text-[11px] text-slate-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
                    <div className="flex items-start gap-3 border-l border-slate-800 pl-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-200">{renderEventLabel(event)}</span>
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-slate-400">Execution: {event.executionId.slice(0, 12)}…</div>
                    </div>
                    </div>
                  </div>
                </div>
              ))}

              {events.length === 0 ? (
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-500">
                  No events yet. Submit a task to start the governed event stream.
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
      </main>
  );
}
