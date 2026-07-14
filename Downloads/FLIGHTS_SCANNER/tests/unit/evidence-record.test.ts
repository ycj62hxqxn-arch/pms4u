import { describe, it, expect } from "vitest";
import { createEvidenceRecord, generateEvidenceHash } from "@/lib/governance/evidence-record";
import { FlightSearchRequest } from "@/lib/providers/types";

function toEvidenceSearchRequest(value: FlightSearchRequest): Record<string, unknown> {
  return value as unknown as Record<string, unknown>;
}

describe("Evidence Record", () => {
  const mockSearchRequest: FlightSearchRequest = {
    originIata: "LHR",
    destinationIata: "JFK",
    departureDate: "2025-06-15",
    tripType: "ONE_WAY",
    adults: 2,
    cabinClass: "ECONOMY",
    directOnly: false,
    preferredCurrency: "USD",
    maxResults: 5,
  };

  describe("createEvidenceRecord", () => {
    it("should create evidence record with correct fields", () => {
      const record = createEvidenceRecord(
        "cmp-123",
        "COMPLETED",
        toEvidenceSearchRequest(mockSearchRequest),
        ["BASELINE", "INDIA"]
      );

      expect(record.comparisonId).toBe("cmp-123");
      expect(record.status).toBe("COMPLETED");
      expect(record.searchRequest).toEqual(mockSearchRequest);
      expect(record.selectedLocations).toEqual(["BASELINE", "INDIA"]);
      expect(record.createdAt).toBeDefined();
      expect(record.normalizationLogicVersion).toBe("1.0");
      expect(record.offerMatchingVersion).toBe("1.0");
    });

    it("should have empty arrays for verification data", () => {
      const record = createEvidenceRecord(
        "cmp-456",
        "RUNNING",
        toEvidenceSearchRequest(mockSearchRequest),
        ["BASELINE"]
      );

      expect(record.effectiveIpVerification).toEqual([]);
      expect(record.providerResponseMetadata).toEqual([]);
      expect(record.currencyRates).toEqual([]);
      expect(record.errors).toEqual([]);
    });
  });

  describe("generateEvidenceHash", () => {
    it("should generate deterministic hash", () => {
      const record = createEvidenceRecord(
        "cmp-123",
        "COMPLETED",
        toEvidenceSearchRequest(mockSearchRequest),
        ["BASELINE", "INDIA"]
      );

      const hash1 = generateEvidenceHash(record);
      const hash2 = generateEvidenceHash(record);

      expect(hash1).toBe(hash2);
    });

    it("should generate different hashes for different records", () => {
      const record1 = createEvidenceRecord(
        "cmp-123",
        "COMPLETED",
        toEvidenceSearchRequest(mockSearchRequest),
        ["BASELINE", "INDIA"]
      );

      const record2 = createEvidenceRecord(
        "cmp-456",
        "COMPLETED",
        toEvidenceSearchRequest(mockSearchRequest),
        ["BASELINE", "SOUTH_AFRICA"]
      );

      const hash1 = generateEvidenceHash(record1);
      const hash2 = generateEvidenceHash(record2);

      expect(hash1).not.toBe(hash2);
    });

    it("should produce 64-character SHA256 hex string", () => {
      const record = createEvidenceRecord(
        "cmp-123",
        "COMPLETED",
        toEvidenceSearchRequest(mockSearchRequest),
        ["BASELINE"]
      );

      const hash = generateEvidenceHash(record);

      expect(hash).toMatch(/^[a-f0-9]{64}$/);
      expect(hash.length).toBe(64);
    });

    it("should handle record with errors", () => {
      const record = createEvidenceRecord(
        "cmp-123",
        "PARTIAL",
        toEvidenceSearchRequest(mockSearchRequest),
        ["BASELINE", "INDIA"]
      );

      record.errors.push({ location: "INDIA", code: "PROXY_FAILED", message: "Proxy connection failed" });

      const hash = generateEvidenceHash(record);

      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
  });
});
