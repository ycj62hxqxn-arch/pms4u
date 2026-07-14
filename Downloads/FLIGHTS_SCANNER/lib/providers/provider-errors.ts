export type ProviderErrorCode =
  | "PROVIDER_NOT_CONFIGURED"
  | "PROVIDER_TIMEOUT"
  | "PROVIDER_RETRY_EXHAUSTED"
  | "PROVIDER_BAD_RESPONSE"
  | "PROVIDER_UNAVAILABLE";

export interface ProviderErrorShape {
  code: ProviderErrorCode;
  message: string;
  retryable: boolean;
  provider: string;
}

export class ProviderIntegrationError extends Error {
  readonly code: ProviderErrorCode;
  readonly retryable: boolean;
  readonly provider: string;

  constructor(shape: ProviderErrorShape) {
    super(shape.message);
    this.name = "ProviderIntegrationError";
    this.code = shape.code;
    this.retryable = shape.retryable;
    this.provider = shape.provider;
  }

  toJSON(): ProviderErrorShape {
    return {
      code: this.code,
      message: this.message,
      retryable: this.retryable,
      provider: this.provider,
    };
  }
}
