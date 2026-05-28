import sys
with open('/Users/alaaatia/pms4u/governance-core/src/api/main.py', 'r') as f:
    content = f.read()

new_imports = """
from src.api.websocket_bus import bus
from governance_sdk.ui_contracts import GovernanceEventUI, ExecutionTraceViewerProps, ConstitutionalEventBusMessage
"""

content = content.replace("from governance_sdk.ui_contracts import GovernanceEventUI, ExecutionTraceViewerProps\n", new_imports.strip() + "\n")

ws_code = """
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
"""

content = content.replace('app = FastAPI(title="Constitutional Execution Runtime", version="1.0")', 'app = FastAPI(title="Constitutional Execution Runtime", version="1.0")\n\n' + ws_code)

with open('/Users/alaaatia/pms4u/governance-core/src/api/main.py', 'w') as f:
    f.write(content)