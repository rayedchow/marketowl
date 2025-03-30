from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time

def scrape_facebook_marketplace(listing_url):
	# Set up Chrome in headless mode
	chrome_options = Options()
	chrome_options.add_argument("--headless")
	driver = webdriver.Chrome(options=chrome_options)
	
	# Load the page
	driver.get(listing_url)
	time.sleep(5) # Adjust if needed to allow dynamic content to load
	
	# Parse the page source with BeautifulSoup
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
	# Example: if the title is contained in the first <h1> element
	h1_tag = soup.find("h1")
	if h1_tag:
		title_span = h1_tag.find("span")
		if title_span:
			title_text = title_span.get_text(strip=True)
	
	# -------------------------------
	# Extract the description text
	# -------------------------------
	description_text = None
	# In your snippet, the description appears to be inside a div with specific classes.
	# Adjust the selector below if the structure differs.
	description_container = soup.select_one("div.xz9dl7a.x4uap5.xsag5q8.xkhd6sd.x126k92a")
	if description_container:
		description_span = description_container.find("span")
		if description_span:
			description_text = description_span.get_text(strip=True)
	
	driver.quit()
	return image_url, title_text, description_text

if __name__ == "__main__":
	# Update the URL to your desired Facebook Marketplace listing
	url = "https://www.facebook.com/marketplace/item/1241809007368717/?ref=search&referral_code=null&referral_story_type=post&tracking=browse_serp%3A56b66054-419e-453b-9ac2-8ba03123ea00"
	image, title, description = scrape_facebook_marketplace(url)
	print("Main Image URL:", image)
	print("Listing Title:", title)
	print("Description:", description)