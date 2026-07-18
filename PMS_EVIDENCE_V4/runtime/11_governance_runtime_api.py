from __future__ import annotations

from pathlib import Path
import json
import sqlite3

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from runtime.gql_bridge import (
    GQLBridgeError,
    execute_governance_query,
)


ROOT = Path.home() / "PMS_EVIDENCE_V4"
DB = ROOT / "database" / "evidence.db"

app = FastAPI(
    title="Governance Runtime API",
    description=(
        "Deterministic runtime interface for PMS4U governance "
        "profiles, explanations, traces, and Governance Query Language."
    ),
    version="0.1.1",
)


class QueryRequest(BaseModel):
    query: str = Field(
        ...,
        min_length=1,
        examples=["WHY EXECUTION_GOVERNANCE"],
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


def _connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB)
    connection.row_factory = sqlite3.Row
    return connection


def _deserialize_row(row: sqlite3.Row) -> dict:
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
        "gql": "CONNECTED",
    }


@app.get("/health")
def health():
    if not DB.exists():
        raise HTTPException(
            status_code=503,
            detail=f"Database not found: {DB}",
        )

    try:
        with _connection() as connection:
            governance_profiles = connection.execute(
                "SELECT COUNT(*) FROM governance_profiles"
            ).fetchone()[0]

            concept_explanations = connection.execute(
                "SELECT COUNT(*) FROM concept_explanations"
            ).fetchone()[0]

    except sqlite3.Error as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Database unavailable: {exc}",
        ) from exc

    return {
        "status": "UP",
        "database": "CONNECTED",
        "gql_engine": "CONNECTED",
        "governance_profiles": governance_profiles,
        "concept_explanations": concept_explanations,
    }


@app.get("/concept/{concept}")
def get_concept(concept: str):
    concept_key = normalize_concept(concept)

    with _connection() as connection:
        row = connection.execute(
            """
            SELECT *
            FROM governance_profiles
            WHERE concept_key = ?
            """,
            (concept_key,),
        ).fetchone()

    if row is None:
        raise HTTPException(
            status_code=404,
            detail=f"Concept not found: {concept_key}",
        )

    return _deserialize_row(row)


@app.get("/trace/{concept}")
def get_trace(concept: str):
    concept_key = normalize_concept(concept)

    with _connection() as connection:
        row = connection.execute(
            """
            SELECT *
            FROM concept_explanations
            WHERE concept_key = ?
            """,
            (concept_key,),
        ).fetchone()

    if row is None:
        raise HTTPException(
            status_code=404,
            detail=f"Concept trace not found: {concept_key}",
        )

    return _deserialize_row(row)


@app.post("/query")
def execute_query(request: QueryRequest):
    try:
        return execute_governance_query(request.query)

    except GQLBridgeError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc
