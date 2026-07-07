import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const EVIDENCE_DIR = process.env.VERCEL
  ? path.join("/tmp", "pms4u", "evidence")
  : path.join(process.cwd(), "evidence");

async function ensureDir(p: string) {
  try {
    await fs.mkdir(p, { recursive: true });
  } catch (e) {}
}

export type InboundEvidenceRecord = {
  id: string;
  sender: string;
  timestamp: string;
  text: string;
  mediaFiles: Array<{ path: string; filename: string; hash: string }>;
  verification: { verified: boolean; method?: string };
  correlation_id: string;
  sha256: string;
  processing?: {
    ignored?: boolean;
    forwarded?: boolean;
    executed?: boolean;
    runtimeDecision?: string | null;
    receiptId?: string | null;
    executionId?: string | null;
    runtimeMs?: number | null;
    updatedAt?: string;
  };
};

export async function readInboundEvidenceRecords(limit = 50): Promise<InboundEvidenceRecord[]> {
  await ensureDir(EVIDENCE_DIR);
  const files = (await fs.readdir(EVIDENCE_DIR).catch(() => []))
    .filter((file) => file.endsWith(".json"))
    .sort()
    .reverse()
    .slice(0, limit);

  const records = await Promise.all(
    files.map(async (file) => {
      const full = path.join(EVIDENCE_DIR, file);
      const raw = await fs.readFile(full, "utf-8");
      return JSON.parse(raw) as InboundEvidenceRecord;
    })
  );

  return records.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}

export async function updateInboundEvidenceRecord(
  id: string,
  patch: Partial<InboundEvidenceRecord>
): Promise<InboundEvidenceRecord | null> {
  await ensureDir(EVIDENCE_DIR);
  const file = path.join(EVIDENCE_DIR, `${id}.json`);
  const raw = await fs.readFile(file, "utf-8").catch(() => null);
  if (!raw) return null;

  const current = JSON.parse(raw) as InboundEvidenceRecord;
  const next: InboundEvidenceRecord = {
    ...current,
    ...patch,
    processing: {
      ...current.processing,
      ...patch.processing,
    },
  };

  await fs.writeFile(file, JSON.stringify(next, null, 2), "utf-8");
  return next;
}

export async function downloadAndStoreMedia(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const ab = await res.arrayBuffer();
    const buf = Buffer.from(ab);
    const hash = crypto.createHash("sha256").update(buf).digest("hex");
    await ensureDir(EVIDENCE_DIR);
    const ext = path.extname(new URL(url).pathname) || ".bin";
    const filename = `${Date.now()}-${hash}${ext}`;
    const full = path.join(EVIDENCE_DIR, filename);
    await fs.writeFile(full, buf);
    return { path: `/evidence/${filename}`, filename, hash };
  } catch (e) {
    return null;
  }
}

export async function saveEvidenceForInbound(opts: {
  sender: string;
  timestamp: string;
  text: string;
  media: string[];
  verification: { verified: boolean; method?: string };
}) {
  await ensureDir(EVIDENCE_DIR);
  const id = `EVID-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const mediaFiles: Array<{ path: string; filename: string; hash: string }> = [];
  for (const m of opts.media || []) {
    try {
      const r = await downloadAndStoreMedia(m);
      if (r) mediaFiles.push(r as any);
    } catch (e) {}
  }

  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify({ sender: opts.sender, timestamp: opts.timestamp, text: opts.text, mediaFiles }))
    .digest("hex");

  const record: InboundEvidenceRecord = {
    id,
    sender: opts.sender,
    timestamp: opts.timestamp,
    text: opts.text,
    mediaFiles,
    verification: opts.verification,
    correlation_id: `corr-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
    sha256: hash,
    processing: {
      updatedAt: new Date().toISOString(),
    },
  };

  const file = path.join(EVIDENCE_DIR, `${id}.json`);
  await fs.writeFile(file, JSON.stringify(record, null, 2), "utf-8");
  return { ...record, mediaFiles };
}

export default { saveEvidenceForInbound, downloadAndStoreMedia };
