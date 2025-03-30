from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
import uvicorn
import os

app = FastAPI()

class ListingRequest(BaseModel):
	url: str

def scrape_facebook_marketplace(listing_url: str):
	# Set up Chrome in headless mode
	chrome_options = Options()
	chrome_options.add_argument("--headless")
	# You may need to adjust the path to your ChromeDriver if it's not in PATH.
	driver = webdriver.Chrome(options=chrome_options)
	
	try:
		driver.get(listing_url)
		# Wait for dynamic content to load
		time.sleep(5)
		html = driver.page_source
		soup = BeautifulSoup(html, "html.parser")
		
		# -------------------------------
		# Extract the main image URL
		# -------------------------------
		image_url = None
		image_span = soup.select_one("span.x78zum5.x1vjfegm")
		if image_span:
			img_tag = image_span.find("img")
			if img_tag and img_tag.has_attr("src"):
				image_url = img_tag["src"]
		
		# -------------------------------
		# Extract the title text
		# -------------------------------
		title_text = None
		h1_tag = soup.find("h1")
		if h1_tag:
			title_span = h1_tag.find("span")
			if title_span:
				title_text = title_span.get_text(strip=True)
		print(h1_tag)
		
		# -------------------------------
		# Extract the description text
		# -------------------------------
		description_text = None
		# Adjust this selector based on the current Facebook DOM structure
		description_container = soup.select_one("div.xz9dl7a.x4uap5.xsag5q8.xkhd6sd.x126k92a")
		if description_container:
			description_span = description_container.find("span")
			if description_span:
				description_text = description_span.get_text(strip=True)
		
		return {
			"image_url": image_url,
			"title": title_text,
			"description": description_text
		}
	finally:
		driver.quit()

@app.post("/scrape")
async def scrape_listing(request: ListingRequest):
	try:
		result = scrape_facebook_marketplace(request.url)
		print(result)
		return result
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))

# Add a root endpoint for easy testing
@app.get("/")
async def root():
	return {"message": "Facebook Marketplace Scraper API is running"}

# Add this if you want to run the app directly with python main.py
if __name__ == "__main__":
	# Check if running in development or production
	if os.environ.get("NGROK_AUTHTOKEN"):
		import pyngrok.ngrok as ngrok
		
		# Get the auth token from environment variable
		auth_token = os.environ.get("NGROK_AUTHTOKEN")
		ngrok.set_auth_token(auth_token)
		
		# Open a ngrok tunnel to the HTTP server
		port = 8000
		public_url = ngrok.connect(port).public_url
		print(f"ngrok tunnel \"{public_url}\" -> \"http://localhost:{port}\"")
		
		# Update the FastAPI app with the public URL
		app.root_path = public_url
		
	# Start the FastAPI app
	uvicorn.run(app, host="0.0.0.0", port=9000)