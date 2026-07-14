export function getReceiptSigningSecret(): string {
  const value = process.env.PMS_RECEIPT_SIGNING_SECRET?.trim();

  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("PMS_RECEIPT_SIGNING_SECRET is required in production.");
    }
    throw new Error("PMS_RECEIPT_SIGNING_SECRET is required.");
  }

  if (value.length < 32) {
    throw new Error("PMS_RECEIPT_SIGNING_SECRET must be at least 32 characters.");
  }

  return value;
}
