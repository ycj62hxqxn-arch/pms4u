export interface ExchangeRateSnapshot {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: string;
  provider: string;
}

const mockRates: Record<string, Record<string, number>> = {
  USD: { EUR: 0.92, GBP: 0.79, INR: 83.2, ZAR: 18.5 },
  EUR: { USD: 1.09, GBP: 0.86, INR: 90.5, ZAR: 20.1 },
  GBP: { USD: 1.27, EUR: 1.16, INR: 105.2, ZAR: 23.4 },
  INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, ZAR: 0.22 },
  ZAR: { USD: 0.054, EUR: 0.05, GBP: 0.043, INR: 4.49 },
};

export async function getExchangeRate(
  fromCurrency: string,
  toCurrency: string
): Promise<ExchangeRateSnapshot> {
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();

  if (from === to) {
    return {
      fromCurrency: from,
      toCurrency: to,
      rate: 1.0,
      timestamp: new Date().toISOString(),
      provider: "mock",
    };
  }

  const rate = mockRates[from]?.[to] || 1.0;
  return {
    fromCurrency: from,
    toCurrency: to,
    rate,
    timestamp: new Date().toISOString(),
    provider: "mock",
  };
}

export function convertAmount(
  amount: number,
  rate: number
): number {
  return Math.round(amount * rate * 100) / 100;
}
