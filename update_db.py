import os
import re

file_path = "/Users/alaaatia/pms4u/governance-core/src/api/db_session.py"
with open(file_path, "r") as f:
    text = f.read()

# For local demonstration, let's keep SQLite if no POSTGRES given, but set up the architecture for PSQL
# The user wants "بدء: PostgreSQL event sourcing"
text = text.replace(
    'db_url = os.environ.get("DATABASE_URL", "sqlite:///./governance.db")',
    'db_url = os.environ.get("DATABASE_URL", "postgresql://user:password@localhost:5432/governance_ledger")\nif "postgres" not in db_url:\n    db_url = "sqlite:///./governance.db" # Fallback to local file for dev if not set'
)

with open(file_path, "w") as f:
    f.write(text)

