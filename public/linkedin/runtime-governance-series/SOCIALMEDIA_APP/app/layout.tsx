import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PulseNet — Social Platform",
  description: "A modern social media platform starter focused on feed, communities, messaging, and creator tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
