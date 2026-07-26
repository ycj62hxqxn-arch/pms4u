import { NextResponse } from "next/server";
import { findReasoningTraceByPostId, verifyReasoningTraceHash } from "@/lib/kge/trace";
export const dynamic = "force-dynamic";
export async function GET(_request: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const trace = await findReasoningTraceByPostId(postId);
  if (!trace) return NextResponse.json({ message: "Reasoning trace not found." }, { status: 404 });
  return NextResponse.json({ trace, integrity: { valid: verifyReasoningTraceHash(trace), algorithm: "sha256" } });
}
