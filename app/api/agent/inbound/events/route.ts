import { NextResponse } from "next/server";
import { getLedgerReference, readAllLedgerEntries } from "../../../../../lib/agentLedger";
import { requireSharedSecretAuth } from "../../../../../lib/security/webhook-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authResult = requireSharedSecretAuth(request);
  if ("response" in authResult) {
    return authResult.response;
  }

  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? "30");
  const executionId = searchParams.get("executionId")?.trim();

  const allEntries = await readAllLedgerEntries();
  const entries = allEntries.filter((entry) => (executionId ? entry.executionId === executionId : true));

  const recent = entries.slice(-Math.max(1, Math.min(limit, 100))).reverse();

  return NextResponse.json({
    ledgerPath: getLedgerReference(),
    total: entries.length,
    events: recent,
  });
}
