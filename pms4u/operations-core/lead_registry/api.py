
from fastapi import FastAPI, HTTPException, status
from fastapi import Body
from pydantic import BaseModel, Field
from .model import Lead
from .db import init_db, add_lead, get_lead, list_leads
from typing import List, Optional
from uuid import uuid4
from datetime import datetime

app = FastAPI()

@app.on_event("startup")
def startup():
    init_db()

class LeadCreateRequest(BaseModel):
    customer_name: str = Field(..., example="Max Müller")
    source: str = Field(..., example="Website")
    contact_info: Optional[str] = Field(None, example="max@example.com")
    notes: Optional[str] = Field(None, example="Interested in Makadi Bay property.")

class LeadCreateResponse(BaseModel):
    lead_id: str
    created_at: str

@app.post("/leads", response_model=LeadCreateResponse, status_code=status.HTTP_201_CREATED)
def create_lead(req: LeadCreateRequest = Body(...)):
    if not req.customer_name or not req.source:
        raise HTTPException(status_code=400, detail="Missing required fields")
    lead_id = str(uuid4())
    lead = Lead(
        lead_id=lead_id,
        customer_name=req.customer_name,
        source=req.source
    )
    add_lead(lead)
    return LeadCreateResponse(lead_id=lead_id, created_at=lead.created_at.isoformat())

@app.get("/leads/{lead_id}", response_model=dict)
def read_lead(lead_id: str):
    lead = get_lead(lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead.to_dict()

@app.get("/leads", response_model=List[dict])
def read_leads():
    return [lead.to_dict() for lead in list_leads()]
