import { NextResponse } from "next/server";
import { findReasoningTraceById, verifyReasoningTraceHash } from "@/lib/kge/trace";
export const dynamic = "force-dynamic";
export async function GET(_request: Request, { params }: { params: Promise<{ traceId: string }> }) {
  const { traceId } = await params;
  const trace = await findReasoningTraceById(traceId);
  if (!trace) return NextResponse.json({ message: "Reasoning trace not found." }, { status: 404 });
  return NextResponse.json({ trace, integrity: { valid: verifyReasoningTraceHash(trace), algorithm: "sha256" } });
}
