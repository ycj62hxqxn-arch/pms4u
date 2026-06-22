import { createHash, randomUUID } from "node:crypto";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

export type LedgerKind =
  | "INBOUND_REQUEST"
  | "AUTHORITY_CHECK"
  | "ADMISSIBILITY_CHECK"
  | "PMS_GATE_DECISION"
  | "AGENT_PROMPT"
  | "AGENT_TOOL_CALL"
  | "AGENT_TOOL_RESULT"
  | "AGENT_PLAN"
  | "AGENT_SKIPPED"
  | "EVIDENCE_RECORD"
  | "SIGNED_RECEIPT";

export type LedgerEntry = {
  eventId: string;
  timestamp: string;
  kind: LedgerKind;
  executionId: string;
  payload: Record<string, unknown>;
  previousHash: string;
  hash: string;
};

const FILE_LEDGER_PATH =
  process.env.PMS_LEDGER_PATH ??
  (process.env.VERCEL
    ? path.join("/tmp", "pms4u", "agent_execution_log.jsonl")
    : path.join(process.cwd(), "governance-core", "agent_execution_log.jsonl"));

const KV_LEDGER_KEY = process.env.PMS_LEDGER_KV_KEY ?? "pms4u:agent_execution_log";

type LedgerBackend = "kv" | "file";

type RedisClient = {
  lrange: (key: string, start: number, end: number) => Promise<unknown[]>;
  rpush: (key: string, value: string) => Promise<unknown>;
};

function getKvUrl(): string | undefined {
  return (
    process.env.KV_REST_API_URL ??
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL
  );
}

function getKvToken(): string | undefined {
  return (
    process.env.KV_REST_API_TOKEN ??
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN
  );
}

async function getRedisClient(): Promise<RedisClient> {
  const { Redis } = await import("@upstash/redis");

  const url = getKvUrl();
  const token = getKvToken();
  if (!url || !token) {
    throw new Error("KV/Redis environment variables are missing.");
  }

  return new Redis({ url, token });
}

function resolveBackend(): LedgerBackend {
  if (process.env.PMS_LEDGER_BACKEND === "file") {
    return "file";
  }

  if (process.env.PMS_LEDGER_BACKEND === "kv") {
    return "kv";
  }

  if (getKvUrl() && getKvToken()) {
    return "kv";
  }

  return "file";
}

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

function parseEntriesFromJsonLines(raw: string): LedgerEntry[] {
  return raw
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as LedgerEntry);
}

export function getLedgerReference(): string {
  return resolveBackend() === "kv" ? `kv:${KV_LEDGER_KEY}` : FILE_LEDGER_PATH;
}

async function readAllFromFile(): Promise<LedgerEntry[]> {
  const raw = await readFile(FILE_LEDGER_PATH, "utf8").catch(() => "");
  return parseEntriesFromJsonLines(raw);
}

async function appendToFile(entry: LedgerEntry): Promise<void> {
  await mkdir(path.dirname(FILE_LEDGER_PATH), { recursive: true });
  await appendFile(FILE_LEDGER_PATH, `${JSON.stringify(entry)}\n`, "utf8");
}

async function readAllFromKv(): Promise<LedgerEntry[]> {
  const redis = await getRedisClient();
  const rows = await redis.lrange(KV_LEDGER_KEY, 0, -1);
  return rows.map((row) => {
    if (typeof row === "string") {
      return JSON.parse(row) as LedgerEntry;
    }

    return row as LedgerEntry;
  });
}

async function appendToKv(entry: LedgerEntry): Promise<void> {
  const redis = await getRedisClient();
  await redis.rpush(KV_LEDGER_KEY, JSON.stringify(entry));
}

export async function readAllLedgerEntries(): Promise<LedgerEntry[]> {
  if (resolveBackend() === "kv") {
    return readAllFromKv();
  }

  return readAllFromFile();
}

export async function appendLedgerEntry(
  executionId: string,
  kind: LedgerKind,
  payload: Record<string, unknown>
): Promise<LedgerEntry> {
  const entries = await readAllLedgerEntries();
  const previousHash = entries.length > 0 ? entries[entries.length - 1].hash : "GENESIS";

  const eventId = randomUUID();
  const timestamp = new Date().toISOString();
  const hash = sha256(JSON.stringify({ eventId, timestamp, kind, executionId, payload, previousHash }));

  const entry: LedgerEntry = {
    eventId,
    timestamp,
    kind,
    executionId,
    payload,
    previousHash,
    hash,
  };

  if (resolveBackend() === "kv") {
    await appendToKv(entry);
  } else {
    await appendToFile(entry);
  }

  return entry;
}
