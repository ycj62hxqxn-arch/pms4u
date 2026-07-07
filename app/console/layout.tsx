import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Runtime Governance Console",
  description:
    "Interactive PMS4U runtime console for DENY, DEFER, INTERRUPT, OBSERVE, evidence receipts, and authority injection demos.",
  alternates: {
    canonical: "/console",
  },
  openGraph: {
    title: "Runtime Governance Console | PMS4U",
    description:
      "Interactive PMS4U runtime console for DENY, DEFER, INTERRUPT, OBSERVE, evidence receipts, and authority injection demos.",
    url: "/console",
  },
};

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return children;
}

