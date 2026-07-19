from pathlib import Path
import json
import sqlite3

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from runtime.decision_receipt import (
    DecisionReceiptError,
    create_decision_receipt,
    persist_decision_receipt,
)
from runtime.gql_bridge import (
    GQLBridgeError,
    execute_governance_query,
)
from runtime.nlp_router import (
    NaturalLanguageRoutingError,
    translate_question,
)


ROOT = Path.home() / "PMS_EVIDENCE_V4"
DB = ROOT / "database" / "evidence.db"


app = FastAPI(
    title="Governance Runtime API",
    version="0.2.0",
)


class QueryRequest(BaseModel):
    query: str = Field(
        ...,
        min_length=1,
        examples=["WHY EXECUTION_GOVERNANCE"],
    )


class ChatRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=1,
        examples=["Why is Execution Governance important?"],
    )


CONCEPT_ALIASES = {
    "BIG_G": "THE_BIG_G",
    "BIGG": "THE_BIG_G",
    "THE_BIGG": "THE_BIG_G",
    "PMS_GOVERNANCE": "PMS_GOVERN",
}


def normalize_concept(value: str) -> str:
    key = (
        value.strip()
        .upper()
        .replace("-", "_")
        .replace(" ", "_")
    )

    return CONCEPT_ALIASES.get(key, key)


def _c() -> sqlite3.Connection:
    connection = sqlite3.connect(DB)
    connection.row_factory = sqlite3.Row
    return connection


def _d(row: sqlite3.Row) -> dict:
    data = dict(row)

    for key, value in list(data.items()):
        if isinstance(value, str):
            try:
                data[key] = json.loads(value)
            except (json.JSONDecodeError, TypeError):
                pass

    return data


@app.get("/")
def root():
    return {
        "status": "UP",
        "service": "Governance Runtime API",
        "version": app.version,
        "gql_connected": True,
        "natural_language_router": True,
        "decision_receipts": True,
    }


@app.get("/health")
def health():
    with _c() as connection:
        governance_profiles = connection.execute(
            "SELECT COUNT(*) FROM governance_profiles"
        ).fetchone()[0]

        concept_explanations = connection.execute(
            "SELECT COUNT(*) FROM concept_explanations"
        ).fetchone()[0]

    return {
        "status": "UP",
        "database": str(DB),
        "governance_profiles": governance_profiles,
        "concept_explanations": concept_explanations,
    }


@app.get("/concept/{concept}")
def get_concept(concept: str):
    concept_key = normalize_concept(concept)

    with _c() as connection:
        row = connection.execute(
            """
            SELECT *
            FROM governance_profiles
            WHERE concept_key = ?
            """,
            (concept_key,),
        ).fetchone()

    if not row:
        raise HTTPException(
            status_code=404,
            detail=f"Concept not found: {concept_key}",
        )

    return _d(row)


@app.get("/trace/{concept}")
def get_trace(concept: str):
    concept_key = normalize_concept(concept)

    with _c() as connection:
        row = connection.execute(
            """
            SELECT *
            FROM concept_explanations
            WHERE concept_key = ?
            """,
            (concept_key,),
        ).fetchone()

    if not row:
        raise HTTPException(
            status_code=404,
            detail=f"Concept not found: {concept_key}",
        )

    return _d(row)


@app.post("/query")
def query(request: QueryRequest):
    try:
        return execute_governance_query(request.query)

    except GQLBridgeError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc


@app.post("/chat")
def chat(request: ChatRequest):
    try:
        translation = translate_question(request.question)

        answer = execute_governance_query(
            translation["translated_query"]
        )

        receipt = create_decision_receipt(
            question=request.question,
            intent=translation["intent"],
            concepts=translation["concepts"],
            translated_query=translation["translated_query"],
            translation_mode=translation["translation_mode"],
            answer=answer,
        )

        persist_decision_receipt(receipt)

        return {
            "status": "EXECUTED",
            "question": request.question,
            "intent": translation["intent"],
            "concepts": translation["concepts"],
            "translated_query": translation["translated_query"],
            "translation_mode": translation["translation_mode"],
            "answer": answer,
            "receipt": receipt,
        }

    except (
        NaturalLanguageRoutingError,
        GQLBridgeError,
        DecisionReceiptError,
    ) as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc
