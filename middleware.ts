import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const GTCS4U_HOSTS = new Set(["gtcs4u.com", "www.gtcs4u.com"]);

export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const host = hostHeader.split(":")[0].toLowerCase();
  const { pathname } = request.nextUrl;

  if (GTCS4U_HOSTS.has(host) && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/gtcs4u";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
