from typing import Dict
from fastapi import WebSocket

class ConstitutionalEventBus:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket

    def disconnect(self, websocket: WebSocket):
        for k, v in list(self.active_connections.items()):
            if v == websocket:
                del self.active_connections[k]
                
    async def broadcast(self, message: dict):
        for connection in self.active_connections.values():
            await connection.send_json(message)

bus = ConstitutionalEventBus()
