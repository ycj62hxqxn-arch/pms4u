from __future__ import annotations

import importlib.util
import sys
from pathlib import Path
from typing import Any


ROOT = Path.home() / "PMS_EVIDENCE_V4"
DATABASE_FILE = ROOT / "database" / "evidence.db"
STAGE_10_FILE = ROOT / "evolution" / "10_governance_query_language.py"


class GQLBridgeError(RuntimeError):
    """Raised when the Stage 10 GQL engine cannot be loaded or executed."""


def _load_stage_10_module():
    if not STAGE_10_FILE.exists():
        raise GQLBridgeError(
            f"Stage 10 engine not found: {STAGE_10_FILE}"
        )

    module_name = "pms4u_stage_10_gql"

    spec = importlib.util.spec_from_file_location(
        module_name,
        STAGE_10_FILE,
    )

    if spec is None or spec.loader is None:
        raise GQLBridgeError(
            f"Could not load Stage 10 engine: {STAGE_10_FILE}"
        )

    module = importlib.util.module_from_spec(spec)

    # Python 3.14 dataclasses require the module to be registered
    # before its source code is executed.
    sys.modules[module_name] = module

    try:
        spec.loader.exec_module(module)
    except Exception:
        sys.modules.pop(module_name, None)
        raise

    return module


# Load Stage 10 once when this bridge module is imported.
_STAGE_10 = _load_stage_10_module()


def execute_governance_query(query: str) -> dict[str, Any]:
    cleaned_query = query.strip()

    if not cleaned_query:
        raise GQLBridgeError("Query cannot be empty")

    repository = None

    try:
        repository = _STAGE_10.GovernanceRepository(
            DATABASE_FILE
        )

        engine = _STAGE_10.GovernanceQueryEngine(
            repository
        )

        result = engine.execute(cleaned_query)

        return {
            "status": "EXECUTED",
            "query": cleaned_query,
            "command": result.command,
            "data": result.data,
            "text": result.text,
        }

    except _STAGE_10.GovernanceQueryError as exc:
        raise GQLBridgeError(str(exc)) from exc

    except ValueError as exc:
        raise GQLBridgeError(
            f"Invalid query syntax: {exc}"
        ) from exc

    finally:
        if repository is not None:
            repository.close()
