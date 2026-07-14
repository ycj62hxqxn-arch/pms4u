"use client";

import { useState } from "react";

interface ExportButtonsProps {
  comparisonId: string;
}

export default function ExportButtons({ comparisonId }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState<string | null>(null);

  const handleExport = async (format: "csv" | "json" | "html") => {
    try {
      setIsExporting(true);
      const res = await fetch(`/api/comparisons/${comparisonId}/export?format=${format}`);

      if (!res.ok) {
        throw new Error("Export failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `comparison-${comparisonId}.${format === "html" ? "html" : format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExported(format.toUpperCase());
      setTimeout(() => setExported(null), 2000);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={() => handleExport("csv")}
        disabled={isExporting}
        className={`px-4 py-2 rounded font-medium transition ${
          exported === "CSV"
            ? "bg-green-500 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
        }`}
      >
        {exported === "CSV" ? "✓ Exported CSV" : "📊 Export CSV"}
      </button>

      <button
        onClick={() => handleExport("json")}
        disabled={isExporting}
        className={`px-4 py-2 rounded font-medium transition ${
          exported === "JSON"
            ? "bg-green-500 text-white"
            : "bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
        }`}
      >
        {exported === "JSON" ? "✓ Exported JSON" : "📄 Export JSON"}
      </button>

      <button
        onClick={() => handleExport("html")}
        disabled={isExporting}
        className={`px-4 py-2 rounded font-medium transition ${
          exported === "HTML"
            ? "bg-green-500 text-white"
            : "bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
        }`}
      >
        {exported === "HTML" ? "✓ Exported HTML" : "🌐 Export HTML"}
      </button>
    </div>
  );
}
