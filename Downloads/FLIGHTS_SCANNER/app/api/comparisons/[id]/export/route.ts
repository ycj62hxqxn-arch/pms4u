import { NextRequest, NextResponse } from "next/server";
import { ComparisonResult } from "@/lib/comparison/comparison-runner";
import { getComparisonRecord } from "@/lib/comparison/comparison-store";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const format = request.nextUrl.searchParams.get("format") || "json";

    if (!id) {
      return NextResponse.json({ error: "Missing comparison ID" }, { status: 400 });
    }

    const comparison = getComparisonRecord(id);

    if (!comparison || !comparison.result) {
      return NextResponse.json(
        { error: "Comparison not found or not completed" },
        { status: 404 }
      );
    }

    const result = comparison.result as ComparisonResult & { baselineOffers?: object };

    switch (format.toLowerCase()) {
      case "csv": {
        const rows = result.matchedResults
          ?.filter((r) => r.status === "MATCHED")
          .map(
            (r) =>
              `"${r.locationLabel}","${r.locationKey}","${r.originalCurrency}",${r.originalPrice},"${r.normalizedCurrency}",${r.normalizedPrice},${r.priceDifferencePercent},"${r.matchConfidence}"`
          )
          .join("\n");

        const csv =
          '"Location","Location Key","Original Currency","Original Price","Normalized Currency","Normalized Price","Difference %","Match Confidence"\n' +
          rows;

        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="comparison-${id}.csv"`,
          },
        });
      }

      case "html": {
        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Flight Price Comparison Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 20px; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
    .summary-card { background: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; }
    .summary-card h3 { margin: 0 0 5px 0; color: #666; font-size: 12px; }
    .summary-card p { margin: 0; font-size: 20px; font-weight: bold; color: #333; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f0f0f0; padding: 10px; text-align: left; font-weight: bold; border-bottom: 2px solid #ddd; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    tr:hover { background: #f9f9f9; }
    .positive { color: green; }
    .negative { color: red; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    .disclaimer { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0; }
    code { background: #f0f0f0; padding: 2px 5px; border-radius: 3px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <h1>✈️ Flight Price Comparison Report</h1>
    
    <div class="disclaimer">
      <strong>⚠️ Disclaimer:</strong> Prices may change between searches. This report is for informational purposes only.
      Actual prices shown on airline websites may differ. Geographic location affects prices but does not guarantee savings.
    </div>

    <h2>Summary</h2>
    <div class="summary">
      <div class="summary-card">
        <h3>Comparison ID</h3>
        <p><code>${id}</code></p>
      </div>
      <div class="summary-card">
        <h3>Status</h3>
        <p>${result.status}</p>
      </div>
      <div class="summary-card">
        <h3>Report Generated</h3>
        <p>${new Date().toLocaleString()}</p>
      </div>
      <div class="summary-card">
        <h3>Locations Checked</h3>
        <p>${result.matchedResults?.filter((r) => r.status === "MATCHED").length || 0}</p>
      </div>
    </div>

    <h2>Price Comparison by Location</h2>
    <table>
      <thead>
        <tr>
          <th>Location</th>
          <th>Original Price</th>
          <th>Normalized Price</th>
          <th>Difference</th>
          <th>Match Confidence</th>
        </tr>
      </thead>
      <tbody>
        ${result.matchedResults
          ?.filter((r) => r.status === "MATCHED")
          .map(
            (r) => `
        <tr>
          <td>${r.locationLabel}</td>
          <td>${r.originalPrice?.toFixed(2)} ${r.originalCurrency}</td>
          <td>${r.normalizedPrice?.toFixed(2)} ${r.normalizedCurrency}</td>
          <td class="${r.priceDifferencePercent && r.priceDifferencePercent > 0 ? "negative" : "positive"}">
            ${r.priceDifferencePercent?.toFixed(1)}%
          </td>
          <td>${r.matchConfidence}</td>
        </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <h2>Data Integrity</h2>
    <p><strong>Evidence Hash (SHA256):</strong></p>
    <p style="word-break: break-all; font-family: monospace; font-size: 12px; background: #f0f0f0; padding: 10px; border-radius: 4px;">
      ${result.evidenceHash}
    </p>

    <div class="footer">
      <p>This report was automatically generated by the Flight Price Location Comparator.</p>
      <p>For questions about location-based pricing, please consult airline terms and conditions.</p>
    </div>
  </div>
</body>
</html>
        `;

        return new NextResponse(html, {
          headers: {
            "Content-Type": "text/html",
            "Content-Disposition": `attachment; filename="comparison-${id}.html"`,
          },
        });
      }

      case "json":
      default: {
        return NextResponse.json(result, {
          headers: {
            "Content-Disposition": `attachment; filename="comparison-${id}.json"`,
          },
        });
      }
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
