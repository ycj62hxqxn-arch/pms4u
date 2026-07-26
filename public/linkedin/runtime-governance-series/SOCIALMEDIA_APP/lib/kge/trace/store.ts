import fs from "node:fs/promises";
import path from "node:path";
import { hashReasoningTrace } from "./hash";
import type { PersistedReasoningTrace, PersistReasoningTraceInput } from "./types";

const ledgerPath = process.env.KGE_TRACE_LEDGER_PATH ?? path.join(process.cwd(), "data", "kge_reasoning_traces.jsonl");
let writeQueue: Promise<void> = Promise.resolve();

async function ensureLedger() {
  await fs.mkdir(path.dirname(ledgerPath), { recursive: true });
  try { await fs.access(ledgerPath); } catch { await fs.writeFile(ledgerPath, "", "utf8"); }
}

export async function readReasoningTraces(): Promise<PersistedReasoningTrace[]> {
  await ensureLedger();
  const body = await fs.readFile(ledgerPath, "utf8");
  return body.split("\n").filter(Boolean).flatMap((line) => {
    try { return [JSON.parse(line) as PersistedReasoningTrace]; } catch { return []; }
  }).sort((a, b) => new Date(b.persistedAt).getTime() - new Date(a.persistedAt).getTime());
}

export async function persistReasoningTrace(input: PersistReasoningTraceInput): Promise<PersistedReasoningTrace> {
  const persistedAt = new Date().toISOString();
  const unhashed = { ...input, persistedAt };
  const traceHash = hashReasoningTrace(unhashed as unknown as Record<string, unknown>);
  const trace: PersistedReasoningTrace = { ...unhashed, traceHash };
  writeQueue = writeQueue.then(async () => {
    await ensureLedger();
    await fs.appendFile(ledgerPath, `${JSON.stringify(trace)}\n`, "utf8");
  });
  await writeQueue;
  return trace;
}

export async function findReasoningTraceById(traceId: string) {
  return (await readReasoningTraces()).find((trace) => trace.traceId === traceId) ?? null;
}

export async function findReasoningTraceByPostId(postId: string) {
  return (await readReasoningTraces()).find((trace) => trace.postId === postId) ?? null;
}

export function verifyReasoningTraceHash(trace: PersistedReasoningTrace): boolean {
  const { traceHash, ...unhashed } = trace;
  return hashReasoningTrace(unhashed as unknown as Record<string, unknown>) === traceHash;
}
