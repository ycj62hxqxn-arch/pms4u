import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const ledgerPath = path.join(process.cwd(), "..", "ledger", "evidence_ledger.jsonl");
  try {
    const data = fs.readFileSync(ledgerPath, "utf-8");
    const lines = data.trim().split("\n");
    const last = lines.length > 0 ? JSON.parse(lines[lines.length - 1]) : null;
    return NextResponse.json({ latest: last });
  } catch (e) {
    return NextResponse.json({ error: "No evidence found" }, { status: 404 });
  }
}
