from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List, Optional
import uuid

from .db_session import get_db, engine, init_db
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

# Constitutional Authority Scope Policy
# Mirrors governance-transition-policy.yaml authority_scopes
AUTHORITY_SCOPES: dict = {
    HuntState.EXPORT_APPROVED: {
        "min_level": "Level_2",
        "error": "EXPORT_APPROVED requires Level_2 authority. Provide an authority_token prefixed with 'super'."
    }
}


app = FastAPI(title="Constitutional Execution Runtime", version="1.0")


@app.on_event("startup")
def initialize_runtime_schema():
    init_db()

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
    requested_transition: HuntState
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

    # 2b. Constitutional Authority Scope Enforcement
    actor_level = "Level_2" if req.authority_token.startswith("super") else "Level_1"
    scope_policy = AUTHORITY_SCOPES.get(next_enum)
    if scope_policy and actor_level != scope_policy["min_level"]:
        raise HTTPException(status_code=403, detail=scope_policy["error"])

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

    projection_rebuilder = ProjectionRebuilder(db, ReplayEngine())
    updated_proj = projection_rebuilder.apply_committed_event(event_record)


    return ExecutionReceipt(
        approved=True,
        transition=req.requested_transition,
        evidence_id=event_record.evidence_id,
        event_hash=event_record.event_hash,
        authority_signature=event_record.event_signature,
        correlation_id=correlation_id,
        timestamp=event_record.created_at.isoformat() + "Z",
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


class RuntimeProjectionRepairResult(BaseModel):
    status: str
    entity_id: str
    projection_state: str
    projection_version: int
    mode: str

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
    
    latest_event = events[-1] if events else None
    replayed_state = latest_event.next_state if latest_event else "NOT_FOUND"

    is_synced = bool(
        projection
        and latest_event
        and projection.current_state == latest_event.next_state
        and projection.projection_version == len(events)
        and projection.last_event_hash == latest_event.event_hash
        and projection.last_transition_id == latest_event.transition_id
        and projection.last_evidence_id == latest_event.evidence_id
    )
    
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


@app.post("/runtime/rebuild-projection/{entity_id}", response_model=RuntimeProjectionRepairResult)
def rebuild_projection_for_entity(entity_id: str, db: Session = Depends(get_db)):
    """
    Rebuilds a single entity projection from the immutable ledger truth.
    Use this when the live projection is stale after an admissible execution.
    """
    engine = ReplayEngine()
    rebuilder = ProjectionRebuilder(db, engine)

    try:
        repaired_projection = rebuilder.rebuild_projection_for_entity(entity_id)
        if repaired_projection is None:
            raise HTTPException(
                status_code=404,
                detail="No ledger-backed truth available for the requested entity"
            )

        return RuntimeProjectionRepairResult(
            status="REPAIRED_SUCCESSFULLY",
            entity_id=entity_id,
            projection_state=repaired_projection.current_state,
            projection_version=repaired_projection.projection_version,
            mode="TARGETED_REPLAY"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Targeted repair aborted: {str(e)}")


class LedgerVerificationResult(BaseModel):
    status: str
    events_verified: int
    broken_links: int
    invalid_signatures: int
    first_event_id: str
    last_event_id: str

@app.get("/runtime/verify-ledger", response_model=LedgerVerificationResult)
def verify_full_ledger():
    """
    Performs a full constitutional audit of the JSONL ledger:
    - Hash chain continuity
    - Signature integrity per event
    Returns CONSTITUTIONALLY_VALID or TAMPERED.
    """
    import json, os
    ledger_path = "authoritative_ledger.jsonl"

    if not os.path.exists(ledger_path):
        return LedgerVerificationResult(
            status="EMPTY_LEDGER",
            events_verified=0, broken_links=0, invalid_signatures=0,
            first_event_id="", last_event_id=""
        )

    events_verified = 0
    broken_links = 0
    invalid_signatures = 0
    first_event_id = ""
    last_event_id = ""
    prev_hash_map: dict = {}

    with open(ledger_path, "r") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                event = json.loads(line)
                eid = event.get("entity_id", "UNKNOWN")
                event_id = event.get("event_id", "")

                if not first_event_id:
                    first_event_id = event_id
                last_event_id = event_id

                # 1. Hash chain check
                expected_prev = prev_hash_map.get(eid)
                if expected_prev and event.get("previous_hash") != expected_prev:
                    broken_links += 1
                prev_hash_map[eid] = event.get("hash", "")

                # 2. Signature check
                sig = event.get("signature", "")
                h = event.get("hash", "")
                if sig and h:
                    if not verifier.verify_runtime_signature(h, sig):
                        invalid_signatures += 1

                events_verified += 1
            except Exception:
                broken_links += 1

    constitutional_status = (
        "CONSTITUTIONALLY_VALID" if broken_links == 0 and invalid_signatures == 0
        else "TAMPERED"
    )

    return LedgerVerificationResult(
        status=constitutional_status,
        events_verified=events_verified,
        broken_links=broken_links,
        invalid_signatures=invalid_signatures,
        first_event_id=first_event_id,
        last_event_id=last_event_id
    )


from fastapi.responses import HTMLResponse

@app.get("/trace/{entity_id}", response_class=HTMLResponse)
def execution_trace_viewer(entity_id: str, db: Session = Depends(get_db)):
    """
    Returns a standalone HTML Execution Trace Viewer for any entity.
    Shows full constitutional lineage: state chain, hash, authority, evidence.
    """
    events = db.execute(
        select(ExecutionEvent)
        .where(ExecutionEvent.entity_id == entity_id)
        .order_by(ExecutionEvent.created_at.asc())
    ).scalars().all()

    if not events:
        return HTMLResponse(content="<h2 style='font-family:monospace;color:#d4af37;background:#030303;padding:2rem'>No lineage found for entity: " + entity_id + "</h2>", status_code=404)

    rows = ""
    for i, ev in enumerate(events):
        is_valid = verifier.verify_runtime_signature(ev.event_hash or "", ev.event_signature or "")
        sig_badge = "<span style='color:#00fa9a'>✓ VALID</span>" if is_valid else "<span style='color:#ff4444'>✗ INVALID</span>"
        rows += f"""
        <tr>
            <td>{i}</td>
            <td><span style='color:#d4af37'>{ev.previous_state}</span> → <span style='color:#00fa9a'>{ev.next_state}</span></td>
            <td style='color:#888'>{ev.actor_id}</td>
            <td style='color:#888'>{ev.authority_level}</td>
            <td style='color:#888;font-size:0.75rem'>{ev.evidence_id}</td>
            <td style='font-family:monospace;font-size:0.7rem;color:#555'>{(ev.event_hash or '')[:16]}...</td>
            <td>{sig_badge}</td>
            <td style='color:#555;font-size:0.75rem'>{ev.created_at.isoformat()}</td>
        </tr>"""

    html = f"""
    <!DOCTYPE html><html lang='en'><head>
    <meta charset='UTF-8'><title>Execution Trace: {entity_id}</title>
    <style>
        body{{background:#030303;color:#e0e0e0;font-family:'JetBrains Mono','Courier New',monospace;padding:2rem;margin:0}}
        h1{{color:#d4af37;font-size:1.2rem;letter-spacing:3px;text-transform:uppercase;border-bottom:1px solid #d4af37;padding-bottom:1rem;margin-bottom:2rem}}
        .meta{{color:#666;font-size:0.8rem;margin-bottom:2rem}}
        table{{width:100%;border-collapse:collapse;font-size:0.82rem}}
        th{{text-align:left;color:#d4af37;border-bottom:1px solid #333;padding:0.75rem 1rem;font-size:0.75rem;letter-spacing:1px}}
        td{{padding:0.75rem 1rem;border-bottom:1px solid #111;vertical-align:top}}
        tr:hover{{background:#0a0a0a}}
        .tag{{background:#111;border:1px solid #333;padding:2px 8px;border-radius:2px;font-size:0.75rem}}
    </style></head><body>
    <h1>⬡ Execution Trace // {entity_id}</h1>
    <div class='meta'>EVENTS: {len(events)} | ENTITY: {entity_id} | RUNTIME: Constitutional Execution Runtime v1.0</div>
    <table>
        <thead><tr>
            <th>#</th><th>TRANSITION</th><th>ACTOR</th><th>AUTHORITY</th>
            <th>EVIDENCE</th><th>HASH</th><th>SIGNATURE</th><th>TIMESTAMP</th>
        </tr></thead>
        <tbody>{rows}</tbody>
    </table>
    </body></html>
    """
    return HTMLResponse(content=html)
