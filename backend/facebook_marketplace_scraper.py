from apify_client import ApifyClient

# Initialize the ApifyClient with your API token
client = ApifyClient("apify_api_E5yHpZnaHxAgIIFSLFEojCpHWzXG4R13mKAb")

# Prepare the Actor input
run_input = {
    "startUrls": [
        {"url": "https://www.facebook.com/marketplace/108056275889020/search?query=seattle%20apartments%20for%20rent"},
        # { "url": "https://www.facebook.com/marketplace/prague/search/?query=apartment" },
    ],
    "resultsLimit": 20,
}

# Run the Actor and wait for it to finish
run = client.actor("U5DUNxhH3qKt5PnCf").call(run_input=run_input)

# Process only essential fields from the results
for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    essential_data = {
        'id': item.get('id'),
        'listing_price': {
            'amount': item.get('listing_price', {}).get('amount'),
            'formatted_amount': item.get('listing_price', {}).get('formatted_amount')
        },
        'marketplace_listing_title': item.get('marketplace_listing_title'),
        'custom_title': item.get('custom_title'),
        'location': {
            'city': item.get('location', {}).get('city'),
            'state': item.get('location', {}).get('state')
        },
        'listingUrl': item.get('listingUrl'),
        'primary_listing_photo': {
            'photo_image_url': item.get('primary_listing_photo', {}).get('photo_image_url')
        },
        'is_live': item.get('is_live', False),
        'is_pending': item.get('is_pending', False),
        'is_sold': item.get('is_sold', False),
        'address': item.get('address')
    }

    # Print the processed data in a readable format
    print("\n=== Listing Details ===")
    print(f"ID: {essential_data['id']}")
    print(f"Title: {essential_data['marketplace_listing_title']}")
    print(f"Price: {essential_data['listing_price']['formatted_amount']}")
    print(
        f"Location: {essential_data['location']['city']}, {essential_data['location']['state']}")
    print(f"Status: {'Active' if essential_data['is_live'] else 'Inactive'}")
    print(f"Listing URL: {essential_data['listingUrl']}")
    print("=" * 20)
