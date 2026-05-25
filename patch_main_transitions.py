import re

with open("/Users/alaaatia/pms4u/governance-core/src/api/main.py", "r") as f:
    content = f.read()

imports = """
from pydantic import BaseModel
from governance_sdk.states import HuntState, ALLOWED_TRANSITIONS
from governance_sdk.receipts import ExecutionReceipt
from governance_sdk.exceptions import IllegalStateJump
"""

endpoint = """
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

    return ExecutionReceipt(
        approved=True,
        transition=req.requested_transition,
        evidence_id=event_record.evidence_id,
        event_hash=event_record.event_hash,
        authority_signature=event_record.event_signature,
        correlation_id=correlation_id,
        projection_version=updated_proj.projection_version
    )
"""
if "process_execution_request" not in content:
    content = content.replace("app = FastAPI", imports + "\n\napp = FastAPI", 1)
    content = content.replace("class SignatureVerificationResult", endpoint + "\n\nclass SignatureVerificationResult", 1)
    with open("/Users/alaaatia/pms4u/governance-core/src/api/main.py", "w") as f:
        f.write(content)
