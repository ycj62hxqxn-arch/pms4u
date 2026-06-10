from datetime import datetime
import uuid
from sqlalchemy import Column, String, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class ExecutionEvent(Base):
    """
    The Immutable Source of Truth (Event Source Ledger).
    Uses PostgreSQL UUID for native high performance correlation.
    """
    __tablename__ = "governance_execution_events"

    # In a Postgres environment we map this to native UUID types if available
    event_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(100), nullable=False, index=True)
    
    previous_state = Column(String(50), nullable=False)
    next_state = Column(String(50), nullable=False)
    
    actor_id = Column(String(100), nullable=False)
    authority_level = Column(String(50), nullable=False)
    
    evidence_id = Column(String(100), nullable=False, unique=True)
    transition_id = Column(String(100), nullable=False)
    
    event_hash = Column(String(64), nullable=False, unique=True, index=True)
    previous_event_hash = Column(String(64), nullable=False)
    
    event_signature = Column(String(256), nullable=True) # Authority signature confirming this record
    
    created_at = Column(DateTime, default=datetime.utcnow)

class ProjectionEntity(Base):
    """
    The "Dumb" Synchronized Projection Output table.
    We rebuild this entirely from the Ledger if ever compromised.
    """
    __tablename__ = "governance_projection_cache"
    
    entity_id = Column(String(100), primary_key=True)
    current_state = Column(String(50), nullable=False)
    projection_version = Column(Integer, nullable=False, default=1)
    last_event_hash = Column(String(64), nullable=True)
    last_transition_id = Column(String(100), nullable=True)
    last_evidence_id = Column(String(100), nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
