import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager
from src.db.models import Base

# Determine Database strategy (Operational/Projection DB)
db_url = os.environ.get("DATABASE_URL", "postgresql://user:password@localhost:5432/governance_ledger")
if "postgres" not in db_url:
    db_url = "sqlite:///./governance.db" # Fallback to local file for dev if not set
engine = create_engine(db_url, connect_args={"check_same_thread": False} if "sqlite" in db_url else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# For Testing / Local Development
def init_db():
    Base.metadata.create_all(bind=engine)
