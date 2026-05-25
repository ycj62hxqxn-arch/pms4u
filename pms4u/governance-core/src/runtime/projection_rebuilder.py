from sqlalchemy.orm import Session
from src.db.models import ProjectionEntity
from .replay_engine import ReplayEngine
import logging

logging.basicConfig(level=logging.INFO)

class ProjectionRebuilder:
    def __init__(self, db_session: Session, replay_engine: ReplayEngine):
        self.db = db_session
        self.replay = replay_engine

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
            elif db_entity.current_state != truth["state"]:
                divergences.append({
                    "entity_id": entity_id, 
                    "issue": "Mismatched State. DB corruption likely.", 
                    "projection_state": db_entity.current_state,
                    "replayed_state": truth["state"]
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
                projection_version=data["version"]
                # last_updated could be parsed from data["last_updated"] if needed
            )
            self.db.add(proj)
            added_count += 1
            
        self.db.commit()
        logging.info(f"Projection rebuilt successfully. Reality restored for {added_count} entities.")
        return added_count