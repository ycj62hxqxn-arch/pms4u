"use client";

import FlightSearchForm from "@/components/FlightSearchForm";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Flight Price Scanner</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Compare flight prices across different geographic regions to find the best rates for your journey.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <FlightSearchForm />
        </div>
      </div>
    </div>
  );
}
