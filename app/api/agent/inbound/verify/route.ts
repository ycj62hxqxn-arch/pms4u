import { createHash, createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { getLedgerReference, readAllLedgerEntries, type LedgerEntry } from "../../../../../lib/agentLedger";

const RECEIPT_SIGNING_SECRET = process.env.PMS_RECEIPT_SIGNING_SECRET ?? "dev-only-unsafe";

function computeHash(entry: Omit<LedgerEntry, "hash">): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        eventId: entry.eventId,
        timestamp: entry.timestamp,
        kind: entry.kind,
        executionId: entry.executionId,
        payload: entry.payload,
        previousHash: entry.previousHash,
      })
    )
    .digest("hex");
}

function verifyReceipt(entry: LedgerEntry): { ok: boolean; reason?: string } {
  if (entry.kind !== "SIGNED_RECEIPT") {
    return { ok: true };
  }

  const signature = String(entry.payload.signature ?? "");
  if (!signature) {
    return { ok: false, reason: "Missing signature in SIGNED_RECEIPT payload." };
  }

  const payload = { ...entry.payload };
  delete payload.signature;
  const canonical = JSON.stringify(payload);
  const expected = createHmac("sha256", RECEIPT_SIGNING_SECRET).update(canonical).digest("hex");

  return expected === signature
    ? { ok: true }
    : { ok: false, reason: "Receipt signature mismatch." };
}

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const executionId = searchParams.get("executionId")?.trim();

  const allEntries = await readAllLedgerEntries();
  const entries = executionId ? allEntries.filter((entry) => entry.executionId === executionId) : allEntries;

  let expectedPreviousHash = entries.length > 0 ? entries[0].previousHash : "GENESIS";
  let chainValid = true;
  const issues: string[] = [];

  for (const entry of entries) {
    const calculated = computeHash({
      eventId: entry.eventId,
      timestamp: entry.timestamp,
      kind: entry.kind,
      executionId: entry.executionId,
      payload: entry.payload,
      previousHash: entry.previousHash,
    });

    if (entry.previousHash !== expectedPreviousHash) {
      chainValid = false;
      issues.push(`Broken linkage at event ${entry.eventId}.`);
    }

    if (calculated !== entry.hash) {
      chainValid = false;
      issues.push(`Hash mismatch at event ${entry.eventId}.`);
    }

    const receiptCheck = verifyReceipt(entry);
    if (!receiptCheck.ok) {
      chainValid = false;
      issues.push(`${receiptCheck.reason} Event ${entry.eventId}.`);
    }

    expectedPreviousHash = entry.hash;
  }

  return NextResponse.json({
    executionId: executionId ?? null,
    entriesScanned: entries.length,
    chainValid,
    issues,
    ledgerPath: getLedgerReference(),
    headHash: entries.length > 0 ? entries[entries.length - 1].hash : null,
  });
}
