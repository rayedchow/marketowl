from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from apify_client import ApifyClient
from typing import List, Optional
from pydantic import BaseModel
import json

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

# Pydantic models for data validation


class Location(BaseModel):
    city: Optional[str]
    state: Optional[str]


class ListingPrice(BaseModel):
    amount: Optional[str]
    formatted_amount: Optional[str]


class Photo(BaseModel):
    photo_image_url: Optional[str]


class Listing(BaseModel):
    id: Optional[str]
    listing_price: Optional[ListingPrice]
    marketplace_listing_title: Optional[str]
    custom_title: Optional[str]
    location: Optional[Location]
    listingUrl: Optional[str]
    primary_listing_photo: Optional[Photo]
    is_live: bool = False
    is_pending: bool = False
    is_sold: bool = False
    address: Optional[str]


# Initialize ApifyClient
client = ApifyClient("apify_api_E5yHpZnaHxAgIIFSLFEojCpHWzXG4R13mKAb")


@app.get("/api/listings", response_model=List[Listing])
async def get_listings(query: str = "seattle apartments for rent", limit: int = 20):
    run_input = {
        "startUrls": [
            {"url": f"https://www.facebook.com/marketplace/108056275889020/search?query={query}"}
        ],
        "resultsLimit": limit,
    }

    # Run the Actor
    run = client.actor("U5DUNxhH3qKt5PnCf").call(run_input=run_input)

    # Process results
    listings = []
    for item in client.dataset(run["defaultDatasetId"]).iterate_items():
        listing = Listing(
            id=item.get('id'),
            listing_price=ListingPrice(
                amount=item.get('listing_price', {}).get('amount'),
                formatted_amount=item.get(
                    'listing_price', {}).get('formatted_amount')
            ),
            marketplace_listing_title=item.get('marketplace_listing_title'),
            custom_title=item.get('custom_title'),
            location=Location(
                city=item.get('location', {}).get('city'),
                state=item.get('location', {}).get('state')
            ),
            listingUrl=item.get('listingUrl'),
            primary_listing_photo=Photo(
                photo_image_url=item.get(
                    'primary_listing_photo', {}).get('photo_image_url')
            ),
            is_live=item.get('is_live', False),
            is_pending=item.get('is_pending', False),
            is_sold=item.get('is_sold', False),
            address=item.get('address')
        )
        listings.append(listing)

    return listings


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
