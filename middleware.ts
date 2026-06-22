import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = (
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    ""
  ).toLowerCase();

  if (pathname === "/" && (host === "gtcs4u.com" || host === "www.gtcs4u.com")) {
    const url = request.nextUrl.clone();
    url.pathname = "/gtcs4u";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
