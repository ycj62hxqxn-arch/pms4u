import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flight Price Location Comparator",
  description:
    "Compare flight prices across different locations, currencies, and markets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-900">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              ✈️ FPC
            </Link>
            <nav className="flex gap-6">
              <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">
                Home
              </Link>
              <Link href="/search" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">
                Search
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-slate-600 dark:text-slate-400">
            <p>
              Flight Price Location Comparator © 2026. Prices may change. Always confirm on provider&apos;s checkout page.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
