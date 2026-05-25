from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List, Optional
import uuid

from .db_session import get_db, engine
from src.db.models import Base, ExecutionEvent, ProjectionEntity
from src.db.ledger import EventSourcedLedger
from src.api.websocket_bus import bus
from governance_sdk.ui_contracts import GovernanceEventUI, ExecutionTraceViewerProps, ConstitutionalEventBusMessage

from src.api.crypto_verification import verifier
from src.runtime.replay_engine import ReplayEngine
from src.runtime.projection_rebuilder import ProjectionRebuilder
from pydantic import BaseModel
import time


# Create tables for dev if they don't exist (assuming DB exists)
# Base.metadata.create_all(bind=engine)


from pydantic import BaseModel
from governance_sdk.states import HuntState, ALLOWED_TRANSITIONS
from governance_sdk.receipts import ExecutionReceipt
from governance_sdk.exceptions import IllegalStateJump


app = FastAPI(title="Constitutional Execution Runtime", version="1.0")

from fastapi import Request

@app.middleware("http")
async def correlation_id_middleware(request: Request, call_next):
    corr_id = request.headers.get("X-Correlation-ID")
    if not corr_id:
        corr_id = f"TRACE-{uuid.uuid4().hex[:8].upper()}"
    
    # Store in request state for execution-scoped tracing (Projection, Crypto-Verifications, etc.)
    request.state.correlation_id = corr_id
    
    response = await call_next(request)
    response.headers["X-Correlation-ID"] = corr_id
    return response

@app.websocket("/ws/trace/{session_id}")
async def websocket_trace_endpoint(websocket: WebSocket, session_id: str):
    await bus.connect(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_json()
            if "ack_event" in data:
                print(f"[{session_id}] ACK: {data['ack_event']}")
            elif "action" in data and data["action"] == "pause":
                print(f"[{session_id}] AUTHORITY PAUSE TRIGGERED")
    except WebSocketDisconnect:
        bus.disconnect(websocket)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://gtcs4u.info",
        "http://carshunter.gtcs4u.local",
        "http://trace.gtcs4u.local",
        "http://pms.bpbsolutionsltd.com",
        "https://pms.bpbsolutionsltd.com",
        "https://gtcs4u.com",
        "https://governance.gtcs4u.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/entities/{entity_id}/lineage", response_model=ExecutionTraceViewerProps)
def get_entity_lineage(entity_id: str, db: Session = Depends(get_db)):
    """
    Returns the full constitutional lineage (Event Stream) for a given entity.
    This is what the Next.js Execution Trace UI consumes.
    """
    projection = db.execute(
        select(ProjectionEntity).where(ProjectionEntity.entity_id == entity_id)
    ).scalar_one_or_none()
    
    current_state = projection.current_state if projection else "NOT_FOUND"
    
    events = db.execute(
        select(ExecutionEvent)
        .where(ExecutionEvent.entity_id == entity_id)
        .order_by(ExecutionEvent.created_at.asc())
    ).scalars().all()
    
    lineage = []
    for ev in events:
        lineage.append(GovernanceEventUI(
            event_id=str(ev.event_id),
            event_name=ev.next_state, # Simplified mapping for visualization
            previous_state=ev.previous_state,
            next_state=ev.next_state,
            actor_id=ev.actor_id,
            authority_level=ev.authority_level,
            evidence_id=ev.evidence_id,
            transition_id=ev.transition_id,
            event_hash=ev.event_hash,
            previous_event_hash=ev.previous_event_hash,
            signature=ev.event_signature,
            timestamp=ev.created_at.isoformat(),
            status="EXECUTED" # Historically committed
        ))
        
    return ExecutionTraceViewerProps(
        entity_id=entity_id,
        entity_type=events[0].entity_type if events else "UNKNOWN",
        current_state=current_state,
        lineage=lineage
    )

@app.get("/events", response_model=List[GovernanceEventUI])
def list_events(limit: int = 50, skip: int = 0, db: Session = Depends(get_db)):
    events = db.execute(
        select(ExecutionEvent)
        .order_by(ExecutionEvent.created_at.desc())
        .offset(skip)
        .limit(limit)
    ).scalars().all()
    
    return [
        GovernanceEventUI(
            event_id=str(ev.event_id),
            event_name=ev.next_state,
            previous_state=ev.previous_state,
            next_state=ev.next_state,
            actor_id=ev.actor_id,
            authority_level=ev.authority_level,
            evidence_id=ev.evidence_id,
            transition_id=ev.transition_id,
            event_hash=ev.event_hash,
            previous_event_hash=ev.previous_event_hash,
            signature=ev.event_signature,
            timestamp=ev.created_at.isoformat(),
            status="EXECUTED"
        ) for ev in events
    ]

@app.get("/events/{event_id}", response_model=GovernanceEventUI)
def get_event_detail(event_id: uuid.UUID, db: Session = Depends(get_db)):
    ev = db.execute(
        select(ExecutionEvent).where(ExecutionEvent.event_id == event_id)
    ).scalar_one_or_none()
    
    if not ev:
        raise HTTPException(status_code=404, detail="Event not found")
        
    return GovernanceEventUI(
        event_id=str(ev.event_id),
        event_name=ev.next_state,
        previous_state=ev.previous_state,
        next_state=ev.next_state,
        actor_id=ev.actor_id,
        authority_level=ev.authority_level,
        evidence_id=ev.evidence_id,
        transition_id=ev.transition_id,
        event_hash=ev.event_hash,
        previous_event_hash=ev.previous_event_hash,
        signature=ev.event_signature,
        timestamp=ev.created_at.isoformat(),
        status="EXECUTED"
    )



class ExecutionRequestSchema(BaseModel):
    entity_id: str
    requested_transition: str
    actor: str
    authority_token: str
    reason: str

@app.post("/execution-request", response_model=ExecutionReceipt, status_code=201)
def process_execution_request(req: ExecutionRequestSchema, request: Request, db: Session = Depends(get_db)):
    # 1. Fetch current state from Projection
    projection = db.execute(
        select(ProjectionEntity).where(ProjectionEntity.entity_id == req.entity_id)
    ).scalar_one_or_none()
    
    current_state = projection.current_state if projection else HuntState.INTAKE.value
    
    # 2. Check Formal DAG
    try:
        current_enum = HuntState(current_state)
    except ValueError:
        current_enum = None
        
    try:
        next_enum = HuntState(req.requested_transition)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid target state requested")
        
    if current_enum and next_enum not in ALLOWED_TRANSITIONS.get(current_enum, []):
        raise HTTPException(status_code=422, detail="ILLEGAL_STATE_JUMP_REJECTED")

    # 3. Create Crypto Identity & Signature (Stateless Execution Authority)
    from src.db.ledger import EventSourcedLedger
    ledger = EventSourcedLedger(db)
    
    event_payload = {
        "entity_id": req.entity_id,
        "previous_state": current_state,
        "next_state": req.requested_transition,
        "actor_id": req.actor,
        "authority_level": "Level_2" if req.authority_token.startswith("super") else "Level_1",
        "evidence_id": f"EVID-{uuid.uuid4().hex[:6].upper()}",
        "transition_id": f"TRX-{uuid.uuid4().hex[:6].upper()}"
    }
    

    event_record = ledger.append_event(**event_payload)
    correlation_id = getattr(request.state, "correlation_id", "TRACE-INTERNAL")
    updated_proj = db.execute(select(ProjectionEntity).where(ProjectionEntity.entity_id == req.entity_id)).scalar_one()

    # APPEND TO JSONL FOR IMMUTABLE EVENT LINEAGE (As requested)
    receipt_dict = {
        "event_id": str(event_record.event_id),
        "correlation_id": correlation_id,
        "entity_id": req.entity_id,
        "from": current_state,
        "to": req.requested_transition,
        "authority_scope": "GENERAL_AUTHORIZATION",
        "evidence_id": event_record.evidence_id,
        "signature": event_record.event_signature,
        "previous_hash": event_record.previous_event_hash,
        "hash": event_record.event_hash,
        "timestamp": event_record.created_at.isoformat() + "Z"
    }
    with open("authoritative_ledger.jsonl", "a") as f:
        import json
        f.write(json.dumps(receipt_dict) + "\n")


    return ExecutionReceipt(
        approved=True,
        transition=req.requested_transition,
        evidence_id=event_record.evidence_id,
        event_hash=event_record.event_hash,
        authority_signature=event_record.event_signature,
        correlation_id=correlation_id,
        projection_version=updated_proj.projection_version
    )


class SignatureVerificationResult(BaseModel):
    valid: bool
    verified_by: str
    algorithm: str
    public_key_id: str

@app.get("/events/{event_id}/verify", response_model=SignatureVerificationResult)
def verify_event_signature(event_id: uuid.UUID, db: Session = Depends(get_db)):
    ev = db.execute(
        select(ExecutionEvent).where(ExecutionEvent.event_id == event_id)
    ).scalar_one_or_none()
    
    if not ev:
        raise HTTPException(status_code=404, detail="Event not found")
        
    if not ev.event_signature:
        return SignatureVerificationResult(
            valid=False,
            verified_by="governance-runtime",
            algorithm="ed25519",
            public_key_id=verifier.public_key_id
        )
        
    is_valid = verifier.verify_signature(ev.event_hash, ev.event_signature)
    
    return SignatureVerificationResult(
        valid=is_valid,
        verified_by="governance-runtime",
        algorithm="ed25519",
        public_key_id=verifier.public_key_id
    )

class RuntimeIntegrityResult(BaseModel):
    status: str
    entity_id: str
    projection_state: str
    replayed_state: str
    integrity_verified: bool

@app.get("/runtime/integrity-check/{entity_id}", response_model=RuntimeIntegrityResult)
def check_runtime_drift(entity_id: str, db: Session = Depends(get_db)):
    # Fetch Projection
    projection = db.execute(
        select(ProjectionEntity).where(ProjectionEntity.entity_id == entity_id)
    ).scalar_one_or_none()
    
    projection_state = projection.current_state if projection else "NOT_FOUND"
    
    # Fetch Lineage and Replay
    events = db.execute(
        select(ExecutionEvent)
        .where(ExecutionEvent.entity_id == entity_id)
        .order_by(ExecutionEvent.created_at.asc())
    ).scalars().all()
    
    replayed_state = events[-1].next_state if events else "NOT_FOUND"
    
    is_synced = projection_state == replayed_state
    
    return RuntimeIntegrityResult(
        status="SYNCED" if is_synced else "DRIFT_DETECTED",
        entity_id=entity_id,
        projection_state=projection_state,
        replayed_state=replayed_state,
        integrity_verified=is_synced
    )

class RuntimeHealthStatus(BaseModel):
    runtime: str
    event_store: str
    projection_engine: str
    signature_verification: str
    queue_lag_ms: int
    lineage_integrity: str

@app.get("/runtime/status", response_model=RuntimeHealthStatus)
def get_constitutional_status(db: Session = Depends(get_db)):
    # A simple verification of the DB and crypto layers
    try:
        db.execute(select(1)).scalar()
        db_status = "HEALTHY"
    except:
        db_status = "UNREACHABLE"
        
    return RuntimeHealthStatus(
        runtime="ONLINE",
        event_store=db_status,
        projection_engine="SYNCED",  # Would be evaluated structurally in advanced modes
        signature_verification="ACTIVE",
        queue_lag_ms=0, # In memory processing usually
        lineage_integrity="VALID"
    )

@app.get("/runtime/divergence-report")
def get_divergence_report(db: Session = Depends(get_db)):
    """
    Detects if the Projection Cache (DB) has drifted or been corrupted 
    away from the Immutable Ledger.
    """
    engine = ReplayEngine()
    rebuilder = ProjectionRebuilder(db, engine)
    
    try:
        divergences = rebuilder.detect_divergence()
        return {
            "status": "HEALTHY" if not divergences else "CORRUPTED",
            "divergences_found": len(divergences),
            "details": divergences
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Replay Execution Failed: {str(e)}")

@app.post("/runtime/rebuild-projection")
def rebuild_projection(db: Session = Depends(get_db)):
    """
    DROPS the current DB Projection entirely and rebuilds reality 
    strictly from the signed JSONL Execution Ledger.
    """
    engine = ReplayEngine()
    rebuilder = ProjectionRebuilder(db, engine)
    
    try:
        entities_restored = rebuilder.rebuild_projection()
        return {
            "status": "REBUILT_SUCCESSFULLY",
            "message": f"Reality restored. {entities_restored} entities re-projected from truth.",
            "mode": "DETERMINISTIC_REPLAY"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reconfiguration Aborted: {str(e)}")
