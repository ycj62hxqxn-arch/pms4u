from sqlalchemy.orm import Session
from src.db.models import ProjectionEntity
from .replay_engine import ReplayEngine
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)

class ProjectionRebuilder:
    def __init__(self, db_session: Session, replay_engine: ReplayEngine):
        self.db = db_session
        self.replay = replay_engine

    @staticmethod
    def _parse_timestamp(value):
        if value is None:
            return None
        if isinstance(value, datetime):
            return value
        if isinstance(value, str):
            normalized = value[:-1] if value.endswith("Z") else value
            try:
                return datetime.fromisoformat(normalized)
            except ValueError:
                return None
        return None

    def _upsert_projection(self, entity_id: str, snapshot: dict):
        projection = self.db.query(ProjectionEntity).filter_by(entity_id=entity_id).first()
        projected_at = self._parse_timestamp(snapshot.get("updated_at") or snapshot.get("last_updated"))

        if projection is None:
            projection = ProjectionEntity(entity_id=entity_id)
            self.db.add(projection)

        projection.current_state = snapshot["state"]
        projection.projection_version = snapshot["version"]
        projection.last_event_hash = snapshot.get("last_event_hash") or snapshot.get("last_hash")
        projection.last_transition_id = snapshot.get("last_transition_id")
        projection.last_evidence_id = snapshot.get("last_evidence_id")
        projection.last_updated = projected_at
        projection.updated_at = projected_at

        self.db.commit()
        self.db.refresh(projection)
        return projection

    def apply_committed_event(self, event_record):
        """
        Update the live projection immediately after a ledger commit.
        This keeps the read model in step with the authoritative event stream.
        """
        projection = self.db.query(ProjectionEntity).filter_by(entity_id=event_record.entity_id).first()
        next_version = (projection.projection_version if projection else 0) + 1

        snapshot = {
            "state": event_record.next_state,
            "version": next_version,
            "last_updated": event_record.created_at,
            "updated_at": event_record.created_at,
            "last_hash": event_record.event_hash,
            "last_event_hash": event_record.event_hash,
            "last_transition_id": event_record.transition_id,
            "last_evidence_id": event_record.evidence_id,
        }

        return self._upsert_projection(event_record.entity_id, snapshot)

    def rebuild_projection_for_entity(self, entity_id: str):
        """
        Rebuild a single entity projection from the immutable ledger truth.
        """
        snapshot = self.replay.replay_entity(entity_id)
        if not snapshot:
            projection = self.db.query(ProjectionEntity).filter_by(entity_id=entity_id).first()
            if projection is not None:
                self.db.delete(projection)
                self.db.commit()
            return None

        return self._upsert_projection(entity_id, snapshot)

    def detect_divergence(self) -> list:
        """
        Compare the existing DB projection cache with the replay truth.
        Returns a list of divergences.
        """
        reconstructed = self.replay.replay_all()
        
        divergences = []
        
        all_db_entities = {
            ent.entity_id: ent for ent in self.db.query(ProjectionEntity).all()
        }

        # Check ledger truth against DB
        for entity_id, truth in reconstructed.items():
            db_entity = all_db_entities.get(entity_id)
            if not db_entity:
                divergences.append({
                    "entity_id": entity_id, 
                    "issue": "Missing in projection cache", 
                    "expected": truth["state"]
                })
            else:
                expected_version = truth.get("version")
                expected_last_hash = truth.get("last_event_hash") or truth.get("last_hash")
                expected_transition_id = truth.get("last_transition_id")
                expected_evidence_id = truth.get("last_evidence_id")

                if (
                    db_entity.current_state != truth["state"]
                    or db_entity.projection_version != expected_version
                    or db_entity.last_event_hash != expected_last_hash
                    or db_entity.last_transition_id != expected_transition_id
                    or db_entity.last_evidence_id != expected_evidence_id
                ):
                    divergences.append({
                        "entity_id": entity_id,
                        "issue": "Projection stale or divergent from ledger truth",
                        "projection_state": db_entity.current_state,
                        "replayed_state": truth["state"],
                        "projection_version": db_entity.projection_version,
                        "replayed_version": expected_version,
                        "projection_last_event_hash": db_entity.last_event_hash,
                        "replayed_last_event_hash": expected_last_hash,
                    })
                
        # Check DB projections that have no ledger backed truth
        for db_ent_id, db_ent in all_db_entities.items():
            if db_ent_id not in reconstructed:
                divergences.append({
                    "entity_id": db_ent.entity_id, 
                    "issue": "Exists in projection but missing in Ledger (Phantom Entity)", 
                    "projection_state": db_ent.current_state
                })
                
        return divergences

    def rebuild_projection(self):
        """
        Drops all projection entities and rebuilds them strictly from the replay engine.
        Proves state reconstructability (DB is purely disposable).
        """
        logging.info("Starting deterministic rebuild of operational projection...")
        
        # This acts as our single source of truth reconstruction
        reconstructed = self.replay.replay_all()
        
        # 1. Wipe DB projection (Disposable Cache)
        self.db.query(ProjectionEntity).delete()
        self.db.commit()
        
        # 2. Re-populate from truth
        added_count = 0
        for entity_id, data in reconstructed.items():
            proj = ProjectionEntity(
                entity_id=entity_id,
                current_state=data["state"],
                projection_version=data["version"],
                last_event_hash=data.get("last_event_hash") or data.get("last_hash"),
                last_transition_id=data.get("last_transition_id"),
                last_evidence_id=data.get("last_evidence_id"),
                last_updated=self._parse_timestamp(data.get("updated_at") or data.get("last_updated")),
                updated_at=self._parse_timestamp(data.get("updated_at") or data.get("last_updated"))
            )
            self.db.add(proj)
            added_count += 1
            
        self.db.commit()
        logging.info(f"Projection rebuilt successfully. Reality restored for {added_count} entities.")
        return added_count
