from apify_client import ApifyClient

# Initialize the ApifyClient with your API token
client = ApifyClient("apify_api_E5yHpZnaHxAgIIFSLFEojCpHWzXG4R13mKAb")

# Prepare the Actor input
run_input = {
    "startUrls": [
        { "url": "https://www.facebook.com/marketplace/prague/home-improvements" },
        # { "url": "https://www.facebook.com/marketplace/prague/search/?query=apartment" },
    ],
    "resultsLimit": 20,
}

# Run the Actor and wait for it to finish
run = client.actor("U5DUNxhH3qKt5PnCf").call(run_input=run_input)

# Fetch and print Actor results from the run's dataset (if there are any)
for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(item)