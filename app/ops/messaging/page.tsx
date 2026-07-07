import type { Metadata } from "next";
import Link from "next/link";
import { readInboundEvidenceRecords } from "../../../lib/evidence";

export const metadata: Metadata = {
  title: "PMS4U Governed Messaging Dashboard",
  description:
    "Operator-facing surface for inbound governed messaging events, evidence records, verification status, receipts, and runtime outcomes.",
};

function fmtDuration(value: number | null | undefined) {
  if (typeof value !== "number") return "—";
  return `${value} ms`;
}

function statusPill(label: string, tone: "green" | "amber" | "red" | "slate") {
  const tones = {
    green: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
    amber: "bg-amber-400/10 text-amber-300 border-amber-400/30",
    red: "bg-rose-400/10 text-rose-300 border-rose-400/30",
    slate: "bg-slate-400/10 text-slate-300 border-slate-400/30",
  };

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${tones[tone]}`}>
      {label}
    </span>
  );
}

export default async function GovernedMessagingDashboardPage() {
  const records = await readInboundEvidenceRecords(50);

  const totals = {
    total: records.length,
    verified: records.filter((record) => record.verification?.verified).length,
    forwarded: records.filter((record) => record.processing?.forwarded).length,
    executed: records.filter((record) => record.processing?.executed).length,
    ignored: records.filter((record) => record.processing?.ignored).length,
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Governed Execution over Messaging</p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Inbound Messaging Control Surface</h1>
              <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Validation-phase operator dashboard for inbound governed messaging events. Each message is shown as a runtime governance event with
                verification posture, evidence continuity, forwarding result, and downstream runtime decision context.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/ops" className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/5">
                Back to Ops
              </Link>
              <Link href="/carshunter-cloud" className="rounded-xl bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-200 hover:bg-cyan-400/25">
                Open CARSHUNTER Surface
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "Inbound Events", value: totals.total },
            { label: "Verified", value: totals.verified },
            { label: "Forwarded", value: totals.forwarded },
            { label: "Executed", value: totals.executed },
            { label: "Ignored", value: totals.ignored },
          ].map((item) => (
            <article key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">{item.label}</div>
              <div className="mt-3 text-3xl font-semibold text-white">{item.value}</div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">Latest governed message events</h2>
              <p className="mt-1 text-sm text-slate-400">Evidence-backed inbound requests with verification, runtime handling, and receipt context.</p>
            </div>
          </div>

          {records.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center text-sm text-slate-400">
              No inbound governed messaging evidence records have been captured yet.
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => {
                const processing = record.processing ?? {};
                const verified = record.verification?.verified;
                const forwarded = processing.forwarded;
                const executed = processing.executed;
                const ignored = processing.ignored;
                const decision = processing.runtimeDecision ?? "—";

                return (
                  <article key={record.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {statusPill(verified ? "Verified" : "Unverified", verified ? "green" : "amber")}
                          {statusPill(forwarded ? "Forwarded" : ignored ? "Ignored" : "Pending", forwarded ? "green" : ignored ? "slate" : "amber")}
                          {statusPill(executed ? "Executed" : decision === "ALLOW" ? "Allowed" : decision === "NEED_REVIEW" ? "Needs Review" : "Not Executed", executed ? "green" : decision === "NEED_REVIEW" ? "amber" : "red")}
                        </div>
                        <h3 className="text-lg font-semibold text-white">{record.sender || "Unknown sender"}</h3>
                        <p className="max-w-3xl text-sm leading-6 text-slate-300">{record.text || "No message text captured."}</p>
                      </div>
                      <div className="min-w-[240px] space-y-1 text-sm text-slate-300">
                        <div><span className="text-slate-500">Evidence ID:</span> {record.id}</div>
                        <div><span className="text-slate-500">Correlation:</span> {record.correlation_id}</div>
                        <div><span className="text-slate-500">Timestamp:</span> {record.timestamp}</div>
                        <div><span className="text-slate-500">Receipt / Execution:</span> {processing.receiptId ?? "—"}</div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-300">
                        <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Verification</div>
                        <div className="mt-2 font-medium text-white">{verified ? "Signature accepted" : "No verified signature"}</div>
                        <div className="mt-1 text-slate-400">Method: {record.verification?.method ?? "none"}</div>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-300">
                        <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Runtime outcome</div>
                        <div className="mt-2 font-medium text-white">{decision}</div>
                        <div className="mt-1 text-slate-400">Duration: {fmtDuration(processing.runtimeMs)}</div>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-300">
                        <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Evidence continuity</div>
                        <div className="mt-2 break-all font-mono text-xs text-cyan-200">{record.sha256}</div>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-300">
                        <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Media attachments</div>
                        <div className="mt-2 font-medium text-white">{record.mediaFiles?.length ?? 0}</div>
                        <div className="mt-1 text-slate-400">Stored and hashed when downloadable.</div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
