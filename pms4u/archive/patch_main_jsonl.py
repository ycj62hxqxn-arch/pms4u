import re

file_path = "/Users/alaaatia/pms4u/governance-core/src/api/main.py"
with open(file_path, "r") as f:
    content = f.read()

replacement = """
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
        f.write(json.dumps(receipt_dict) + "\\n")
"""

content = content.replace(
    '    event_record = ledger.append_event(**event_payload)\n    correlation_id = getattr(request.state, "correlation_id", "TRACE-INTERNAL")\n    updated_proj = db.execute(select(ProjectionEntity).where(ProjectionEntity.entity_id == req.entity_id)).scalar_one()',
    replacement
)

with open(file_path, "w") as f:
    f.write(content)
