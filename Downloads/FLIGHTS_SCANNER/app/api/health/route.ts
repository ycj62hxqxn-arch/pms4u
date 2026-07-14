import { NextResponse } from "next/server";
import { getAllProviders } from "@/lib/providers/provider-factory";

export async function GET() {
  const providers = getAllProviders();
  const providerHealth = await Promise.all(
    providers.map((provider) => provider.healthCheck())
  );

  return NextResponse.json({
    status: providerHealth.every((item) => item.status === "UP")
      ? "ok"
      : providerHealth.some((item) => item.status === "DOWN")
        ? "degraded"
        : "degraded",
    timestamp: new Date().toISOString(),
    providerMode: process.env.FLIGHT_PROVIDER_MODE || "mock",
    networkMode: process.env.NETWORK_MODE || "mock",
    liveModeEnabled: process.env.ENABLE_LIVE_MODE === "true",
    providers: providerHealth,
    database: process.env.DATABASE_URL
      ? "configured"
      : "not configured",
  });
}
