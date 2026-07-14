import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Flight Price Location Comparator",
  description:
    "Compare flight prices across different locations, currencies, and markets",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-slate-900 dark:text-white">
            Does your location change the final flight price?
          </h1>
          <p className="mb-4 inline-block rounded border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
            SIMULATED DATA — NOT LIVE FARES
          </p>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            Compare the same itinerary across verified markets, currencies, and approved network locations.
          </p>
          <Link
            href="/search"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Compare verified prices
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              🌍 Multi-Location Comparison
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Test the same flight across verified proxy locations including India, South Africa, Mexico, and more.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              💱 Currency Normalization
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              All prices converted to your preferred currency using real-time exchange rates for accurate comparison.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              🔍 Transparent Evidence
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Every comparison is documented with IP verification, exchange rates, and offer matching logic.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 p-6 rounded-lg mb-8">
          <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-2">
            Important Disclaimer
          </h3>
          <p className="text-amber-800 dark:text-amber-200 text-sm">
            Displayed prices may change and must be confirmed on the provider&apos;s checkout page. Using a VPN does not guarantee lower prices. This tool is for research purposes only.
          </p>
        </div>
      </main>
    </div>
  );
}
