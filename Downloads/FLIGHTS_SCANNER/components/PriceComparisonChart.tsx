"use client";

import { PriceComparisonRow } from "./PriceComparisonTable";

interface PriceComparisonChartProps {
  rows: PriceComparisonRow[];
  isLoading?: boolean;
}

export default function PriceComparisonChart({ rows, isLoading }: PriceComparisonChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center h-96">
        <p className="text-gray-500">Preparing chart...</p>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center h-96">
        <p className="text-gray-500">No data to display</p>
      </div>
    );
  }

  // Sort by normalized price for visual clarity
  const sortedRows = [...rows].sort((a, b) => a.normalizedPrice - b.normalizedPrice);

  // Find min/max for scaling
  const prices = sortedRows.map((r) => r.normalizedPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  // Highlight baseline and cheapest
  const baselineIdx = sortedRows.findIndex((r) => r.locationKey === "BASELINE");
  const cheapestIdx = 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8">
      <h2 className="text-lg font-bold mb-6">Price Comparison Chart</h2>

      <div className="space-y-4">
        {sortedRows.map((row, idx) => {
          const normalizedValue = (row.normalizedPrice - minPrice) / priceRange;
          const isBaseline = idx === baselineIdx;
          const isCheapest = idx === cheapestIdx;

          let barColor = "bg-gray-400 dark:bg-gray-600";
          if (isBaseline) barColor = "bg-blue-500 dark:bg-blue-400";
          if (isCheapest) barColor = "bg-green-500 dark:bg-green-400";

          return (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium truncate">
                {row.locationLabel}
                {isCheapest && <span className="text-green-600 dark:text-green-400 ml-1">★</span>}
              </div>

              <div className="flex-1">
                <div className="relative h-8 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                  <div
                    className={`h-full ${barColor} transition-all`}
                    style={{ width: `${Math.max(5, normalizedValue * 100)}%` }}
                  />
                </div>
              </div>

              <div className="w-28 text-right">
                <p className="font-bold text-sm">
                  {row.normalizedPrice.toFixed(2)} {row.comparisonCurrency}
                </p>
                {row.priceDifferencePercent !== 0 && (
                  <p className={`text-xs ${row.priceDifference < 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {row.priceDifference > 0 ? "+" : ""}
                    {row.priceDifferencePercent.toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
        <p>★ = Lowest price | Blue = Baseline (home country) | Gray = Regional offers</p>
      </div>
    </div>
  );
}
