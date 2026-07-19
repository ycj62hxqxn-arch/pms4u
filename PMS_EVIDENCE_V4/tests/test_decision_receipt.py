from pathlib import Path

from runtime.decision_receipt import (
    create_decision_receipt,
    persist_decision_receipt,
)


def test_create_decision_receipt():
    receipt = create_decision_receipt(
        question="Why is Execution Governance important?",
        intent="WHY",
        concepts=["EXECUTION_GOVERNANCE"],
        translated_query="WHY EXECUTION_GOVERNANCE",
        translation_mode="DETERMINISTIC_RULE",
        answer={
            "status": "EXECUTED",
            "command": "WHY",
        },
    )

    assert receipt["receipt_version"] == "NGR-RECEIPT-1.0"
    assert receipt["execution_status"] == "EXECUTED"
    assert len(receipt["receipt_hash"]) == 64
    assert receipt["receipt_id"].startswith("ngr_")


def test_persist_decision_receipt(tmp_path: Path):
    ledger = tmp_path / "decision_receipts.jsonl"

    receipt = create_decision_receipt(
        question="Explain EGA",
        intent="WHY",
        concepts=["EGA"],
        translated_query="WHY EGA",
        translation_mode="DETERMINISTIC_RULE",
        answer={
            "status": "EXECUTED",
            "command": "WHY",
        },
    )

    persist_decision_receipt(
        receipt,
        ledger_path=ledger,
    )

    content = ledger.read_text(encoding="utf-8")

    assert receipt["receipt_id"] in content
    assert receipt["receipt_hash"] in content