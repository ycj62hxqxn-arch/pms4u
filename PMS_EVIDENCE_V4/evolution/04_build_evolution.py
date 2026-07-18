from __future__ import annotations

import hashlib
import sqlite3
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path.home() / "PMS_EVIDENCE_V4"
DATABASE_FILE = ROOT / "database" / "evidence.db"


def normalize_text(text: str) -> str:
    return " ".join(text.lower().split())


def fingerprint(text: str) -> str:
    normalized = normalize_text(text)

    return hashlib.sha256(
        normalized.encode("utf-8")
    ).hexdigest()


def load_concepts(
    connection: sqlite3.Connection,
) -> list[str]:
    rows = connection.execute(
        """
        SELECT DISTINCT concept_key
        FROM concept_hits
        ORDER BY concept_key
        """
    ).fetchall()

    return [row[0] for row in rows]


def load_commit_history(
    connection: sqlite3.Connection,
    concept_key: str,
) -> list[tuple[int, str, str, str]]:
    return connection.execute(
        """
        SELECT
            ch.repository_id,
            ch.commit_hash,
            c.author_date,
            GROUP_CONCAT(
                ch.matched_text,
                CHAR(10)
            ) AS evidence_text
        FROM concept_hits ch
        JOIN commits c
            ON c.hash = ch.commit_hash
        WHERE ch.concept_key = ?
        GROUP BY
            ch.repository_id,
            ch.commit_hash,
            c.author_date
        ORDER BY
            c.author_date,
            ch.commit_hash,
            ch.repository_id
        """,
        (concept_key,),
    ).fetchall()


def insert_event(
    connection: sqlite3.Connection,
    *,
    concept_key: str,
    repository_id: int,
    commit_hash: str,
    author_date: str,
    event_type: str,
    previous_commit: str | None,
    evidence_fingerprint: str,
    summary: str,
) -> None:
    connection.execute(
        """
        INSERT INTO concept_evolution (
            concept_key,
            repository_id,
            commit_hash,
            author_date,
            event_type,
            previous_commit,
            fingerprint,
            summary,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            concept_key,
            repository_id,
            commit_hash,
            author_date,
            event_type,
            previous_commit,
            evidence_fingerprint,
            summary,
            datetime.now(timezone.utc).isoformat(),
        ),
    )


def build_concept_evolution(
    connection: sqlite3.Connection,
    concept_key: str,
) -> int:
    history = load_commit_history(
        connection,
        concept_key,
    )

    previous_fingerprint: str | None = None
    previous_commit: str | None = None
    inserted = 0

    for (
        repository_id,
        commit_hash,
        author_date,
        evidence_text,
    ) in history:
        current_fingerprint = fingerprint(
            evidence_text or ""
        )

        if previous_fingerprint is None:
            event_type = "FIRST_APPEARANCE"
            summary = (
                f"{concept_key} first detected in "
                f"commit {commit_hash[:7]}"
            )
        elif current_fingerprint != previous_fingerprint:
            event_type = "CHANGED"
            summary = (
                f"{concept_key} evidence changed from "
                f"{previous_commit[:7] if previous_commit else 'none'} "
                f"to {commit_hash[:7]}"
            )
        else:
            event_type = "UNCHANGED"
            summary = (
                f"{concept_key} evidence unchanged in "
                f"commit {commit_hash[:7]}"
            )

        insert_event(
            connection,
            concept_key=concept_key,
            repository_id=repository_id,
            commit_hash=commit_hash,
            author_date=author_date,
            event_type=event_type,
            previous_commit=previous_commit,
            evidence_fingerprint=current_fingerprint,
            summary=summary,
        )

        previous_fingerprint = current_fingerprint
        previous_commit = commit_hash
        inserted += 1

    return inserted


def main() -> None:
    connection = sqlite3.connect(DATABASE_FILE)

    try:
        connection.execute("PRAGMA foreign_keys = ON")

        connection.execute(
            "DELETE FROM concept_evolution"
        )

        concepts = load_concepts(connection)
        total_events = 0

        for concept_key in concepts:
            count = build_concept_evolution(
                connection,
                concept_key,
            )

            total_events += count

            print(
                f"{concept_key}: {count} evolution events"
            )

        connection.commit()

        summary_rows = connection.execute(
            """
            SELECT
                event_type,
                COUNT(*) AS total
            FROM concept_evolution
            GROUP BY event_type
            ORDER BY total DESC
            """
        ).fetchall()

        print()
        print("Evolution build complete.")
        print(f"Concepts processed: {len(concepts)}")
        print(f"Evolution events: {total_events}")

        for event_type, total in summary_rows:
            print(f"{event_type}: {total}")

    finally:
        connection.close()


if __name__ == "__main__":
    main()
