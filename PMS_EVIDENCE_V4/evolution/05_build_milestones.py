from __future__ import annotations

import difflib
import sqlite3
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path.home() / "PMS_EVIDENCE_V4"
DATABASE_FILE = ROOT / "database" / "evidence.db"


MILESTONE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS concept_milestones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    concept_key TEXT NOT NULL,
    repository_id INTEGER NOT NULL,
    commit_hash TEXT NOT NULL,
    author_date TEXT NOT NULL,
    milestone_type TEXT NOT NULL,
    evidence_class TEXT,
    confidence TEXT NOT NULL,
    summary TEXT,
    created_at TEXT NOT NULL,

    FOREIGN KEY(repository_id)
        REFERENCES repositories(id),

    FOREIGN KEY(commit_hash)
        REFERENCES commits(hash),

    UNIQUE (
        concept_key,
        repository_id,
        commit_hash,
        milestone_type
    )
);
"""


INDEX_SQL = """
CREATE INDEX IF NOT EXISTS idx_concept_milestones_lookup
ON concept_milestones (
    concept_key,
    milestone_type,
    author_date
);
"""


def normalize_text(text: str) -> str:
    return " ".join(text.lower().split())


def similarity_ratio(previous_text: str, current_text: str) -> float:
    previous = normalize_text(previous_text)
    current = normalize_text(current_text)

    if not previous and not current:
        return 1.0
    if not previous or not current:
        return 0.0

    return difflib.SequenceMatcher(None, previous, current).ratio()


def load_concepts(connection: sqlite3.Connection) -> list[str]:
    rows = connection.execute(
        """
        SELECT DISTINCT concept_key
        FROM concept_hits
        ORDER BY concept_key
        """
    ).fetchall()
    return [row[0] for row in rows]


def load_concept_history(
    connection: sqlite3.Connection,
    concept_key: str,
) -> list[tuple[int, str, str, str, str]]:
    return connection.execute(
        """
        SELECT
            ordered.repository_id,
            ordered.commit_hash,
            ordered.author_date,
            GROUP_CONCAT(DISTINCT ordered.evidence_class) AS evidence_classes,
            GROUP_CONCAT(ordered.matched_text, CHAR(10)) AS evidence_text
        FROM (
            SELECT DISTINCT
                ch.repository_id,
                ch.commit_hash,
                c.author_date,
                ch.evidence_class,
                ch.file_path,
                ch.line_number,
                ch.matched_pattern,
                ch.matched_text
            FROM concept_hits ch
            JOIN commits c
                ON c.hash = ch.commit_hash
            WHERE ch.concept_key = ?
            ORDER BY
                c.author_date,
                ch.repository_id,
                ch.commit_hash,
                ch.file_path,
                ch.line_number,
                ch.matched_pattern,
                ch.matched_text
        ) AS ordered
        GROUP BY
            ordered.repository_id,
            ordered.commit_hash,
            ordered.author_date
        ORDER BY
            ordered.author_date,
            ordered.repository_id,
            ordered.commit_hash
        """,
        (concept_key,),
    ).fetchall()


def insert_milestone(
    connection: sqlite3.Connection,
    *,
    concept_key: str,
    repository_id: int,
    commit_hash: str,
    author_date: str,
    milestone_type: str,
    evidence_class: str | None,
    confidence: str,
    summary: str,
) -> bool:
    cursor = connection.execute(
        """
        INSERT OR IGNORE INTO concept_milestones (
            concept_key,
            repository_id,
            commit_hash,
            author_date,
            milestone_type,
            evidence_class,
            confidence,
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
            milestone_type,
            evidence_class,
            confidence,
            summary,
            datetime.now(timezone.utc).isoformat(),
        ),
    )
    return cursor.rowcount == 1


def class_to_milestone(evidence_class: str) -> str | None:
    return {
        "ARCHITECTURE_OR_CODE": "FIRST_ARCHITECTURE_OR_CODE",
        "DOCUMENTATION": "FIRST_DOCUMENTATION",
        "OPERATIONAL_REPORT": "FIRST_OPERATIONAL_REPORT",
        "HTML_SURFACE": "FIRST_HTML_SURFACE",
        "SOURCE_TEXT": "FIRST_SOURCE_TEXT",
    }.get(evidence_class)


def parse_evidence_classes(evidence_classes: str | None) -> list[str]:
    if not evidence_classes:
        return []
    return sorted(
        {
            item.strip()
            for item in evidence_classes.split(",")
            if item.strip()
        }
    )


def build_milestones_for_concept(
    connection: sqlite3.Connection,
    concept_key: str,
) -> int:
    history = load_concept_history(connection, concept_key)
    if not history:
        return 0

    inserted = 0
    seen_classes: set[str] = set()
    seen_repositories: set[int] = set()
 

    first_repository_id, first_commit_hash, first_author_date, first_classes_text, _ = history[0]
    first_classes = parse_evidence_classes(first_classes_text)

    if insert_milestone(
        connection,
        concept_key=concept_key,
        repository_id=first_repository_id,
        commit_hash=first_commit_hash,
        author_date=first_author_date,
        milestone_type="FIRST_APPEARANCE",
        evidence_class=",".join(first_classes) if first_classes else None,
        confidence="HIGH",
        summary=f"{concept_key} first detected in commit {first_commit_hash[:7]}",
    ):
        inserted += 1

    for repository_id, commit_hash, author_date, evidence_classes_text, evidence_text in history:
        current_classes = parse_evidence_classes(evidence_classes_text)
        evidence_text = evidence_text or ""

        for evidence_class in current_classes:
            if evidence_class in seen_classes:
                continue
            milestone_type = class_to_milestone(evidence_class)
            if milestone_type is None:
                continue
            if insert_milestone(
                connection,
                concept_key=concept_key,
                repository_id=repository_id,
                commit_hash=commit_hash,
                author_date=author_date,
                milestone_type=milestone_type,
                evidence_class=evidence_class,
                confidence="HIGH",
                summary=(
                    f"{concept_key} first reached {evidence_class} evidence "
                    f"in commit {commit_hash[:7]}"
                ),
            ):
                inserted += 1
            seen_classes.add(evidence_class)

        if seen_repositories and repository_id not in seen_repositories:
            if insert_milestone(
                connection,
                concept_key=concept_key,
                repository_id=repository_id,
                commit_hash=commit_hash,
                author_date=author_date,
                milestone_type="REPOSITORY_EXPANSION",
                evidence_class=",".join(current_classes) if current_classes else None,
                confidence="HIGH",
                summary=(
                    f"{concept_key} expanded into repository {repository_id} "
                    f"in commit {commit_hash[:7]}"
                ),
            ):
                inserted += 1

        seen_repositories.add(repository_id)
        

    latest = history[-1]
    latest_classes = parse_evidence_classes(latest[3])

    if insert_milestone(
        connection,
        concept_key=concept_key,
        repository_id=latest[0],
        commit_hash=latest[1],
        author_date=latest[2],
        milestone_type="LATEST_STATE",
        evidence_class=",".join(latest_classes) if latest_classes else None,
        confidence="HIGH",
        summary=f"{concept_key} latest indexed state is commit {latest[1][:7]}",
    ):
        inserted += 1

    return inserted


def main() -> None:
    connection = sqlite3.connect(DATABASE_FILE)

    try:
        connection.execute("PRAGMA foreign_keys = ON")
        connection.execute("DROP TABLE IF EXISTS concept_milestones")
        connection.execute(MILESTONE_TABLE_SQL)
        connection.execute(INDEX_SQL)

        concepts = load_concepts(connection)
        total_milestones = 0

        for concept_key in concepts:
            count = build_milestones_for_concept(connection, concept_key)
            total_milestones += count
            print(f"{concept_key}: {count} milestones")

        connection.commit()

        summary_rows = connection.execute(
            """
            SELECT milestone_type, COUNT(*) AS total
            FROM concept_milestones
            GROUP BY milestone_type
            ORDER BY total DESC, milestone_type
            """
        ).fetchall()

        print()
        print("Milestone build complete.")
        print(f"Concepts processed: {len(concepts)}")
        print(f"Milestones generated: {total_milestones}")

        for milestone_type, total in summary_rows:
            print(f"{milestone_type}: {total}")
    finally:
        connection.close()


if __name__ == "__main__":
    main()