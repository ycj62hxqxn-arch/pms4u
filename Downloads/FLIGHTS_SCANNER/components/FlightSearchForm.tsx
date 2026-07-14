"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const CABIN_CLASSES = [
  { value: "ECONOMY", label: "Economy" },
  { value: "PREMIUM_ECONOMY", label: "Premium Economy" },
  { value: "BUSINESS", label: "Business" },
  { value: "FIRST", label: "First Class" },
];

const LOCATIONS = [
  "BASELINE",
  "INDIA",
  "SOUTH_AFRICA",
  "MEXICO",
  "BRAZIL",
  "THAILAND",
  "PHILIPPINES",
  "VIETNAM",
  "COLOMBIA",
  "INDONESIA",
  "MALAYSIA",
];

export default function FlightSearchForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(["BASELINE", "INDIA"]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch("/api/comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchRequest: {
            originIata: String(formData.get("origin") || "").toUpperCase(),
            destinationIata: String(formData.get("destination") || "").toUpperCase(),
            departureDate: String(formData.get("departureDate") || ""),
            returnDate: formData.get("returnDate") ? String(formData.get("returnDate")) : undefined,
            tripType: formData.get("returnDate") ? "ROUND_TRIP" : "ONE_WAY",
            adults: parseInt(String(formData.get("adults") || "1"), 10) || 1,
            cabinClass: String(formData.get("cabinClass") || "ECONOMY"),
            directOnly: formData.get("directOnly") === "on",
            preferredCurrency: String(formData.get("currency") || "USD"),
            maxResults: 20,
          },
          selectedLocations,
          comparisonCurrency: String(formData.get("currency") || "USD"),
        }),
      });

      const data = await response.json();
      router.push(`/results/${data.comparisonId}`);
    } catch (error) {
      console.error("Error creating comparison:", error);
      alert("Error creating comparison. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function toggleLocation(location: string) {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
        Search Flights
      </h1>

      <div className="mb-6 rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
        SIMULATED DATA — NOT LIVE FARES. This form currently uses deterministic mock prices and mock network verification unless live provider and proxy credentials are configured.
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Origin IATA
            </label>
            <input
              id="origin"
              type="text"
              name="origin"
              required
              maxLength={3}
              placeholder="CAI"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Destination IATA
            </label>
            <input
              id="destination"
              type="text"
              name="destination"
              required
              maxLength={3}
              placeholder="BER"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="departureDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Departure Date
            </label>
            <input
              id="departureDate"
              type="date"
              name="departureDate"
              required
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="returnDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Return Date (optional)
            </label>
            <input
              id="returnDate"
              type="date"
              name="returnDate"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="adults" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Adults
            </label>
            <select
              id="adults"
              name="adults"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="cabinClass" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Cabin Class
            </label>
            <select
              id="cabinClass"
              name="cabinClass"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              {CABIN_CLASSES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>INR</option>
              <option>ZAR</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Select Comparison Locations
          </label>
          <div className="grid grid-cols-2 gap-2">
            {LOCATIONS.map((location) => (
              <label key={location} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(location)}
                  onChange={() => toggleLocation(location)}
                  className="w-4 h-4"
                />
                <span className="ml-2 text-slate-700 dark:text-slate-300">
                  {location === "BASELINE" ? "Baseline (No Proxy)" : location}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center">
            <input type="checkbox" name="directOnly" className="w-4 h-4" />
            <span className="ml-2 text-slate-700 dark:text-slate-300">
              Direct flights only
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 rounded transition-colors"
        >
          {loading ? "Searching..." : "Compare verified prices"}
        </button>
      </form>
    </div>
  );
}
