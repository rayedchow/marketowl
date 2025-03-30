from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
import json
import httpx  # Add this import
# from facebook_marketplace_scraper import scrape_listing
from image_analyzer import analyze_image_with_llama
from openai import OpenAI
import asyncio
import threading

app = FastAPI()
client = OpenAI(
    base_url="https://rayedchow--example-vllm-openai-compatible-serve.modal.run/v1",
	api_key="super-secret-key"
)  # Initialize OpenAI client

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
flaws = []

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
    print('socket')
    active_connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received raw data: {data}")
            
            # Parse the JSON data
            try:
                data_json = json.loads(data)
                
                if data_json.get('type') == 'listing_url':
                    url = data_json.get('url')
                    print(f"Processing URL: {url}")
                    
                    # Import httpx if not already imported
                    import httpx
                    
                    async with httpx.AsyncClient() as httpclient:
                        response = await httpclient.post(
                            "http://localhost:9000/scrape",
                            json={"url": url}
                        )
                        if response.status_code == 200:
                            result = response.json()
                            # Process the result as needed
                            print(f"Scrape result: {result}")
                            
                            # You can still use your image analyzer if needed
                            # flaws = analyze_image_with_llama(url)
                            # print(flaws)
                            
                            # Send results back to the client
                            await websocket.send_text(json.dumps({"flaws": flaws, "scrape_data": result}))
                        else:
                            print(f"Error from scrape service: {response.text}")
                            await websocket.send_text(json.dumps({"error": "Failed to scrape listing"}))
                    # get flaws
                    # store data
                else:
                    print(f"Unknown message type: {data_json.get('type')}")
            except json.JSONDecodeError:
                print(f"Invalid JSON received: {data}")
                await websocket.send_text(json.dumps({"error": "Invalid JSON format"}))
                
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        active_connections.remove(websocket)

async def trigger_simulation(message_text="Hello!"):
    try:
        completion = client.chat.completions.create(
            model="charlesfrye/Ministral-8B-Instruct-2410-FP8-Dynamic",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that gets the connotation of the message." },
                {"role": "user", "content": message_text}
            ],
            extra_body={"guided_choice": ["positive", "negative"]},
        )

        connotation = completion.choices[0].message.content
        print(f"Message: {message_text}")
        print(f"Connotation: {connotation}")
        return connotation
    except Exception as e:
        print(f"Error in OpenAI API call: {e}")
        return None

# Move the Selenium code to a separate function that can run in a background thread
def run_selenium_loop():
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.common.keys import Keys
    from bs4 import BeautifulSoup
    import time

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
        if "Facebook" in driver.title or "messenger.com" in driver.current_url:
            messenger_tab = handle
            break
    
    # If Messenger tab is found, switch to it
    if messenger_tab:
        driver.switch_to.window(messenger_tab)
    else:
        print("Messenger tab not found!")
        driver.quit()
        return
    
    # Now, extract messages from the correct tab
    # messages = driver.find_elements(By.CSS_SELECTOR, 'div[dir="auto"]')
    
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
                item["sender"] = "me" if item_classes == first_class else "receiver"
        
        return chat_data
    
    def send_message(driver, message_text):
        try:
            # Find the message input box (Messenger chatbox)
            chatbox = driver.find_element(By.CSS_SELECTOR, 'div[contenteditable="true"][role="textbox"]')
            
            # Click the chatbox to focus (optional but helps ensure input works)
            chatbox.click()
            
            # Type the message
            chatbox.send_keys(message_text)
            time.sleep(1)  # Allow time for input
            
            # Press Enter to send the message
            chatbox.send_keys(Keys.RETURN)
            print(f"Sent: {message_text}")
    
        except Exception as e:
            print("Error sending message:", str(e))
    
    current_chat_data = []
    while True:
        chat_data = extract_messages(driver, driver.page_source)
        if(chat_data != current_chat_data):
            current_chat_data = chat_data
            # trigger_simulation()
            print(chat_data)
        time.sleep(10)

# Start the Selenium loop in a separate thread when the app starts
@app.on_event("startup")
def startup_event():
    print("FastAPI server starting up...")
    print("WebSocket endpoint registered at ws://localhost:8000/ws")
    
    # Start the Selenium loop in a background thread
    selenium_thread = threading.Thread(target=run_selenium_loop, daemon=True)
    selenium_thread.start()
    print("Selenium thread started")

# Add this at the bottom of your file to ensure the app runs
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)