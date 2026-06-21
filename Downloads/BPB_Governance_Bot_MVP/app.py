from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel, Field

from governance_bot import governance_bot

BASE_DIR = Path(__file__).resolve().parent
FAQ_PATH = BASE_DIR / "config" / "faqs.json"

app = FastAPI(title="BPB Governance Bot MVP", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://aegyptenhautnah.com",
        "https://www.aegyptenhautnah.com",
        "https://gtcs4u.com",
        "https://www.gtcs4u.com",
        "*",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def send_telegram_alert(text: str) -> bool:
    token = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = os.getenv("TELEGRAM_CHAT_ID", "").strip()

    if not token or not chat_id:
        return False

    api_url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = urlencode({"chat_id": chat_id, "text": text, "parse_mode": "HTML"}).encode("utf-8")
    req = Request(api_url, data=payload, method="POST")

    try:
        with urlopen(req, timeout=10) as resp:
            return 200 <= getattr(resp, "status", 500) < 300
    except Exception:
        return False


def send_whatsapp_message(to_phone: str, text: str) -> bool:
    token = os.getenv("WHATSAPP_TOKEN", "").strip()
    phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "").strip()
    api_version = os.getenv("WHATSAPP_GRAPH_VERSION", "v20.0").strip()

    if not token or not phone_number_id:
        return False

    url = f"https://graph.facebook.com/{api_version}/{phone_number_id}/messages"
    body = {
        "messaging_product": "whatsapp",
        "to": to_phone,
        "type": "text",
        "text": {"body": text[:4000]},
    }

    req = Request(url, data=json.dumps(body).encode("utf-8"), method="POST")
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")

    try:
        with urlopen(req, timeout=12) as resp:
            return 200 <= getattr(resp, "status", 500) < 300
    except Exception:
        return False


def load_faqs() -> dict[str, str]:
    if not FAQ_PATH.exists():
        return {}
    return json.loads(FAQ_PATH.read_text(encoding="utf-8"))


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)


class GovernRequest(BaseModel):
    authority: bool
    evidence: bool
    risk: str = Field(default="low")
    payload: dict[str, Any] = Field(default_factory=dict)


class EventRequest(BaseModel):
    event_type: str = Field(..., min_length=2)
    message: str = Field(..., min_length=2)
    meta: dict[str, Any] = Field(default_factory=dict)


class WhatsAppSendRequest(BaseModel):
    to: str = Field(..., min_length=8)
    message: str = Field(..., min_length=1)


class LeadRequest(BaseModel):
    name: str = Field(default="")
    contact: str = Field(default="")
    service: str = Field(default="general")
    source: str = Field(default="website")
    message: str = Field(..., min_length=1)
    meta: dict[str, Any] = Field(default_factory=dict)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat")
def chat(req: ChatRequest) -> dict[str, str]:
    msg = req.message.lower().strip()
    faqs = load_faqs()

    for key, answer in faqs.items():
        if key in msg:
            return {"reply": answer}

    send_telegram_alert(
        "\n".join(
            [
                "<b>NEW LEAD</b>",
                f"Time: {now_iso()}",
                f"Message: {req.message[:500]}",
            ]
        )
    )

    return {
        "reply": "Thanks. Your request is captured. A BPB agent will follow up.",
    }


@app.post("/governance/check")
def govern(req: GovernRequest) -> dict[str, str]:
    decision = governance_bot(req.model_dump())
    send_telegram_alert(
        "\n".join(
            [
                "<b>GOVERNANCE DECISION</b>",
                f"Time: {now_iso()}",
                f"Decision: {decision}",
                f"Risk: {req.risk}",
            ]
        )
    )
    return {"decision": decision}


@app.post("/telegram/webhook")
def telegram_webhook(payload: dict[str, Any]) -> dict[str, str]:
    # Minimal webhook processing for /status command
    message = ((payload.get("message") or {}).get("text") or "").strip().lower()
    if message == "/status":
        send_telegram_alert("<b>BPB BOT STATUS</b>\nService is running.")
    return {"status": "received"}


@app.post("/events/notify")
def notify_event(req: EventRequest) -> dict[str, Any]:
    text = "\n".join(
        [
            f"<b>{req.event_type.upper()}</b>",
            f"Time: {now_iso()}",
            f"Message: {req.message}",
            f"Meta: {json.dumps(req.meta, ensure_ascii=False)[:1200]}",
        ]
    )
    sent = send_telegram_alert(text)
    return {"sent": sent}


@app.get("/whatsapp/webhook", response_class=PlainTextResponse)
def whatsapp_webhook_verify(
    hub_mode: str = Query(alias="hub.mode"),
    hub_verify_token: str = Query(alias="hub.verify_token"),
    hub_challenge: str = Query(alias="hub.challenge"),
) -> str:
    verify_token = os.getenv("WHATSAPP_VERIFY_TOKEN", "").strip()
    if hub_mode == "subscribe" and verify_token and hub_verify_token == verify_token:
        return hub_challenge
    raise HTTPException(status_code=403, detail="Webhook verification failed")


@app.post("/whatsapp/webhook")
def whatsapp_webhook(payload: dict[str, Any]) -> dict[str, Any]:
    # Minimal inbound processor for text messages
    entries = payload.get("entry") or []
    processed = 0

    for entry in entries:
        for change in entry.get("changes") or []:
            value = change.get("value") or {}
            messages = value.get("messages") or []
            contacts = value.get("contacts") or []
            profile_name = (((contacts[0] if contacts else {}).get("profile") or {}).get("name") or "").strip()

            for msg in messages:
                if msg.get("type") != "text":
                    continue
                wa_from = (msg.get("from") or "").strip()
                text_body = (((msg.get("text") or {}).get("body")) or "").strip()
                if not wa_from or not text_body:
                    continue

                q = text_body.lower()
                faqs = load_faqs()
                reply = "Thanks. We received your WhatsApp message. A BPB agent will contact you shortly."

                for key, answer in faqs.items():
                    if key in q:
                        reply = answer
                        break

                # booking flow shortcut
                if any(k in q for k in ["book", "booking", "حجز"]):
                    reply = (
                        "To confirm booking, send: Full Name, Phone, Service (PMS4U/GTCS4U/Carshunter), preferred date/time."
                    )

                send_whatsapp_message(wa_from, reply)
                send_telegram_alert(
                    "\n".join(
                        [
                            "<b>WHATSAPP NEW MESSAGE</b>",
                            f"Time: {now_iso()}",
                            f"From: {wa_from}",
                            f"Name: {profile_name or '-'}",
                            f"Text: {text_body[:800]}",
                        ]
                    )
                )
                processed += 1

    return {"status": "received", "processed": processed}


@app.post("/whatsapp/send")
def whatsapp_send(req: WhatsAppSendRequest) -> dict[str, Any]:
    sent = send_whatsapp_message(req.to, req.message)
    if not sent:
        raise HTTPException(status_code=500, detail="WhatsApp send failed or not configured")
    return {"sent": True}


@app.post("/leads/collect")
def collect_lead(req: LeadRequest) -> dict[str, Any]:
    text = "\n".join(
        [
            "<b>NEW WEBSITE LEAD</b>",
            f"Time: {now_iso()}",
            f"Source: {req.source}",
            f"Service: {req.service}",
            f"Name: {req.name or '-'}",
            f"Contact: {req.contact or '-'}",
            f"Message: {req.message[:1200]}",
            f"Meta: {json.dumps(req.meta, ensure_ascii=False)[:1000]}",
        ]
    )
    tg_sent = send_telegram_alert(text)
    return {"saved": True, "telegram_sent": tg_sent}
