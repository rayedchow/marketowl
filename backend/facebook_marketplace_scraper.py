from apify_client import ApifyClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the ApifyClient with your API token
client = ApifyClient(os.getenv("APIFY_API_KEY"))

def scrape_listing(listing_url):
    # Prepare the Actor input
    run_input = {
        "startUrls": [
            # { "url": "https://www.facebook.com/marketplace/sanfrancisco/search/?query=clothing" },
            {"url": "https://www.facebook.com/marketplace/109686922383970/search/?query=White%20Nautica%20Shirt&exact=false"}
        ],
        "resultsLimit": 20,
    }

    # Run the Actor and wait for it to finish
    run = client.actor("U5DUNxhH3qKt5PnCf").call(run_input=run_input)

    
    # Fetch and print Actor results from the run's dataset (if there are any)
    for item in client.dataset(run["defaultDatasetId"]).iterate_items():
        if item.get('listingUrl') == listing_url:
            return item
        # print(item)

listing_url = "https://www.facebook.com/marketplace/item/1148841823392234"
print(scrape_listing(listing_url))
