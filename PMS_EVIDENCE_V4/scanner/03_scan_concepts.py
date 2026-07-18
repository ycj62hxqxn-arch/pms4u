from __future__ import annotations

import re
import sqlite3
import subprocess
from datetime import datetime, timezone
from pathlib import Path

import yaml


ROOT = Path.home() / "PMS_EVIDENCE_V4"

DATABASE_FILE = ROOT / "database" / "evidence.db"
CONCEPTS_FILE = ROOT / "config" / "concepts.yaml"

ALLOWED_SUFFIXES = {
    ".md",
    ".txt",
    ".py",
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".json",
    ".yaml",
    ".yml",
    ".html",
    ".css",
    ".sql",
    ".sh",
    ".toml",
}

SKIPPED_PATH_PARTS = {
    "node_modules",
    ".venv",
    "venv",
    "dist",
    "build",
    "coverage",
    ".next",
    "__pycache__",
}


def run_git(
    repository: Path,
    *arguments: str,
) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", "-C", str(repository), *arguments],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )


def load_concepts() -> dict[str, dict[str, object]]:
    data = yaml.safe_load(
        CONCEPTS_FILE.read_text(
            encoding="utf-8",
            errors="replace",
        )
    )

    concepts = data.get("concepts")

    if not isinstance(concepts, dict):
        raise ValueError("Invalid concepts.yaml structure")

    return concepts


def compile_patterns(
    concepts: dict[str, dict[str, object]],
) -> dict[str, list[tuple[str, re.Pattern[str]]]]:
    compiled: dict[str, list[tuple[str, re.Pattern[str]]]] = {}

    for concept_key, definition in concepts.items():
        patterns = definition.get("patterns", [])

        if not isinstance(patterns, list):
            raise ValueError(
                f"Patterns must be a list for {concept_key}"
            )

        compiled[concept_key] = []

        for pattern in patterns:
            if not isinstance(pattern, str):
                continue

            escaped = re.escape(pattern)

            is_acronym = (
                pattern.replace("_", "").isalnum()
                and pattern.upper() == pattern
                and len(pattern) <= 8
                and " " not in pattern
            )

            if is_acronym:
                expression = (
                    rf"(?<![A-Za-z0-9_])"
                    rf"{escaped}"
                    rf"(?![A-Za-z0-9_])"
                )
            else:
                expression = escaped

            compiled[concept_key].append(
                (
                    pattern,
                    re.compile(
                        expression,
                        re.IGNORECASE,
                    ),
                )
            )

    return compiled


def path_is_allowed(file_path: str) -> bool:
    path = Path(file_path)

    if path.suffix.lower() not in ALLOWED_SUFFIXES:
        return False

    if any(part in SKIPPED_PATH_PARTS for part in path.parts):
        return False

    return True


def list_commit_files(
    repository: Path,
    commit_hash: str,
) -> list[str]:
    result = run_git(
        repository,
        "ls-tree",
        "-r",
        "--name-only",
        commit_hash,
    )

    if result.returncode != 0:
        return []

    return [
        line.strip()
        for line in result.stdout.splitlines()
        if line.strip() and path_is_allowed(line.strip())
    ]


def read_historical_file(
    repository: Path,
    commit_hash: str,
    file_path: str,
) -> str:
    result = run_git(
        repository,
        "show",
        f"{commit_hash}:{file_path}",
    )

    if result.returncode != 0:
        return ""

    return result.stdout


def classify_evidence(file_path: str) -> str:
    path = file_path.lower()

    if "/architecture/" in path or path.endswith(".py"):
        return "ARCHITECTURE_OR_CODE"

    if "/docs/" in path or path.endswith(".md"):
        return "DOCUMENTATION"

    if "/reports/" in path or "report" in path:
        return "OPERATIONAL_REPORT"

    if path.endswith(".html"):
        return "HTML_SURFACE"

    return "SOURCE_TEXT"


def insert_hit(
    connection: sqlite3.Connection,
    *,
    concept_key: str,
    concept_label: str,
    commit_hash: str,
    repository_id: int,
    file_path: str,
    line_number: int,
    matched_text: str,
    matched_pattern: str,
) -> bool:
    cursor = connection.execute(
        """
        INSERT OR IGNORE INTO concept_hits (
            concept_key,
            concept_label,
            commit_hash,
            repository_id,
            file_path,
            line_number,
            matched_text,
            matched_pattern,
            evidence_class,
            confidence,
            verified,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            concept_key,
            concept_label,
            commit_hash,
            repository_id,
            file_path,
            line_number,
            matched_text,
            matched_pattern,
            classify_evidence(file_path),
            "UNREVIEWED",
            0,
            datetime.now(timezone.utc).isoformat(),
        ),
    )

    return cursor.rowcount == 1


def scan_file_content(
    *,
    connection: sqlite3.Connection,
    repository_id: int,
    commit_hash: str,
    file_path: str,
    content: str,
    concepts: dict[str, dict[str, object]],
    compiled_patterns: dict[
        str,
        list[tuple[str, re.Pattern[str]]],
    ],
) -> int:
    inserted = 0
    lines = content.splitlines()

    for line_number, line in enumerate(lines, start=1):
        for concept_key, patterns in compiled_patterns.items():
            concept_label = str(
                concepts[concept_key].get(
                    "label",
                    concept_key,
                )
            )

            for pattern_text, compiled_pattern in patterns:
                if not compiled_pattern.search(line):
                    continue

                if insert_hit(
                    connection,
                    concept_key=concept_key,
                    concept_label=concept_label,
                    commit_hash=commit_hash,
                    repository_id=repository_id,
                    file_path=file_path,
                    line_number=line_number,
                    matched_text=line[:1000],
                    matched_pattern=pattern_text,
                ):
                    inserted += 1

                # Only one match per concept per historical line.
                break

    return inserted


def main() -> None:
    concepts = load_concepts()
    compiled_patterns = compile_patterns(concepts)

    connection = sqlite3.connect(DATABASE_FILE)

    try:
        connection.execute("PRAGMA foreign_keys = ON")

        repositories = connection.execute(
            """
            SELECT id, path
            FROM repositories
            ORDER BY id
            """
        ).fetchall()

        total_hits = 0
        scanned_commits = 0
        scanned_files = 0

        for repository_id, repository_path in repositories:
            repository = Path(repository_path)

            print()
            print(f"Scanning repository: {repository}")

            commits = connection.execute(
                """
                SELECT c.hash
                FROM commits c
                JOIN repository_commits rc
                    ON rc.commit_hash = c.hash
                WHERE rc.repository_id = ?
                ORDER BY c.author_date
                """,
                (repository_id,),
            ).fetchall()

            for commit_index, (commit_hash,) in enumerate(
                commits,
                start=1,
            ):
                scanned_commits += 1

                if commit_index % 25 == 0:
                    print(
                        f"  Commit {commit_index}/{len(commits)}"
                    )

                files = list_commit_files(
                    repository,
                    commit_hash,
                )

                for file_path in files:
                    scanned_files += 1

                    content = read_historical_file(
                        repository,
                        commit_hash,
                        file_path,
                    )

                    if not content:
                        continue

                    total_hits += scan_file_content(
                        connection=connection,
                        repository_id=repository_id,
                        commit_hash=commit_hash,
                        file_path=file_path,
                        content=content,
                        concepts=concepts,
                        compiled_patterns=compiled_patterns,
                    )

                connection.commit()

        database_hits = connection.execute(
            "SELECT COUNT(*) FROM concept_hits"
        ).fetchone()[0]

        concepts_found = connection.execute(
            """
            SELECT COUNT(DISTINCT concept_key)
            FROM concept_hits
            """
        ).fetchone()[0]

        print()
        print("Concept scan complete.")
        print(f"Configured concepts: {len(concepts)}")
        print(f"Concepts found: {concepts_found}")
        print(f"Repository commit scans: {scanned_commits}")
        print(f"Historical files scanned: {scanned_files}")
        print(f"New evidence hits inserted: {total_hits}")
        print(f"Total evidence hits in database: {database_hits}")

    finally:
        connection.close()


if __name__ == "__main__":
    main()