import sys

def patch_main():
    with open('src/api/main.py', 'r') as f:
        content = f.read()

    # We will append the Rebuild endpoints
    imports = """from src.runtime.replay_engine import ReplayEngine
from src.runtime.projection_rebuilder import ProjectionRebuilder\n"""

    if "from src.runtime.replay_engine import ReplayEngine" not in content:
        content = content.replace('from pydantic import BaseModel', imports + 'from pydantic import BaseModel', 1)

    endpoints = """
@app.get("/runtime/divergence-report")
def get_divergence_report(db: Session = Depends(get_db)):
    \"\"\"
    Detects if the Projection Cache (DB) has drifted or been corrupted 
    away from the Immutable Ledger.
    \"\"\"
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
    \"\"\"
    DROPS the current DB Projection entirely and rebuilds reality 
    strictly from the signed JSONL Execution Ledger.
    \"\"\"
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
"""

    if "/runtime/rebuild-projection" not in content:
        content += endpoints

    with open('src/api/main.py', 'w') as f:
        f.write(content)
        
    print("Patched main.py successfully with Deterministic Replay Endpoints")

if __name__ == '__main__':
    patch_main()
