import os
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager
from src.db.models import Base

# Determine Database strategy (Operational/Projection DB)
db_url = os.environ.get("DATABASE_URL", "postgresql://user:password@localhost:5432/governance_ledger")
if "postgres" not in db_url:
    db_url = "sqlite:///./governance.db" # Fallback to local file for dev if not set
engine = create_engine(db_url, connect_args={"check_same_thread": False} if "sqlite" in db_url else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def ensure_projection_schema():
    inspector = inspect(engine)
    if "governance_projection_cache" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("governance_projection_cache")}
    alterations = []

    if "last_event_hash" not in existing_columns:
        alterations.append("ALTER TABLE governance_projection_cache ADD COLUMN last_event_hash VARCHAR(64)")
    if "last_transition_id" not in existing_columns:
        alterations.append("ALTER TABLE governance_projection_cache ADD COLUMN last_transition_id VARCHAR(100)")
    if "last_evidence_id" not in existing_columns:
        alterations.append("ALTER TABLE governance_projection_cache ADD COLUMN last_evidence_id VARCHAR(100)")
    if "updated_at" not in existing_columns:
        alterations.append("ALTER TABLE governance_projection_cache ADD COLUMN updated_at DATETIME")

    if not alterations:
        return

    with engine.begin() as connection:
        for statement in alterations:
            connection.execute(text(statement))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# For Testing / Local Development
def init_db():
    Base.metadata.create_all(bind=engine)
    ensure_projection_schema()
