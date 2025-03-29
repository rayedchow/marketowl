from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
import json

from facebook_marketplace_scraper import scrape_listing
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

# Update on Facebook Marketplace
async def update_suggestions(message: str):
    for connection in active_connections:
        try:
            await connection.send_text("Suggestions should be sent here")
            # TODO: send actual suggestions for the frontend to format and display
        except Exception as e:
            print(f"Error sending message to client: {e}")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received message: {data}")
            # TODO: actually send the suggested message through the user's Facebook Marketplace
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        active_connections.remove(websocket)
