import importlib

from fastapi.testclient import TestClient


runtime_module = importlib.import_module(
    "runtime.11_governance_runtime_api"
)

client = TestClient(runtime_module.app)


def test_root_reports_gql_connected():
    response = client.get("/")

    assert response.status_code == 200

    payload = response.json()

    assert payload["status"] == "UP"
    assert payload["gql"] == "CONNECTED"


def test_query_requires_query_field():
    response = client.post(
        "/query",
        json={
            "question":
            "Why is Execution Governance important?"
        },
    )

    assert response.status_code == 422


def test_chat_accepts_natural_language():
    response = client.post(
        "/chat",
        json={
            "question":
            "Why is Execution Governance important?"
        },
    )

    assert response.status_code == 200

    payload = response.json()

    assert payload["status"] == "EXECUTED"
    assert payload["intent"] == "WHY"
    assert payload["translated_query"] == (
        "WHY EXECUTION_GOVERNANCE"
    )

    assert payload["answer"]["status"] == "EXECUTED"
    assert payload["answer"]["command"] == "WHY"


def test_chat_rejects_empty_question():
    response = client.post(
        "/chat",
        json={"question": ""},
    )

    assert response.status_code == 422


def test_chat_rejects_unknown_question():
    response = client.post(
        "/chat",
        json={
            "question":
            "Tell me something unrelated to governance"
        },
    )

    assert response.status_code == 400
