import { NextResponse } from "next/server";

import {
  CKERNELClientError,
  evaluateConstitutionalRequest,
  validateEvaluationRequest,
} from "@/lib/ckernel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
): Promise<NextResponse> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "INVALID_JSON",
        message: "Request body must contain valid JSON.",
      },
      { status: 400 },
    );
  }

  const validation =
    validateEvaluationRequest(body);

  if (!validation.valid) {
    return NextResponse.json(
      {
        error: "INVALID_CONSTITUTIONAL_REQUEST",
        message: validation.error,
      },
      { status: 400 },
    );
  }

  try {
    const receipt =
      await evaluateConstitutionalRequest(
        validation.value,
      );

    return NextResponse.json(receipt, {
      status: 200,
      headers: {
        "x-constitutional-decision":
          receipt.decision,
        "x-constitutional-receipt":
          receipt.receiptId,
      },
    });
  } catch (error) {
    if (error instanceof CKERNELClientError) {
      return NextResponse.json(
        {
          error: "CKERNEL_UNAVAILABLE",
          message: error.message,
          upstreamStatus: error.status ?? null,
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        error: "CONSTITUTIONAL_GATEWAY_FAILURE",
        message:
          "The constitutional runtime could not be reached.",
      },
      { status: 503 },
    );
  }
}
