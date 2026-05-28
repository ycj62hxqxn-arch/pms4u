with open('/Users/alaaatia/pms4u/governance-core/src/api/main.py', 'r') as f:
    text = f.read()
if "WebSocketDisconnect" not in text:
    text = text.replace('from fastapi import FastAPI, HTTPException, status, Depends', 'from fastapi import FastAPI, HTTPException, status, Depends, WebSocket, WebSocketDisconnect')
with open('/Users/alaaatia/pms4u/governance-core/src/api/main.py', 'w') as f:
    f.write(text)
