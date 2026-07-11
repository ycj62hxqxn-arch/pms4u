import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = (
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    ""
  ).toLowerCase();

  // Canonical redirect: www.bpbsolutionsltd.com → bpbsolutionsltd.com
  if (host === "www.bpbsolutionsltd.com") {
    const url = request.nextUrl.clone();
    url.hostname = "bpbsolutionsltd.com";
    return NextResponse.redirect(url, { status: 301 });
  }

  const rootDomainRoutes: Record<string, string> = {
    "pms.bpbsolutionsltd.com": "/research",
    "pms4u.vercel.app": "/research",
    "gtcs4u.com": "/gtcs4u",
    "www.gtcs4u.com": "/gtcs4u",
    "bpbsolutionsltd.com": "/bpbsolutionsltd",
    "www.bpbsolutionsltd.com": "/bpbsolutionsltd",
    "yai.bpbsolutionsltd.com": "/bpbsolutionsltd/yai-studio",
    "studio.bpbsolutionsltd.com": "/bpbsolutionsltd/yai-studio",
    "creator.bpbsolutionsltd.com": "/bpbsolutionsltd/yai-studio",
    "aegyptenhautnah.com": "/aegyptenhautnah.html",
    "www.aegyptenhautnah.com": "/aegyptenhautnah.html",
    "allaatia.com": "/allaatia-full-in-depth-report.html",
    "www.allaatia.com": "/allaatia-full-in-depth-report.html",
  };

  const targetPathname = rootDomainRoutes[host];

  if (pathname === "/" && targetPathname) {
    const url = request.nextUrl.clone();
    url.pathname = targetPathname;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
