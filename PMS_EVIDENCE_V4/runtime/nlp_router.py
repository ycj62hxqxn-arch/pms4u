from __future__ import annotations

import re
import sqlite3
from pathlib import Path
from typing import Any


ROOT = Path.home() / "PMS_EVIDENCE_V4"
DATABASE_FILE = ROOT / "database" / "evidence.db"


class NaturalLanguageRoutingError(ValueError):
    """Raised when a natural-language question cannot be translated safely."""


CONCEPT_ALIASES = {
    "BIG G": "THE_BIG_G",
    "BIG_G": "THE_BIG_G",
    "BIGG": "THE_BIG_G",
    "THE BIG G": "THE_BIG_G",
    "PMS GOVERN": "PMS_GOVERN",
    "PMS GOVERNANCE": "PMS_GOVERN",
    "EXECUTION GOVERNANCE": "EXECUTION_GOVERNANCE",
    "RUNTIME GOVERNANCE": "RUNTIME_GOVERNANCE",
}


DIRECT_GQL_COMMANDS = {
    "WHY",
    "TRACE",
    "COMPARE",
    "LIST",
}


def normalize_text(value: str) -> str:
    """Normalize user text while preserving readable word boundaries."""
    normalized = value.strip().upper()
    normalized = normalized.replace("-", " ")
    normalized = normalized.replace("_", " ")
    normalized = re.sub(r"[^A-Z0-9\s]", " ", normalized)
    normalized = re.sub(r"\s+", " ", normalized)
    return normalized.strip()


def normalize_concept(value: str) -> str:
    """Convert a concept phrase into the canonical governance key format."""
    normalized = normalize_text(value)

    if normalized in CONCEPT_ALIASES:
        return CONCEPT_ALIASES[normalized]

    return normalized.replace(" ", "_")


def load_known_concepts() -> list[str]:
    """Load canonical concept keys from the governance database."""
    if not DATABASE_FILE.exists():
        raise NaturalLanguageRoutingError(
            f"Governance database not found: {DATABASE_FILE}"
        )

    try:
        with sqlite3.connect(DATABASE_FILE) as connection:
            rows = connection.execute(
                """
                SELECT concept_key
                FROM governance_profiles
                ORDER BY LENGTH(concept_key) DESC, concept_key ASC
                """
            ).fetchall()
    except sqlite3.Error as exc:
        raise NaturalLanguageRoutingError(
            f"Could not read governance concepts: {exc}"
        ) from exc

    return [str(row[0]).upper() for row in rows]


def concept_display_form(concept_key: str) -> str:
    return concept_key.replace("_", " ")


def find_concepts(question: str) -> list[str]:
    """
    Find known concepts mentioned in the question.

    Longest concepts are checked first so that EXECUTION_GOVERNANCE
    is preferred over a shorter overlapping phrase.
    """
    normalized_question = f" {normalize_text(question)} "
    matches: list[str] = []

    for alias, canonical in CONCEPT_ALIASES.items():
        normalized_alias = normalize_text(alias)

        if f" {normalized_alias} " in normalized_question:
            if canonical not in matches:
                matches.append(canonical)

    for concept_key in load_known_concepts():
        phrase = concept_display_form(concept_key)

        if f" {phrase} " in normalized_question:
            if concept_key not in matches:
                matches.append(concept_key)

    return matches


def is_direct_gql(question: str) -> bool:
    """
    Treat input as direct GQL only when it follows an exact supported
    command structure. Natural-language questions beginning with WHY,
    such as 'Why is Execution Governance important?', must continue
    through deterministic natural-language routing.
    """
    cleaned = question.strip()
    tokens = cleaned.split()

    if not tokens:
        return False

    command = tokens[0].upper()

    if command == "LIST":
        return len(tokens) in {1, 2}

    if command in {"WHY", "TRACE"}:
        # Direct GQL requires exactly one canonical concept token,
        # normally represented with underscores.
        return (
            len(tokens) == 2
            and re.fullmatch(r"[A-Za-z0-9_]+", tokens[1]) is not None
        )

    if command == "COMPARE":
        return (
            len(tokens) == 3
            and re.fullmatch(r"[A-Za-z0-9_]+", tokens[1]) is not None
            and re.fullmatch(r"[A-Za-z0-9_]+", tokens[2]) is not None
        )

    return False


def normalize_direct_gql(question: str) -> str:
    tokens = normalize_text(question).split()

    if not tokens:
        raise NaturalLanguageRoutingError("Query cannot be empty.")

    command = tokens[0]

    if command == "LIST":
        if len(tokens) == 1 or tokens[1] == "CONCEPTS":
            return "LIST CONCEPTS"

    if command in {"WHY", "TRACE"}:
        if len(tokens) < 2:
            raise NaturalLanguageRoutingError(
                f"{command} requires a concept."
            )

        concept = normalize_concept(" ".join(tokens[1:]))
        return f"{command} {concept}"

    if command == "COMPARE":
        if len(tokens) < 3:
            raise NaturalLanguageRoutingError(
                "COMPARE requires two concepts."
            )

        concepts = find_concepts(question)

        if len(concepts) >= 2:
            return f"COMPARE {concepts[0]} {concepts[1]}"

        raise NaturalLanguageRoutingError(
            "Could not identify two valid concepts for comparison."
        )

    raise NaturalLanguageRoutingError(
        f"Unsupported governance command: {command}"
    )


def translate_question(question: str) -> dict[str, Any]:
    """
    Translate natural language into deterministic Governance Query Language.

    The translator does not answer the question. It only produces a
    validated GQL command for the Stage 10 deterministic engine.
    """
    cleaned_question = question.strip()

    if not cleaned_question:
        raise NaturalLanguageRoutingError(
            "Question cannot be empty."
        )

    if is_direct_gql(cleaned_question):
        gql_query = normalize_direct_gql(cleaned_question)
        intent = gql_query.split()[0]

        return {
            "question": cleaned_question,
            "intent": intent,
            "concepts": find_concepts(cleaned_question),
            "translated_query": gql_query,
            "translation_mode": "DIRECT_GQL",
        }

    normalized = normalize_text(cleaned_question)
    concepts = find_concepts(cleaned_question)

    list_patterns = (
        "LIST CONCEPTS",
        "SHOW CONCEPTS",
        "SHOW ALL CONCEPTS",
        "WHAT CONCEPTS",
        "AVAILABLE CONCEPTS",
    )

    if any(pattern in normalized for pattern in list_patterns):
        return {
            "question": cleaned_question,
            "intent": "LIST",
            "concepts": [],
            "translated_query": "LIST CONCEPTS",
            "translation_mode": "DETERMINISTIC_RULE",
        }

    compare_markers = (
        "COMPARE",
        "DIFFERENCE BETWEEN",
        "DIFFERENCES BETWEEN",
        "VERSUS",
        " VS ",
    )

    if any(marker in f" {normalized} " for marker in compare_markers):
        if len(concepts) < 2:
            raise NaturalLanguageRoutingError(
                "A comparison question must mention two known concepts."
            )

        return {
            "question": cleaned_question,
            "intent": "COMPARE",
            "concepts": concepts[:2],
            "translated_query": (
                f"COMPARE {concepts[0]} {concepts[1]}"
            ),
            "translation_mode": "DETERMINISTIC_RULE",
        }

    trace_markers = (
        "TRACE",
        "PATH",
        "CHAIN",
        "HISTORY",
        "ORIGIN",
        "SHOW TRACE",
    )

    if any(marker in normalized for marker in trace_markers):
        if not concepts:
            raise NaturalLanguageRoutingError(
                "A trace question must mention a known concept."
            )

        return {
            "question": cleaned_question,
            "intent": "TRACE",
            "concepts": [concepts[0]],
            "translated_query": f"TRACE {concepts[0]}",
            "translation_mode": "DETERMINISTIC_RULE",
        }

    why_markers = (
        "WHY",
        "EXPLAIN",
        "WHAT IS",
        "WHAT DOES",
        "TELL ME ABOUT",
        "DESCRIBE",
        "HOW DOES",
    )

    if any(marker in normalized for marker in why_markers):
        if not concepts:
            raise NaturalLanguageRoutingError(
                "The question must mention a known governance concept."
            )

        # Stage 12.1 resolves explanatory questions to the principal
        # concept mentioned in the question.
        principal_concept = concepts[-1]

        return {
            "question": cleaned_question,
            "intent": "WHY",
            "concepts": concepts,
            "translated_query": f"WHY {principal_concept}",
            "translation_mode": "DETERMINISTIC_RULE",
        }

    if len(concepts) == 1:
        return {
            "question": cleaned_question,
            "intent": "WHY",
            "concepts": concepts,
            "translated_query": f"WHY {concepts[0]}",
            "translation_mode": "DETERMINISTIC_FALLBACK",
        }

    raise NaturalLanguageRoutingError(
        "The question could not be translated into a supported "
        "governance command."
    )
