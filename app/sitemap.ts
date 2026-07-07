import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pms.bpbsolutionsltd.com";

const routes = [
  ["", 1],
  ["/research", 0.95],
  ["/research/technical-notes/tn-001", 0.9],
  ["/executive-brief", 0.9],
  ["/reference-architecture", 0.9],
  ["/authority", 0.85],
  ["/gtcs4u", 0.85],
  ["/carshunter-cloud", 0.85],
  ["/authority-audit-sprint", 0.85],
  ["/investor", 0.8],
  ["/investor-technical-report", 0.8],
  ["/console", 0.75],
  ["/trace", 0.75],
  ["/ops", 0.7],
  ["/yai", 0.7],
  ["/subscription-mobility", 0.65],
  ["/hurghada-mobility", 0.65],
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map(([path, priority]) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority,
  }));
}
