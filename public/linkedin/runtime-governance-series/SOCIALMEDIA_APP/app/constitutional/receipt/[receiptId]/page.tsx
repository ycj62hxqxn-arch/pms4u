import Link from "next/link";

import type {
  ConstitutionalEvidence,
  ConstitutionalReceipt,
  ConstitutionalVerificationResult,
} from "@/lib/ckernel";

import { ReceiptActions } from "./receipt-actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    receiptId: string;
  }>;
};

type ReceiptLoadResult =
  | {
      ok: true;
      receipt: ConstitutionalReceipt;
      verification: ConstitutionalVerificationResult | null;
    }
  | {
      ok: false;
      message: string;
    };

function getBaseUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL;
  return configuredUrl ? configuredUrl.replace(/\/$/, "") : "http://localhost:3000";
}

async function loadReceipt(receiptId: string): Promise<ReceiptLoadResult> {
  const baseUrl = getBaseUrl();
  const receiptResponse = await fetch(
    `${baseUrl}/api/constitutional/receipt/${encodeURIComponent(receiptId)}`,
    { cache: "no-store" },
  );

  if (!receiptResponse.ok) {
    const errorBody = (await receiptResponse.json().catch(() => null)) as
      | { message?: string }
      | null;

    return {
      ok: false,
      message:
        errorBody?.message ??
        "The constitutional receipt could not be retrieved.",
    };
  }

  const receipt = (await receiptResponse.json()) as ConstitutionalReceipt;
  const verificationResponse = await fetch(
    `${baseUrl}/api/constitutional/verify`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receipt }),
      cache: "no-store",
    },
  );

  const verification = verificationResponse.ok
    ? ((await verificationResponse.json()) as ConstitutionalVerificationResult)
    : null;

  return { ok: true, receipt, verification };
}

function formatTimestamp(timestamp: string): string {
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) return timestamp;

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "UTC",
  }).format(parsed);
}

function truncateMiddle(value: string, visible = 16): string {
  if (value.length <= visible * 2 + 3) return value;
  return `${value.slice(0, visible)}…${value.slice(-visible)}`;
}

function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-white/[0.07] bg-black/30 p-4 text-xs leading-relaxed text-zinc-400 print:border-zinc-300 print:bg-zinc-50 print:text-zinc-800">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  valueClassName = "text-zinc-100",
}: {
  label: string;
  value: string;
  detail?: string;
  valueClassName?: string;
}) {
  return (
    <article className="min-w-0 bg-[#17171b] p-5 print:bg-white">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-600">
        {label}
      </p>
      <p className={`mt-2 truncate text-sm font-semibold ${valueClassName} print:text-black`}>
        {value}
      </p>
      {detail && <p className="mt-1 truncate text-xs text-zinc-500">{detail}</p>}
    </article>
  );
}

function EvidenceCard({ evidence, index }: { evidence: ConstitutionalEvidence; index: number }) {
  return (
    <article className="rounded-xl border border-white/[0.07] bg-black/20 p-4 print:border-zinc-300 print:bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-600">
            Evidence {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-zinc-200 print:text-black">
            {evidence.type || "Unspecified evidence"}
          </h3>
        </div>
        <span className="rounded-full border border-sky-500/20 bg-sky-500/[0.07] px-2.5 py-1 text-[0.68rem] font-medium text-sky-300 print:text-zinc-800">
          ATTACHED
        </span>
      </div>

      <dl className="mt-4 space-y-3 text-xs">
        <div>
          <dt className="uppercase tracking-wide text-zinc-600">Evidence ID</dt>
          <dd className="mt-1 break-all font-mono text-zinc-400 print:text-zinc-800">
            {evidence.id || "Not supplied"}
          </dd>
        </div>
        <div>
          <dt className="uppercase tracking-wide text-zinc-600">Digest</dt>
          <dd className="mt-1 break-all font-mono text-zinc-400 print:text-zinc-800" title={evidence.digest}>
            {evidence.digest ? truncateMiddle(evidence.digest, 20) : "Not supplied"}
          </dd>
        </div>
      </dl>
    </article>
  );
}

export default async function ConstitutionalReceiptPage({ params }: PageProps) {
  const { receiptId } = await params;
  const result = await loadReceipt(receiptId);

  if (!result.ok) {
    return (
      <main className="min-h-screen bg-[#0d0d0f] px-4 py-12 text-white">
        <div className="mx-auto max-w-3xl">
          <Link href="/feed" className="text-sm text-violet-400 transition hover:text-violet-300">
            ← Back to feed
          </Link>
          <section className="mt-6 rounded-2xl border border-rose-500/25 bg-rose-500/[0.07] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">Receipt unavailable</p>
            <h1 className="mt-2 text-2xl font-semibold">Constitutional receipt could not be loaded</h1>
            <p className="mt-3 text-sm text-zinc-400">{result.message}</p>
          </section>
        </div>
      </main>
    );
  }

  const { receipt, verification } = result;
  const isAllowed = receipt.decision === "ALLOW";
  const isReview = receipt.decision === "REQUIRE_REVIEW";

  const decisionClasses = isAllowed
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
    : isReview
      ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
      : "border-rose-500/30 bg-rose-500/10 text-rose-300";

  const verificationLabel = verification
    ? verification.valid
      ? "VERIFIED"
      : "FAILED"
    : "UNAVAILABLE";

  const verificationClasses = verification
    ? verification.valid
      ? "border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-300"
      : "border-rose-500/25 bg-rose-500/[0.08] text-rose-300"
    : "border-amber-500/25 bg-amber-500/[0.08] text-amber-300";

  return (
    <main className="min-h-screen bg-[#0d0d0f] px-4 py-8 text-white print:bg-white print:px-0 print:py-0 print:text-black">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Link href="/feed" className="text-sm text-violet-400 transition hover:text-violet-300">← Back to feed</Link>
          <ReceiptActions receipt={receipt} />
        </div>

        <section className="mt-6 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#131316] shadow-2xl shadow-black/20 print:mt-0 print:rounded-none print:border-zinc-300 print:bg-white print:shadow-none">
          <header className="relative overflow-hidden border-b border-white/[0.07] p-6 sm:p-8 print:border-zinc-300">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/70 to-transparent print:hidden" />
            <div className="relative flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300/90 print:text-zinc-700">Constitutional execution receipt</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Governed Runtime Evidence</h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500 print:text-zinc-700">A signed, verifiable record of the constitutional decision applied to this governed action.</p>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-500 print:text-zinc-700">
                  <span><strong className="font-medium text-zinc-300 print:text-black">Receipt:</strong> <span className="font-mono">{truncateMiddle(receipt.receiptId, 18)}</span></span>
                  <span><strong className="font-medium text-zinc-300 print:text-black">Runtime:</strong> CKERNEL {receipt.runtimeVersion}</span>
                  <span><strong className="font-medium text-zinc-300 print:text-black">UTC:</strong> {formatTimestamp(receipt.timestamp)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className={`rounded-full border px-5 py-2.5 text-sm font-bold tracking-[0.12em] ${decisionClasses}`}>{receipt.decision}</span>
                <span className="font-mono text-[0.68rem] text-zinc-600 print:text-zinc-700">{truncateMiddle(receipt.hash, 14)}</span>
              </div>
            </div>
          </header>

          <div className={`border-b px-6 py-4 sm:px-8 ${verificationClasses} print:border-zinc-300 print:bg-zinc-50 print:text-black`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[0.14em]">{verification?.valid ? "✓ " : verification ? "✕ " : "△ "}CRYPTOGRAPHIC INTEGRITY {verificationLabel}</p>
                <p className="mt-1 text-xs opacity-75">{verification?.reason || "The verification service did not return a result."}</p>
              </div>
              <span className="rounded-full border border-current/20 px-3 py-1 text-[0.68rem] font-semibold">{verification?.valid ? "SIGNED · HASH VERIFIED" : verification ? "REVIEW INTEGRITY" : "SERVICE UNAVAILABLE"}</span>
            </div>
          </div>

          <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3 print:border-b print:border-zinc-300 print:bg-zinc-300">
            <SummaryCard label="Decision" value={receipt.decision} detail={isAllowed ? "Execution admitted" : isReview ? "Human review required" : "Execution blocked"} valueClassName={isAllowed ? "text-emerald-300" : isReview ? "text-amber-300" : "text-rose-300"} />
            <SummaryCard label="Verification" value={verificationLabel} detail={verification?.reason} valueClassName={verification?.valid ? "text-emerald-300" : verification ? "text-rose-300" : "text-amber-300"} />
            <SummaryCard label="Actor" value={receipt.actor} detail="Constitutional subject" />
            <SummaryCard label="Intent" value={receipt.intent} detail="Evaluated action" />
            <SummaryCard label="Evidence" value={`${receipt.evidence.length} item${receipt.evidence.length === 1 ? "" : "s"}`} detail="Submitted to the decision" />
            <SummaryCard label="Runtime" value={`CKERNEL ${receipt.runtimeVersion}`} detail="Constitutional engine" />
          </div>

          <div className="space-y-8 p-6 sm:p-8">
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
              <article className="rounded-2xl border border-white/[0.07] bg-black/20 p-5 print:border-zinc-300 print:bg-white">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-amber-300/80 print:text-zinc-700">Constitutional decision</p>
                <h2 className="mt-2 text-xl font-semibold">{receipt.decision}</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-300 print:text-zinc-800">{receipt.reason}</p>
                <div className="mt-6">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-600">Rules applied</p>
                  {receipt.constitutionalRules.length > 0 ? (
                    <ol className="mt-3 space-y-3">
                      {receipt.constitutionalRules.map((rule, index) => (
                        <li key={`${rule}-${index}`} className="flex gap-3 rounded-xl border border-violet-500/15 bg-violet-500/[0.05] p-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-violet-400/25 text-[0.68rem] font-bold text-violet-300">{index + 1}</span>
                          <span className="pt-0.5 text-sm text-violet-200 print:text-zinc-800">{rule}</span>
                        </li>
                      ))}
                    </ol>
                  ) : <p className="mt-3 text-sm text-zinc-500">No constitutional rules were returned.</p>}
                </div>
              </article>

              <aside className="rounded-2xl border border-white/[0.07] bg-black/20 p-5 print:border-zinc-300 print:bg-white">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-amber-300/80 print:text-zinc-700">Receipt identity</p>
                <dl className="mt-4 space-y-5 text-xs">
                  <div><dt className="uppercase tracking-wide text-zinc-600">Receipt ID</dt><dd className="mt-1 break-all font-mono text-zinc-300 print:text-zinc-800">{receipt.receiptId}</dd></div>
                  <div><dt className="uppercase tracking-wide text-zinc-600">Timestamp</dt><dd className="mt-1 text-zinc-300 print:text-zinc-800">{formatTimestamp(receipt.timestamp)}</dd></div>
                  <div><dt className="uppercase tracking-wide text-zinc-600">Runtime</dt><dd className="mt-1 font-mono text-zinc-300 print:text-zinc-800">CKERNEL {receipt.runtimeVersion}</dd></div>
                </dl>
              </aside>
            </section>

            <section>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div><p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-amber-300/80 print:text-zinc-700">Evidence chain</p><h2 className="mt-1 text-xl font-semibold">Submitted evidence</h2></div>
                <span className="text-xs text-zinc-600">{receipt.evidence.length} attached</span>
              </div>
              {receipt.evidence.length > 0 ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {receipt.evidence.map((evidence, index) => <EvidenceCard key={evidence.id || `${evidence.digest}-${index}`} evidence={evidence} index={index} />)}
                </div>
              ) : <div className="mt-4 rounded-xl border border-dashed border-white/[0.1] p-5 text-sm text-zinc-500 print:border-zinc-300">No evidence objects were attached to this evaluation.</div>}
              <details className="mt-4 rounded-xl border border-white/[0.07] bg-black/20 print:border-zinc-300 print:bg-white">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-zinc-300 print:text-zinc-800">View raw evidence JSON</summary>
                <div className="border-t border-white/[0.07] p-4 print:border-zinc-300"><JsonBlock value={receipt.evidence} /></div>
              </details>
            </section>

            <section>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-amber-300/80 print:text-zinc-700">Receipt chain</p>
              <h2 className="mt-1 text-xl font-semibold">Hash continuity</h2>
              <div className="mt-4 grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr]">
                <article className="rounded-xl border border-white/[0.07] bg-black/20 p-4 print:border-zinc-300 print:bg-white"><p className="text-[0.68rem] uppercase tracking-[0.16em] text-zinc-600">Previous receipt</p><p className="mt-2 break-all font-mono text-xs leading-relaxed text-zinc-400 print:text-zinc-800">{receipt.previousReceiptHash || "Genesis / no previous hash"}</p></article>
                <div className="flex items-center justify-center text-xl text-zinc-700 print:text-zinc-500"><span className="rotate-90 lg:rotate-0">→</span></div>
                <article className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-4 print:border-zinc-300 print:bg-white"><p className="text-[0.68rem] uppercase tracking-[0.16em] text-zinc-600">Current receipt hash</p><p className="mt-2 break-all font-mono text-xs leading-relaxed text-emerald-300 print:text-zinc-800">{receipt.hash}</p></article>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <details className="rounded-xl border border-white/[0.07] bg-black/20 print:border-zinc-300 print:bg-white"><summary className="cursor-pointer px-4 py-3 text-sm font-medium text-zinc-300 print:text-zinc-800">Evaluation context</summary><div className="border-t border-white/[0.07] p-4 print:border-zinc-300"><JsonBlock value={receipt.context} /></div></details>
              <details className="rounded-xl border border-white/[0.07] bg-black/20 print:border-zinc-300 print:bg-white"><summary className="cursor-pointer px-4 py-3 text-sm font-medium text-zinc-300 print:text-zinc-800">Complete receipt JSON</summary><div className="border-t border-white/[0.07] p-4 print:border-zinc-300"><JsonBlock value={receipt} /></div></details>
            </section>

            <section className="rounded-2xl border border-white/[0.07] bg-black/20 p-5 print:border-zinc-300 print:bg-white">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-amber-300/80 print:text-zinc-700">Cryptographic integrity</p>
              <h2 className="mt-1 text-xl font-semibold">Signed verification material</h2>
              <div className="mt-5 grid gap-4">
                {[["Receipt hash", receipt.hash], ["Signature", receipt.signature], ["Public key", receipt.publicKey]].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/[0.07] bg-[#111114] p-4 print:border-zinc-300 print:bg-white"><p className="text-[0.68rem] uppercase tracking-[0.16em] text-zinc-600">{label}</p><p className="mt-2 break-all font-mono text-xs leading-relaxed text-zinc-400 print:text-zinc-800">{value}</p></div>
                ))}
              </div>
            </section>
          </div>

          <footer className="border-t border-white/[0.07] px-6 py-4 text-center text-[0.68rem] uppercase tracking-[0.16em] text-zinc-700 print:border-zinc-300 print:text-zinc-600">Constitutional receipt · Runtime evidence · {receipt.receiptId}</footer>
        </section>
      </div>
    </main>
  );
}
