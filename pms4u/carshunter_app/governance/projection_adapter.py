import sqlite3
import os
from .receipts import ExecutionReceipt

class ProjectionUpdater:
    def __init__(self, db_path="carshunter.db"):
        self.db_path = db_path
        self._init_schema()

    def _init_schema(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        # This is solely a PROJECTION CACHE, not the source of truth!
        cur.execute('''
            CREATE TABLE IF NOT EXISTS hunts_projection (
                id TEXT PRIMARY KEY,
                status TEXT NOT NULL,
                last_evidence_id TEXT,
                version INTEGER DEFAULT 0
            )
        ''')
        conn.commit()
        conn.close()

    def commit_receipt(self, hunt_id: str, receipt: ExecutionReceipt):
        """
        Dumb synchronization layer.
        Does NOT contain governance rules, only applies the Receipt if approved.
        """
        if not receipt.approved:
            return False

        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        
        # Upsert the projection. If it was corrupt, this correctly patches it based on receipt
        version = receipt.projection_version or 0
        
        cur.execute('''
            INSERT INTO hunts_projection (id, status, last_evidence_id, version)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                status=excluded.status,
                last_evidence_id=excluded.last_evidence_id,
                version=excluded.version
        ''', (hunt_id, receipt.transition, receipt.evidence_id, version))
        
        conn.commit()
        conn.close()
        return True

    def get_current_state(self, hunt_id: str):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute('SELECT status FROM hunts_projection WHERE id=?', (hunt_id,))
        row = cur.fetchone()
        conn.close()
        return row[0] if row else "INTAKE"
