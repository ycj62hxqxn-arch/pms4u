"use client";

interface SummaryCardsProps {
  baselineFinalPrice?: number;
  lowestFinalPrice?: number;
  cheapestLocation?: string;
  savingAmount?: number;
  savingPercentage?: number;
  validLocations: number;
  currency: string;
}

export default function SummaryCards({
  baselineFinalPrice,
  lowestFinalPrice,
  cheapestLocation,
  savingAmount,
  savingPercentage,
  validLocations,
  currency,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <p className="text-blue-600 dark:text-blue-300 text-sm font-medium">Baseline Price</p>
        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
          {baselineFinalPrice ? `${baselineFinalPrice.toFixed(2)} ${currency}` : "—"}
        </p>
      </div>

      <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
        <p className="text-green-600 dark:text-green-300 text-sm font-medium">Lowest Found</p>
        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
          {lowestFinalPrice ? `${lowestFinalPrice.toFixed(2)} ${currency}` : "—"}
        </p>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
        <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">Potential Saving</p>
        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
          {savingAmount ? `${savingAmount.toFixed(2)} ${currency}` : "—"}
        </p>
        <p className="text-xs text-purple-700 dark:text-purple-200">
          {savingPercentage ? `${savingPercentage.toFixed(1)}%` : "—"}
        </p>
      </div>

      <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
        <p className="text-orange-600 dark:text-orange-300 text-sm font-medium">Valid Locations</p>
        <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{validLocations}</p>
        <p className="text-xs text-orange-700 dark:text-orange-200">
          Cheapest: {cheapestLocation || "—"}
        </p>
      </div>
    </div>
  );
}
