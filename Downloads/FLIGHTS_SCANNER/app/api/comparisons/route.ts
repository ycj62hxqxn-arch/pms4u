import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { runComparison } from "@/lib/comparison/comparison-runner";
import { setComparisonRecord } from "@/lib/comparison/comparison-store";
import { comparisonRequestSchema } from "@/lib/validation/flight-search-schema";

interface ComparisonRequest {
  searchRequest?: {
    originIata: string;
    destinationIata: string;
    departureDate: string;
    returnDate?: string;
    tripType: "ONE_WAY" | "ROUND_TRIP";
    adults: number;
    cabinClass: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
    directOnly: boolean;
    preferredCurrency: string;
    maxResults: number;
  };
  search?: ComparisonRequest["searchRequest"];
  selectedLocations: string[];
  comparisonCurrency: string;
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const maxRequests = 30;
  const current = rateLimitMap.get(ip);

  if (!current || current.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count += 1;
  rateLimitMap.set(ip, current);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const body = (await request.json()) as ComparisonRequest;
    const searchRequest = body.searchRequest ?? body.search;

    // Validate input
    if (!searchRequest || !body.selectedLocations) {
      return NextResponse.json(
        { error: "Missing required fields: searchRequest, selectedLocations" },
        { status: 400 }
      );
    }

    const validated = comparisonRequestSchema.safeParse({
      searchRequest,
      selectedLocations: body.selectedLocations,
      comparisonCurrency: body.comparisonCurrency,
    });
    if (!validated.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validated.error.issues.map((issue) => ({
            path: issue.path.map((part) => String(part)).join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    // Generate ID
    const comparisonId = uuidv4();

    // Mark as running in store
    setComparisonRecord(comparisonId, {
      status: "DRAFT",
      createdAt: new Date(),
    });

    // Start comparison asynchronously (don't await)
    (async () => {
      try {
        setComparisonRecord(comparisonId, {
          status: "RUNNING",
          createdAt: new Date(),
        });

        const result = await runComparison(
          comparisonId,
          validated.data.searchRequest,
          body.selectedLocations,
          validated.data.comparisonCurrency
        );

        setComparisonRecord(comparisonId, {
          status: result.status,
          result,
          createdAt: new Date(),
        });
      } catch (err) {
        setComparisonRecord(comparisonId, {
          status: "FAILED",
          result: {
            error: err instanceof Error ? err.message : "Unknown error",
          },
          createdAt: new Date(),
        });
      }
    })();

    return NextResponse.json(
      {
        comparisonId,
        status: "RUNNING",
        createdAt: new Date().toISOString(),
        message: "Comparison started. Poll /api/comparisons/{id} for results.",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
