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
<<<<<<< HEAD
            # Parse the received JSON data
            message_data = json.loads(data)
            
            # Check for specific event types
            if message_data.get("event") == "url-submit":
                # Handle URL submission event
                print(f"URL submitted: {message_data.get('url', 'No URL provided')}")
                
            # Broadcast message to all connected clients
            for connection in active_connections:
                await connection.send_text(data)
=======
            print(f"Received message: {data}")
            # TODO: actually send the suggested message through the user's Facebook Marketplace
>>>>>>> 1840bfd4ca688cf8468b131e808ee76c6ac70c5e
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        active_connections.remove(websocket)
<<<<<<< HEAD
=======


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# # Endpoint to analyze an item's quality using Llama3.2
# @app.get("/api/analyze-image")
# async def analyze_image_endpoint(image_url: str):
#     """
#     Given an image URL, downloads the image, runs analysis with Llama3.2 via Ollama,
#     and returns the analysis results.
#     """
#     try:
#         analysis = await analyze_image_with_llama(image_url)
#         return {"image_url": image_url, "analysis": analysis}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# Endpoint to analyze an item's quality using Llama3.2


@app.get("/api/analyze-listing-image")
async def analyze_listing_image_endpoint(listing_url: str):
    """
    Given an image URL, downloads the image, runs analysis with Llama3.2 via Ollama,
    and returns the analysis results.
    """
    try:
        # listing_data = scrape_listing(listing_url)
        # image_url = listing_data['primary_listing_photo']['photo_image_url']
        image_url = "https://scontent-lga3-3.xx.fbcdn.net/v/t45.5328-4/486797386_2749418898780182_9150082727072859958_n.jpg?stp=c64.0.260.260a_dst-jpg_p261x260_tt6&_nc_cat=104&ccb=1-7&_nc_sid=247b10&_nc_ohc=iKP0IqdDxysQ7kNvgHg_XNV&_nc_oc=Adn2_AiZTMcJil6HkGad78N4-oeS9oCivdi4o6_ID4iv9wF0a0rv7vvPtow1JnH20d8&_nc_zt=23&_nc_ht=scontent-lga3-3.xx&_nc_gid=58xSHjQjqzuQ8bKiFr-pXg&oh=00_AYH-Bb5S3rssB20II0PzJQ20s5qiBQP8WzqDK-WgR1UTmg&oe=67EE5B10"

        analysis = await analyze_image_with_llama(image_url)
        return {"image_url": image_url, "analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
>>>>>>> 1840bfd4ca688cf8468b131e808ee76c6ac70c5e
