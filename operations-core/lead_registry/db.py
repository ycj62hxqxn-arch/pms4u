import sqlite3
from typing import List, Optional
from .model import Lead, LeadState

DB_PATH = "leads.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS leads (
            lead_id TEXT PRIMARY KEY,
            customer_name TEXT,
            source TEXT,
            state TEXT,
            evidence_id TEXT,
            created_at TEXT
        )
    ''')
    conn.commit()
    conn.close()

def add_lead(lead: Lead):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        INSERT OR REPLACE INTO leads (lead_id, customer_name, source, state, evidence_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        lead.lead_id,
        lead.customer_name,
        lead.source,
        lead.state,
        lead.evidence_id,
        lead.created_at.isoformat()
    ))
    conn.commit()
    conn.close()

def get_lead(lead_id: str) -> Optional[Lead]:
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT * FROM leads WHERE lead_id = ?', (lead_id,))
    row = c.fetchone()
    conn.close()
    if row:
        return Lead(
            lead_id=row[0],
            customer_name=row[1],
            source=row[2],
            state=LeadState(row[3]),
            evidence_id=row[4],
            created_at=row[5]
        )
    return None

def list_leads() -> List[Lead]:
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT * FROM leads ORDER BY created_at DESC')
    rows = c.fetchall()
    conn.close()
    return [
        Lead(
            lead_id=row[0],
            customer_name=row[1],
            source=row[2],
            state=LeadState(row[3]),
            evidence_id=row[4],
            created_at=row[5]
        ) for row in rows
    ]
