import { NextResponse } from "next/server";

import {
  CKERNELClientError,
  verifyConstitutionalReceipt,
} from "@/lib/ckernel";

import type {
  ConstitutionalReceipt,
} from "@/lib/ckernel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isReceipt(
  value: unknown,
): value is ConstitutionalReceipt {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as Partial<ConstitutionalReceipt>;

  return (
    typeof candidate.receiptId === "string" &&
    typeof candidate.hash === "string" &&
    typeof candidate.signature === "string" &&
    typeof candidate.publicKey === "string" &&
    typeof candidate.decision === "string"
  );
}

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
        message:
          "Request body must contain valid JSON.",
      },
      { status: 400 },
    );
  }

  const candidate = body as {
    receipt?: unknown;
  };

  if (!isReceipt(candidate.receipt)) {
    return NextResponse.json(
      {
        error: "INVALID_RECEIPT",
        message:
          "A constitutional receipt is required.",
      },
      { status: 400 },
    );
  }

  try {
    const result =
      await verifyConstitutionalReceipt(
        candidate.receipt,
      );

    return NextResponse.json(
      result,
      {
        status: result.valid ? 200 : 422,
      },
    );
  } catch (error) {
    if (error instanceof CKERNELClientError) {
      return NextResponse.json(
        {
          error: "CKERNEL_VERIFICATION_FAILURE",
          message: error.message,
          upstreamStatus:
            error.status ?? null,
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        error:
          "CONSTITUTIONAL_VERIFICATION_FAILURE",
        message:
          "Receipt verification could not be completed.",
      },
      { status: 503 },
    );
  }
}
