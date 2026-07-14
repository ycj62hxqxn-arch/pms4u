"use client";

export type MatchConfidence = "EXACT" | "HIGH" | "MEDIUM" | "NOT_COMPARABLE";

export interface PriceComparisonRow {
  locationKey: string;
  locationLabel: string;
  verifiedIpCountry?: string;
  airline: string;
  flightRoute: string;
  originalPrice: number;
  originalCurrency: string;
  normalizedPrice: number;
  comparisonCurrency: string;
  priceDifference: number;
  priceDifferencePercent: number;
  matchConfidence: MatchConfidence;
  ipVerified: boolean;
  checkedAt: string;
}

interface PriceComparisonTableProps {
  rows: PriceComparisonRow[];
  isLoading?: boolean;
}

export default function PriceComparisonTable({ rows, isLoading }: PriceComparisonTableProps) {
  const confidenceColor = (confidence: MatchConfidence) => {
    switch (confidence) {
      case "EXACT":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "HIGH":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "NOT_COMPARABLE":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const differenceColor = (diff: number) => {
    if (diff > 0) return "text-red-600 dark:text-red-400"; // more expensive
    if (diff < 0) return "text-green-600 dark:text-green-400"; // cheaper
    return "text-gray-600 dark:text-gray-400"; // same
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center">
        <p className="text-gray-500">Loading results...</p>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center">
        <p className="text-gray-500">No comparison data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full bg-white dark:bg-gray-900">
        <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Location</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">IP Verified</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Flight</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Original Price</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Normalized Price</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Difference</th>
            <th className="px-4 py-3 text-center text-sm font-semibold">Match Quality</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Checked</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-4 py-3 text-sm font-medium">
                {row.locationLabel}
                {row.verifiedIpCountry && (
                  <p className="text-xs text-gray-500">({row.verifiedIpCountry})</p>
                )}
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    row.ipVerified ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                {row.ipVerified ? "✓" : "✗"}
              </td>
              <td className="px-4 py-3 text-sm">
                <p className="font-medium">{row.airline}</p>
                <p className="text-xs text-gray-500">{row.flightRoute}</p>
              </td>
              <td className="px-4 py-3 text-sm text-right">
                {row.originalPrice.toFixed(2)} {row.originalCurrency}
              </td>
              <td className="px-4 py-3 text-sm text-right font-medium">
                {row.normalizedPrice.toFixed(2)} {row.comparisonCurrency}
              </td>
              <td className={`px-4 py-3 text-sm text-right font-medium ${differenceColor(row.priceDifference)}`}>
                {row.matchConfidence === "MEDIUM" || row.matchConfidence === "NOT_COMPARABLE" ? (
                  <span className="text-gray-500 dark:text-gray-400">Not reliably comparable</span>
                ) : (
                  <>
                    {row.priceDifference > 0 ? "+" : ""}
                    {row.priceDifference.toFixed(2)} ({row.priceDifferencePercent.toFixed(1)}%)
                  </>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${confidenceColor(row.matchConfidence)}`}>
                  {row.matchConfidence}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-gray-500">
                {new Date(row.checkedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
