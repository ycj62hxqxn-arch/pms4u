import type { Metadata } from "next";
import { YaiAgentBot } from "./components/YaiAgentBot";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pms.bpbsolutionsltd.com";
const siteDescription =
  "PMS4U is a runtime authority boundary for governing consequence-bearing execution before actions commit.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PMS4U — Runtime Governance OS",
    template: "%s | PMS4U",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PMS4U — Runtime Governance OS",
    description: siteDescription,
    url: "/",
    siteName: "PMS4U",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PMS4U — Runtime Governance OS",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <YaiAgentBot />
      </body>
    </html>
  );
}
