import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PMS4U — Runtime Governance",
  description: "Authority before execution runtime dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
