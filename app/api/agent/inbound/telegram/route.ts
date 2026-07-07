import { NextRequest, NextResponse } from "next/server";
import { saveEvidenceForInbound, updateInboundEvidenceRecord } from "../../../../../lib/evidence";

type TelegramMessage = {
  message_id?: number;
  date?: number;
  text?: string;
  caption?: string;
  from?: { id?: number; username?: string; first_name?: string; last_name?: string };
  chat?: { id?: number; type?: string; title?: string; username?: string };
  photo?: Array<{ file_id: string; file_unique_id?: string; width?: number; height?: number; file_size?: number }>;
  document?: { file_id: string; file_name?: string; mime_type?: string; file_size?: number };
  video?: { file_id: string };
  audio?: { file_id: string };
  voice?: { file_id: string };
  animation?: { file_id: string };
};

type TelegramUpdate = {
  update_id?: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  channel_post?: TelegramMessage;
};

async function forwardToAgent(payload: unknown) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://pms4u.vercel.app"}/api/agent/inbound`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok ? await res.json().catch(() => null) : null;
  } catch {
    return null;
  }
}

function looksLikeCarshunter(text?: string) {
  if (!text) return false;
  const t = text.toLowerCase();
  return (
    t.includes("carshunter") ||
    t.includes("car hunter") ||
    t.includes("listing") ||
    t.includes("vehicle") ||
    t.includes("export") ||
    t.includes("bmw") ||
    t.includes("vin")
  );
}

async function resolveTelegramFileUrl(fileId: string, botToken: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${encodeURIComponent(fileId)}`);
    if (!res.ok) return null;
    const data = (await res.json().catch(() => null)) as { ok?: boolean; result?: { file_path?: string } } | null;
    const filePath = data?.ok ? data?.result?.file_path : undefined;
    if (!filePath) return null;
    return `https://api.telegram.org/file/bot${botToken}/${filePath}`;
  } catch {
    return null;
  }
}

async function collectMediaUrls(message: TelegramMessage, botToken?: string) {
  if (!botToken) return [] as string[];

  const fileIds: string[] = [];

  if (Array.isArray(message.photo) && message.photo.length > 0) {
    const largest = message.photo[message.photo.length - 1];
    if (largest?.file_id) fileIds.push(largest.file_id);
  }

  if (message.document?.file_id) fileIds.push(message.document.file_id);
  if (message.video?.file_id) fileIds.push(message.video.file_id);
  if (message.audio?.file_id) fileIds.push(message.audio.file_id);
  if (message.voice?.file_id) fileIds.push(message.voice.file_id);
  if (message.animation?.file_id) fileIds.push(message.animation.file_id);

  const urls = await Promise.all(fileIds.map((fileId) => resolveTelegramFileUrl(fileId, botToken)));
  return urls.filter((x): x is string => Boolean(x));
}

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const raw = await request.text().catch(() => "{}");
    const payload = (raw ? JSON.parse(raw) : {}) as TelegramUpdate;
    const secretHeader = request.headers.get("x-telegram-bot-api-secret-token");
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

    const verified = expectedSecret ? secretHeader === expectedSecret : true;
    if (expectedSecret && !verified) {
      return NextResponse.json({ ok: false, reason: "invalid telegram webhook secret" }, { status: 401 });
    }

    const message = payload.message ?? payload.edited_message ?? payload.channel_post;
    if (!message) {
      return NextResponse.json({ ok: true, ignored: true, reason: "no message payload" });
    }

    const fromId = message.from?.id?.toString() ?? message.chat?.id?.toString() ?? "unknown";
    const fromHandle = message.from?.username ?? message.chat?.username ?? "unknown";
    const fromName = [message.from?.first_name, message.from?.last_name].filter(Boolean).join(" ").trim();
    const body = (message.text ?? message.caption ?? "").toString();

    const mediaUrls = await collectMediaUrls(message, process.env.TELEGRAM_BOT_TOKEN);

    const evidence = await saveEvidenceForInbound({
      sender: `telegram:${fromId}${fromHandle ? ` (@${fromHandle})` : ""}${fromName ? ` ${fromName}` : ""}`,
      timestamp: new Date((message.date ?? Math.floor(Date.now() / 1000)) * 1000).toISOString(),
      text: body,
      media: mediaUrls,
      verification: {
        verified,
        method: expectedSecret ? "telegram-secret-token" : "none",
      },
    });

    if (!looksLikeCarshunter(body)) {
      await updateInboundEvidenceRecord(evidence.id, {
        processing: {
          ignored: true,
          forwarded: false,
          executed: false,
          runtimeDecision: null,
          receiptId: null,
          executionId: null,
          runtimeMs: null,
          updatedAt: new Date().toISOString(),
        },
      });
      return NextResponse.json({ ok: true, ignored: true, evidenceId: evidence.id });
    }

    const forwardPayload = {
      actorId: `telegram:${fromId}`,
      actorRole: "external-operator",
      useCase: "carshunter-inbound-telegram",
      targetSystem: "carshunter-cloud-run",
      requestedAction: "ingest-telegram-message",
      prompt: body,
      receivedAt: new Date().toISOString(),
      attachments: evidence.mediaFiles || [],
      evidenceId: evidence.id,
      raw: payload,
    };

    const startedAt = Date.now();
    const agentResp = await forwardToAgent(forwardPayload);
    const runtimeMs = Date.now() - startedAt;

    await updateInboundEvidenceRecord(evidence.id, {
      processing: {
        ignored: false,
        forwarded: !!agentResp,
        executed: Boolean(agentResp?.status === "executed" || agentResp?.decision === "ALLOW"),
        runtimeDecision: agentResp?.decision ?? null,
        receiptId: agentResp?.receipt?.executionId ?? agentResp?.executionId ?? null,
        executionId: agentResp?.executionId ?? null,
        runtimeMs,
        updatedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({ ok: true, forwarded: !!agentResp, evidenceId: evidence.id, agentResp });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}

export const GET = () => NextResponse.json({ ok: true, msg: "telegram inbound endpoint" });
