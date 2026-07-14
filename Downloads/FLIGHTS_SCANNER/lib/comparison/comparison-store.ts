import { ComparisonResult } from "./comparison-runner";

export type ComparisonRecordStatus =
  | "DRAFT"
  | "RUNNING"
  | "COMPLETED"
  | "PARTIAL"
  | "FAILED"
  | "INVALID_LOCATION";

export interface ComparisonRecord {
  status: ComparisonRecordStatus;
  createdAt: Date;
  result?: ComparisonResult | Record<string, unknown>;
}

declare global {
  var __flightComparisonStore:
    | Map<string, ComparisonRecord>
    | undefined;
}

const store = globalThis.__flightComparisonStore ?? new Map<string, ComparisonRecord>();
if (!globalThis.__flightComparisonStore) {
  globalThis.__flightComparisonStore = store;
}

export function setComparisonRecord(id: string, record: ComparisonRecord) {
  store.set(id, record);
}

export function getComparisonRecord(id: string) {
  return store.get(id);
}

export function hasComparisonRecord(id: string) {
  return store.has(id);
}

export function clearComparisonStore() {
  store.clear();
}
