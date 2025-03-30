from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
import json
import httpx 
from image_analyzer import analyze_image_with_llama
from openai import OpenAI
import asyncio
import threading
from simulation import simulation_algorithm
from websocket_state import active_connections
import random
# Add Selenium imports at the top level
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
import time

app = FastAPI()
client = OpenAI(
    base_url="https://rayedchow--example-vllm-openai-compatible-serve.modal.run/v1",
	api_key="super-secret-key"
)  # Initialize OpenAI client
current_chat_data = []
# Store the messenger tab handle globally
messenger_tab_handle = None
messenger_driver = None

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
flaws = []

# Update on Facebook Marketplace
async def update_suggestions(message: str):
    for connection in active_connections:
        try:
            await connection.send_text("Suggestions should be sent here")
            # TODO: send actual suggestions for the frontend to format and display
        except Exception as e:
            print(f"Error sending message to client: {e}")

async def trigger_response(listing_data, flaw_data, broadcast_callback):
    global current_chat_data  # Add this line to access the global variable
    chat_history_str = " ".join(f"{msg['sender'].capitalize()}: {msg['message']}" for msg in current_chat_data)
    print(f"Chat history: {chat_history_str}")
    return await simulation_algorithm(listing_data, flaw_data, chat_history_str, broadcast_callback)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    # Declare globals at the beginning of the function
    global messenger_driver, messenger_tab_handle, current_chat_data
    
    await websocket.accept()
    print('WebSocket connection accepted')
    active_connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received raw data: {data}")
            
            # Parse the JSON data
            try:
                data_json = json.loads(data)

                if data_json.get('type') == 'send':
                    message = data_json.get('message')
                    # Use the stored driver and tab handle to send a message
                    if messenger_driver and messenger_tab_handle:
                        # Run in a separate thread to avoid blocking the WebSocket
                        threading.Thread(
                            target=send_message_to_messenger,
                            args=(messenger_driver, messenger_tab_handle, message)
                        ).start()
                        await websocket.send_text(json.dumps({"type": "message-sent", "status": "success"}))
                    else:
                        await websocket.send_text(json.dumps({"type": "message-sent", "status": "error", "message": "Messenger tab not connected"}))
                
                if data_json.get('type') == 'simulate':
                    # Check Messenger chat data when simulate is triggered
                    chat_data, driver, tab_handle = extract_messages_from_selenium()
                    # Store the driver and tab handle globally
                    messenger_driver = driver
                    messenger_tab_handle = tab_handle
                    
                    current_chat_data = chat_data
                    print(f"Updated chat data: {chat_data}")
                    
                    url = data_json.get('url')
                    print(f"Processing URL: {url}")
                    
                    try:
                        # Import httpx if not already imported
                        import httpx
                        
                        print('Initiating HTTP request to scraper service')
                        async with httpx.AsyncClient(timeout=30.0) as httpclient:
                            try:
                                print('Sending request to scraper service')
                                response = await httpclient.post(
                                    "https://pools-isp-marble-international.trycloudflare.com/scrape",
                                    json={"url": url}
                                )
                                print(f'Response status: {response.status_code}')
                                
                                if response.status_code == 200:
                                    result = response.json()
                                    print(f"Scrape result: {result}")
                                    listing_data = {
                                        'title': result['title'],
                                        'price': result['price'],
                                        'description': result['description']
                                    }

                                    # Fix: Await the coroutine function
                                    # Replace analyze_image_with_llama with direct POST request
                                    try:
                                        async with httpx.AsyncClient() as analysis_client:
                                            flaw_response = await analysis_client.post(
                                                "https://suffer-basement-borders-dee.trycloudflare.com/analyze-image",
                                                json={"image_url": result["image_url"]},
                                                timeout=30.0
                                            )

                                            
                                            # Check if response is valid
                                            if flaw_response.status_code == 200:
                                                try:
                                                    flaw_data = flaw_response.json()
                                                    print(f"Flaw analysis result: {flaw_data}")
                                                    # Define broadcastCallback with access to asyncio
                                                    async def broadcastCallback(data):
                                                        import asyncio  # Add local import to ensure availability
                                                        print(f"Broadcasting to WebSocket: {data}") 
                                                        try:
                                                            await asyncio.gather(*[connection.send_text(data) for connection in active_connections])
                                                            await asyncio.sleep(0)  # Forces WebSocket to process immediately
                                                        except Exception as e:
                                                            print(f"Error sending WebSocket message: {e}")
                                                    algorithm_results = await trigger_response(listing_data, flaw_data, broadcastCallback)
                                                    await websocket.send_text(json.dumps({"type": "results", "flaws": flaw_data, "algorithm_results": algorithm_results, "engagement": random.randint(60, 100)}))
                                                except json.JSONDecodeError as je:
                                                    print(f"Invalid JSON in flaw analysis response: {flaw_response.text}")
                                                    flaw_data = {"defects": []}
                                            else:
                                                print(f"Error from analysis service: {flaw_response.status_code} - {flaw_response.text}")
                                                flaw_data = {"defects": [{"description": f"Error: {flaw_response.status_code}", "location": ["unknown"]}]}
                                    except Exception as e:
                                        print(f"Error during image analysis request: {str(e)}")
                                        flaw_data = {"defects": [{"description": f"Error: {str(e)}", "location": ["unknown"]}]}
                                    
                                    # Send results back to the client
                                    await websocket.send_text(json.dumps({"flaws": flaws, "scrape_data": result}))
                                else:
                                    error_msg = f"Error from scrape service: {response.status_code}"
                                    print(error_msg)
                                    await websocket.send_text(json.dumps({"error": error_msg}))
                            except httpx.RequestError as exc:
                                error_msg = f"HTTP Request failed: {exc}"
                                print(error_msg)
                                await websocket.send_text(json.dumps({"error": error_msg}))
                    except Exception as e:
                        error_msg = f"Error during HTTP request: {str(e)}"
                        print(error_msg)
                        await websocket.send_text(json.dumps({"error": error_msg}))
                else:
                    print(f"Unknown message type: {data_json.get('type')}")
            except json.JSONDecodeError:
                print(f"Invalid JSON received: {data}")
                await websocket.send_text(json.dumps({"error": "Invalid JSON format"}))
                
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        active_connections.remove(websocket)
        print("WebSocket connection closed")

# Function to send a message using the stored driver and tab handle
def send_message_to_messenger(driver, tab_handle, message_text):
    try:
        # Switch to the messenger tab
        driver.switch_to.window(tab_handle)
        # Send the message
        send_message(driver, message_text)
        return True
    except Exception as e:
        print(f"Error sending message to Messenger: {e}")
        return False

# Extract messages function moved outside the selenium loop
def extract_messages_from_selenium():
    # Remove duplicate imports since they're now at the top level
    
    # Connect to running Arc instance
    chrome_options = webdriver.ChromeOptions()
    chrome_options.debugger_address = "127.0.0.1:9222"
    driver = webdriver.Chrome(options=chrome_options)

    # Wait to ensure all tabs load
    time.sleep(2)
    
    # Find Messenger tab by title or URL
    messenger_tab = None
    print(driver.window_handles)
    for handle in driver.window_handles:
        driver.switch_to.window(handle)
        print(driver.title)
        if "Messenger | Facebook" in driver.title or "messenger.com" in driver.current_url:
            messenger_tab = handle
            break
    
    # If Messenger tab is found, switch to it
    if messenger_tab:
        driver.switch_to.window(messenger_tab)
    else:
        print("Messenger tab not found!")
        driver.quit()
        return [], None, None
    
    def extract_messages(driver, html):
        soup = BeautifulSoup(html, 'html.parser')
        messages = driver.find_elements(By.XPATH, "//div[@dir='auto']")  # Extract message elements
        
        chat_data = []
        
        for message in messages:
            try:
                content = message.text.strip()
                if not content:
                    continue  # Skip empty messages
                
                sender_html = message.get_attribute("outerHTML")  # Store full HTML of the message div
                
                chat_data.append({"sender": sender_html, "message": content})
            
            except Exception as e:
                pass  # Skip any errors
        
        # Determine sender identity based on class comparison
        if chat_data:
            first_class = BeautifulSoup(chat_data[0]['sender'], 'html.parser').div.get('class', [])
            
            for item in chat_data:
                item_classes = BeautifulSoup(item['sender'], 'html.parser').div.get('class', [])
                item["sender"] = "buyer" if item_classes == first_class else "seller"
        
        return chat_data
    
    # Extract messages once and return the result
    chat_data = extract_messages(driver, driver.page_source)
    # Return the chat data, driver, and tab handle
    return chat_data, driver, messenger_tab

# Keep the send_message function for potential future use
def send_message(driver, message_text):
    try:
        # Find the message input box (Messenger chatbox)
        chatbox = driver.find_element(By.CSS_SELECTOR, 'div[contenteditable="true"][role="textbox"]')
        
        # Click the chatbox to focus (optional but helps ensure input works)
        chatbox.click()
        
        # Type the message
        print(message_text)
        chatbox.send_keys(message_text)
        time.sleep(1)  # Allow time for input

        print(f"Sent: {message_text}")

    except Exception as e:
        print("Error sending message:", str(e))

# Remove the continuous selenium loop and update startup event
@app.on_event("startup")
def startup_event():
    print("FastAPI server starting up...")
    print("WebSocket endpoint registered at ws://localhost:8000/ws")
    print("Selenium will be triggered on simulate events")

# Add this at the bottom of your file to ensure the app runs
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)