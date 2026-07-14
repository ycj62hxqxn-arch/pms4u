import pLimit from "p-limit";
import { ProviderIntegrationError } from "./provider-errors";

const providerLimiter = pLimit(Number(process.env.PROVIDER_CONCURRENCY_LIMIT || 3));

export interface RetryOptions {
  retries: number;
  timeoutMs: number;
  providerName: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withProviderTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<T>((_, reject) => {
    timer = setTimeout(() => {
      reject(
        new ProviderIntegrationError({
          code: "PROVIDER_TIMEOUT",
          message: `Provider request exceeded timeout (${timeoutMs}ms)`,
          retryable: true,
          provider: "authorized",
        })
      );
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function runProviderCall<T>(work: () => Promise<T>): Promise<T> {
  return providerLimiter(() => work());
}

export async function withRetry<T>(
  task: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let attempt = 0;
  let lastError: unknown;

  while (attempt <= options.retries) {
    try {
      return await withProviderTimeout(task(), options.timeoutMs);
    } catch (error) {
      lastError = error;
      const retryable =
        error instanceof ProviderIntegrationError ? error.retryable : false;
      if (!retryable || attempt === options.retries) {
        break;
      }

      const backoffMs = Math.min(2000, 200 * 2 ** attempt);
      await sleep(backoffMs);
      attempt += 1;
    }
  }

  if (lastError instanceof ProviderIntegrationError) {
    throw lastError;
  }

  throw new ProviderIntegrationError({
    code: "PROVIDER_RETRY_EXHAUSTED",
    message: `Provider call failed after retries for ${options.providerName}`,
    retryable: false,
    provider: options.providerName,
  });
}
