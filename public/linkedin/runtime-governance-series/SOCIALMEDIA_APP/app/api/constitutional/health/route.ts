import { NextResponse } from "next/server";

import {
  CKERNELClientError,
  getCKERNELHealth,
} from "@/lib/ckernel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const health = await getCKERNELHealth();

    return NextResponse.json({
      gateway: "ok",
      kernel: health,
    });
  } catch (error) {
    return NextResponse.json(
      {
        gateway: "degraded",
        kernel: null,
        error:
          error instanceof CKERNELClientError
            ? error.message
            : "CKERNEL health check failed.",
      },
      { status: 503 },
    );
  }
}
