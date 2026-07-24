import { NextResponse } from "next/server";

import {
  CKERNELClientError,
  getConstitutionalReceipt,
} from "@/lib/ckernel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    receiptId: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { receiptId } = await context.params;

  if (!receiptId.trim()) {
    return NextResponse.json(
      {
        error: "RECEIPT_ID_REQUIRED",
        message: "Receipt id is required.",
      },
      { status: 400 },
    );
  }

  try {
    const receipt =
      await getConstitutionalReceipt(
        receiptId,
      );

    return NextResponse.json(receipt);
  } catch (error) {
    if (error instanceof CKERNELClientError) {
      if (error.status === 404) {
        return NextResponse.json(
          {
            error: "RECEIPT_NOT_FOUND",
            message:
              "No constitutional receipt exists with that id.",
          },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          error:
            "CKERNEL_RECEIPT_RETRIEVAL_FAILURE",
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
          "CONSTITUTIONAL_RECEIPT_RETRIEVAL_FAILURE",
        message:
          "The constitutional receipt could not be retrieved.",
      },
      { status: 503 },
    );
  }
}
