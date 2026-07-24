import type {
  CKERNELHealth,
  ConstitutionalEvaluationRequest,
  ConstitutionalReceipt,
  ConstitutionalVerificationResult,
} from "./types";

const DEFAULT_CKERNEL_URL = "http://127.0.0.1:8080";

export class CKERNELClientError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly responseBody?: string,
  ) {
    super(message);
    this.name = "CKERNELClientError";
  }
}

function getBaseUrl(): string {
  return (
    process.env.CKERNEL_URL ??
    process.env.NEXT_PUBLIC_CKERNEL_URL ??
    DEFAULT_CKERNEL_URL
  ).replace(/\/+$/, "");
}

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      accept: "application/json",
      ...(init?.body
        ? { "content-type": "application/json" }
        : {}),
      ...init?.headers,
    },
  });

  const body = await response.text();

  if (!response.ok) {
    throw new CKERNELClientError(
      `CKERNEL request failed with status ${response.status}`,
      response.status,
      body,
    );
  }

  try {
    return JSON.parse(body) as T;
  } catch {
    throw new CKERNELClientError(
      "CKERNEL returned invalid JSON",
      response.status,
      body,
    );
  }
}

export function evaluateConstitutionalRequest(
  requestBody: ConstitutionalEvaluationRequest,
): Promise<ConstitutionalReceipt> {
  return request<ConstitutionalReceipt>(
    "/v1/runtime/evaluate",
    {
      method: "POST",
      body: JSON.stringify(requestBody),
    },
  );
}

export function getCKERNELHealth(): Promise<CKERNELHealth> {
  return request<CKERNELHealth>(
    "/v1/system/health",
  );
}

export function verifyConstitutionalReceipt(
  receipt: ConstitutionalReceipt,
): Promise<ConstitutionalVerificationResult> {
  return request<ConstitutionalVerificationResult>(
    "/v1/runtime/verify",
    {
      method: "POST",
      body: JSON.stringify({ receipt }),
    },
  );
}

export function getConstitutionalReceipt(
  receiptId: string,
): Promise<ConstitutionalReceipt> {
  return request<ConstitutionalReceipt>(
    `/v1/runtime/receipt/${encodeURIComponent(
      receiptId,
    )}`,
  );
}

