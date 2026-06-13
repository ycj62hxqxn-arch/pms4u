import type { Metadata } from "next";
import "./globals.css";
import Reveal from "./components/Reveal";

export const metadata: Metadata = {
  title: "PMS4U — Runtime Governance OS",
  description:
    "PMS4U prevents unauthorized actions before they create consequences by governing state, authority, admissibility, and evidence at runtime.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white font-sans antialiased">
        <Reveal />
        {children}
      </body>
    </html>
  );
}
