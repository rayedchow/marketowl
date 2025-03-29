from apify_client import ApifyClient

# Initialize the ApifyClient with your API token
client = ApifyClient("apify_api_E5yHpZnaHxAgIIFSLFEojCpHWzXG4R13mKAb")

# Prepare the Actor input
run_input = {
    "startUrls": [{ "url": "https://www.facebook.com/groups/577160885692636/buy_sell_discussion" }],
    "resultsLimit": 20,
    "viewOption": "CHRONOLOGICAL",
}

# Run the Actor and wait for it to finish
run = client.actor("2chN8UQcH1CfxLRNE").call(run_input=run_input)

# Fetch and print Actor results from the run's dataset (if there are any)
for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(item)