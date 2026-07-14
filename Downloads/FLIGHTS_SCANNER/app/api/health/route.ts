import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    providerMode: process.env.FLIGHT_PROVIDER_MODE || "mock",
    networkMode: process.env.NETWORK_MODE || "mock",
    providers: [process.env.FLIGHT_PROVIDER_MODE || "mock"],
    database: process.env.DATABASE_URL ? "configured" : "not configured",
  });
}
