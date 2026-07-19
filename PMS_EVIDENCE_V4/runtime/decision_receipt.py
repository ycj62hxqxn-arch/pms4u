from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4


RECEIPT_LEDGER_PATH = Path("runtime/evidence/decision_receipts.jsonl")
RECEIPT_VERSION = "NGR-RECEIPT-1.0"


class DecisionReceiptError(Exception):
    """Raised when a governance decision receipt cannot be created."""


def utc_timestamp() -> str:
    return datetime.now(timezone.utc).isoformat()


def canonical_json(payload: dict[str, Any]) -> str:
    return json.dumps(
        payload,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    )


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def create_decision_receipt(
    *,
    question: str,
    intent: str,
    concepts: list[str],
    translated_query: str,
    translation_mode: str,
    answer: dict[str, Any],
) -> dict[str, Any]:
    if not question.strip():
        raise DecisionReceiptError("Question cannot be empty.")

    receipt_body = {
        "receipt_version": RECEIPT_VERSION,
        "receipt_id": f"ngr_{uuid4().hex}",
        "timestamp_utc": utc_timestamp(),
        "question": question,
        "intent": intent,
        "concepts": concepts,
        "translated_query": translated_query,
        "translation_mode": translation_mode,
        "execution_status": answer.get("status"),
        "answer": answer,
    }

    receipt_body["receipt_hash"] = sha256_text(
        canonical_json(receipt_body)
    )

    return receipt_body


def persist_decision_receipt(
    receipt: dict[str, Any],
    *,
    ledger_path: Path = RECEIPT_LEDGER_PATH,
) -> Path:
    ledger_path.parent.mkdir(parents=True, exist_ok=True)

    with ledger_path.open("a", encoding="utf-8") as handle:
        handle.write(canonical_json(receipt))
        handle.write("\n")

    return ledger_path