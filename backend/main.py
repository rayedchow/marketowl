from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from apify_client import ApifyClient
from typing import List, Optional
from pydantic import BaseModel
import json

from image_analyzer import analyze_image_with_llama



app = FastAPI()

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active connections
active_connections: List[WebSocket] = []


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast message to all connected clients
            for connection in active_connections:
                await connection.send_text(data)
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        active_connections.remove(websocket)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# Endpoint to analyze an item's quality using Llama3.2
@app.get("/api/analyze-image")
async def analyze_image_endpoint(image_url: str):
    """
    Given an image URL, downloads the image, runs analysis with Llama3.2 via Ollama,
    and returns the analysis results.
    """
    try:
        analysis = await analyze_image_with_llama(image_url)
        return {"image_url": image_url, "analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))