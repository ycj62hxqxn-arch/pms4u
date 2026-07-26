"use client";

import { useState } from "react";
import type { ConstitutionalReceipt } from "@/lib/ckernel";

type CopyState = "idle" | "receipt" | "hash";

export function ReceiptActions({ receipt }: { receipt: ConstitutionalReceipt }) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  async function copyValue(value: string, state: Exclude<CopyState, "idle">): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState(state);
      window.setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setCopyState("idle");
    }
  }

  function downloadReceipt(): void {
    const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `constitutional-receipt-${receipt.receiptId}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  const buttonClass = "rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-white/[0.16] hover:bg-white/[0.06]";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => void copyValue(receipt.receiptId, "receipt")} className={buttonClass}>{copyState === "receipt" ? "Copied receipt ID" : "Copy receipt ID"}</button>
      <button type="button" onClick={() => void copyValue(receipt.hash, "hash")} className={buttonClass}>{copyState === "hash" ? "Copied hash" : "Copy hash"}</button>
      <button type="button" onClick={downloadReceipt} className="rounded-lg border border-amber-300/20 bg-amber-300/[0.06] px-3 py-2 text-xs font-medium text-amber-200 transition hover:border-amber-300/35 hover:bg-amber-300/[0.1]">Download JSON</button>
      <button type="button" onClick={() => window.print()} className={buttonClass}>Print</button>
    </div>
  );
}
