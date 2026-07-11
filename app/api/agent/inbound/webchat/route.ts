import { NextResponse } from "next/server";

export const runtime = "nodejs";

function gone() {
  return NextResponse.json(
    {
      ok: false,
      status: "deprecated",
      reason: "Use /api/yai for governed YAI widget requests.",
    },
    { status: 410 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET() {
  return gone();
}

export async function POST() {
  return gone();
}
