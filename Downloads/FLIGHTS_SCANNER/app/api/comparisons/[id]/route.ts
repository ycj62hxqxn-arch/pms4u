import { NextRequest, NextResponse } from "next/server";
import { getComparisonRecord } from "@/lib/comparison/comparison-store";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing comparison ID" }, { status: 400 });
    }

    const comparison = getComparisonRecord(id);

    if (!comparison) {
      return NextResponse.json(
        { error: "Comparison not found", id },
        { status: 404 }
      );
    }

    if (comparison.status === "RUNNING") {
      return NextResponse.json({
        comparisonId: id,
        status: "RUNNING",
        createdAt: comparison.createdAt.toISOString(),
        message: "Comparison is still processing. Check again in a few seconds.",
      });
    }

    // Return full result when complete
    return NextResponse.json({
      comparisonId: id,
      ...comparison.result,
      createdAt: comparison.createdAt.toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
