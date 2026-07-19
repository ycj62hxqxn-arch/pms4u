import importlib

from fastapi.testclient import TestClient


module = importlib.import_module(
    "runtime.11_governance_runtime_api"
)

client = TestClient(module.app)


def test_root_reports_gql_connected():
    response = client.get("/")

    assert response.status_code == 200


def test_query_requires_query_field():
    response = client.post(
        "/query",
        json={},
    )

    assert response.status_code == 422


def test_chat_accepts_natural_language():
    response = client.post(
        "/chat",
        json={
            "question": "Why is Execution Governance important?"
        },
    )

    assert response.status_code == 200

    payload = response.json()

    assert payload["status"] == "EXECUTED"
    assert payload["intent"] == "WHY"
    assert payload["concepts"] == [
        "EXECUTION_GOVERNANCE"
    ]
    assert (
        payload["translated_query"]
        == "WHY EXECUTION_GOVERNANCE"
    )
    assert (
        payload["translation_mode"]
        == "DETERMINISTIC_RULE"
    )

    receipt = payload["receipt"]

    assert (
        receipt["receipt_version"]
        == "NGR-RECEIPT-1.0"
    )
    assert (
        receipt["execution_status"]
        == "EXECUTED"
    )
    assert receipt["receipt_id"].startswith("ngr_")
    assert len(receipt["receipt_hash"]) == 64


def test_chat_rejects_empty_question():
    response = client.post(
        "/chat",
        json={
            "question": ""
        },
    )

    assert response.status_code == 422


def test_chat_rejects_unknown_question():
    response = client.post(
        "/chat",
        json={
            "question": "Tell me something unrelated"
        },
    )

    assert response.status_code == 400
