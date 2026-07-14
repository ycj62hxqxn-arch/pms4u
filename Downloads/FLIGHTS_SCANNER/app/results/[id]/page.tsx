"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ComparisonProgress from "@/components/ComparisonProgress";
import SummaryCards from "@/components/SummaryCards";
import PriceComparisonTable, { PriceComparisonRow } from "@/components/PriceComparisonTable";
import PriceComparisonChart from "@/components/PriceComparisonChart";
import ExportButtons from "@/components/ExportButtons";
import Disclaimer from "@/components/Disclaimer";
import { ComparisonResult, MatchedComparisonResult } from "@/lib/comparison/comparison-runner";

export default function ResultsPage() {
  const params = useParams();
  const comparisonId = params.id as string;

  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!comparisonId) return;

    let pollInterval: NodeJS.Timeout;
    let mounted = true;

    const pollResults = async () => {
      try {
        const res = await fetch(`/api/comparisons/${comparisonId}`);
        if (!res.ok) {
          setError("Failed to fetch results");
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        if (!mounted) return;

        setResult(data);

        // Update step based on status
        if (data.status === "RUNNING") {
          setCurrentStep((prev) => Math.min(5, prev + 1));
          // Keep polling
          pollInterval = setTimeout(pollResults, 2000);
        } else {
          setCurrentStep(6);
          setIsLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setIsLoading(false);
      }
    };

    pollResults();

    return () => {
      mounted = false;
      clearTimeout(pollInterval);
    };
  }, [comparisonId]);

  if (!result && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <ComparisonProgress status="RUNNING" currentStep={currentStep} totalSteps={6} message="Comparing prices across locations..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900 p-6 rounded-lg text-red-800 dark:text-red-200">
            <p className="font-bold">Error loading results</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-600 dark:text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  // Convert matched results to table rows
  const tableRows: PriceComparisonRow[] = result.matchedResults
    .filter((r): r is MatchedComparisonResult & { status: "MATCHED" } => r.status === "MATCHED")
    .map((r) => ({
      locationKey: r.locationKey,
      locationLabel: r.locationLabel,
      verifiedIpCountry: r.verifiedIpCountry,
      airline: r.regionalOffer?.airline || "Unknown",
      flightRoute: `${r.regionalOffer?.segments[0]?.departureAirport}-${r.regionalOffer?.segments[r.regionalOffer.segments.length - 1]?.arrivalAirport}` || "N/A",
      originalPrice: r.originalPrice || 0,
      originalCurrency: r.originalCurrency || "USD",
      normalizedPrice: r.normalizedPrice || 0,
      comparisonCurrency: r.normalizedCurrency || "USD",
      priceDifference: r.priceDifference || 0,
      priceDifferencePercent: r.priceDifferencePercent || 0,
      matchConfidence: r.matchConfidence || "NOT_COMPARABLE",
      ipVerified: r.status === "MATCHED",
      checkedAt: new Date().toISOString(),
    }));

  // Calculate summary
  const matchedResults = result.matchedResults.filter((r) => r.status === "MATCHED");
  const comparableResults = matchedResults.filter(
    (r) => r.matchConfidence === "EXACT" || r.matchConfidence === "HIGH"
  );
  const lowestPrice = comparableResults.length
    ? Math.min(...comparableResults.map((r) => r.normalizedPrice || Infinity))
    : undefined;
  const cheapestLocation = comparableResults.find((r) => r.normalizedPrice === lowestPrice);
  const baselinePrice = matchedResults.find((r) => r.locationKey === "BASELINE")?.normalizedPrice;
  const savingAmount = baselinePrice && lowestPrice ? baselinePrice - lowestPrice : undefined;
  const savingPercent = baselinePrice && savingAmount !== undefined ? (savingAmount / baselinePrice) * 100 : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Comparison Results</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Comparison ID: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{comparisonId}</code>
        </p>

        <div className="mb-6 rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
          SIMULATED DATA — NOT LIVE FARES. Results shown here come from deterministic mock providers and mock network verification unless live credentials are configured.
        </div>

        <ComparisonProgress
          status={result.status}
          currentStep={6}
          totalSteps={6}
          message={result.status === "COMPLETED" ? "All searches completed" : "Some searches failed"}
          errors={Object.entries(result.errors).map(([loc, msg]) => `${loc}: ${msg}`)}
        />

        <SummaryCards
          baselineFinalPrice={baselinePrice}
          lowestFinalPrice={lowestPrice}
          cheapestLocation={cheapestLocation?.locationLabel}
          savingAmount={savingAmount}
          savingPercentage={savingPercent}
          validLocations={comparableResults.length}
          currency={tableRows[0]?.comparisonCurrency || "USD"}
        />

        <PriceComparisonChart rows={tableRows} />

        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Price Breakdown by Location</h2>
          <PriceComparisonTable rows={tableRows} />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Actions</h2>
          <div className="space-y-4">
            <ExportButtons comparisonId={comparisonId} />
            <a
              href={`/audit/${comparisonId}`}
              className="inline-block px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded font-medium transition"
            >
              📋 View Audit Trail
            </a>
          </div>
        </div>

        <Disclaimer />

        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Evidence Hash: <code className="break-all">{result.evidenceHash}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
