import { test, expect } from "@playwright/test";

test.describe("Flight price comparison flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/comparisons", async (route) => {
      const request = route.request();
      if (request.method() === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            comparisonId: "cmp-e2e-123",
            status: "RUNNING",
            createdAt: new Date().toISOString(),
            message: "Comparison started. Poll /api/comparisons/{id} for results.",
          }),
        });
        return;
      }
      await route.fallback();
    });

    await page.route("**/api/comparisons/cmp-e2e-123", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          comparisonId: "cmp-e2e-123",
          status: "COMPLETED",
          evidenceHash:
            "a3b9f4c1d2e5f67890abcdef1234567890abcdef1234567890abcdef12345678",
          completedAt: new Date().toISOString(),
          errors: {},
          matchedResults: [
            {
              locationKey: "BASELINE",
              locationLabel: "Baseline",
              status: "MATCHED",
              verifiedIpCountry: "US",
              airline: "TEST AIR",
              flightRoute: "LHR-JFK",
              originalPrice: 500,
              originalCurrency: "USD",
              normalizedPrice: 500,
              comparisonCurrency: "USD",
              priceDifference: 0,
              priceDifferencePercent: 0,
              matchConfidence: "EXACT",
              ipVerified: true,
              checkedAt: new Date().toISOString(),
            },
            {
              locationKey: "INDIA",
              locationLabel: "India",
              status: "MATCHED",
              verifiedIpCountry: "IN",
              airline: "TEST AIR",
              flightRoute: "LHR-JFK",
              originalPrice: 440,
              originalCurrency: "USD",
              normalizedPrice: 440,
              comparisonCurrency: "USD",
              priceDifference: -60,
              priceDifferencePercent: -12,
              matchConfidence: "HIGH",
              ipVerified: true,
              checkedAt: new Date().toISOString(),
            },
          ],
        }),
      });
    });

    await page.route("**/api/comparisons/cmp-e2e-123/export?format=csv", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/csv",
        body: '"Location","Location Key"\n"Baseline","BASELINE"\n',
      });
    });
  });

  test("should complete the search flow and show results", async ({ page }) => {
    await page.goto("/search");

    await expect(page.getByRole("heading", { name: /search flights/i })).toBeVisible();

    await page.getByLabel(/origin iata/i).fill("LHR");
    await page.getByLabel(/destination iata/i).fill("JFK");

    await page.getByLabel(/departure date/i).fill("2025-06-15");
    await page.getByLabel(/adults/i).selectOption("1");
    await page.getByLabel(/currency/i).selectOption("USD");

     await page
      .getByRole("button", { name: /compare (verified )?prices/i })
      .click();

    await expect(page).toHaveURL(/\/results\/cmp-e2e-123/);
    await expect(page.getByRole("heading", { name: /comparison results/i })).toBeVisible();
    await expect(page.getByText(/comparison id/i)).toBeVisible();
    await expect(page.getByText(/evidence hash/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /export csv/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /view audit trail/i })).toBeVisible();
  });
});
