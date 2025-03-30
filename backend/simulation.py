from openai import OpenAI
from pydantic import BaseModel  # Add this import

client = OpenAI(
    base_url="https://rayedchow--example-vllm-openai-compatible-serve.modal.run/v1",
	api_key="super-secret-key",
)

# Define Response as a proper Pydantic model
class Response(BaseModel):
    messages: list[str]

SELLER_ROLE = "You are a seller on Facebook Marketplace that imitates what real sellers act like to assist simulations of negotiation conversations to be as accurate as possible. You are given the chat history of what the seller and buyer have said about a negotiation conversation regarding a specific product that will also be provided to you. Imitate what the seller would respond to the buyer with 3 various personalities: The Firm & No-Nonsense Seller, The Flexible & Friendly Seller, and The Opportunistic & Emotional Seller"

BUYER_ROLE = "You are a buyer on Facebook Marketplace that imitates what real buyers act like to assist simulations of negotiation conversations to be as accurate as possible. You are given the chat history of what the seller and buyer have said about a negotiation conversation regarding a specific product that will also be provided to you, and you are also given data about flaws about the product that are observed from the product's listing image. Generate the best possible responses to send to the seller to lower and negotiate to the lowest price possible."

async def first_layer(listing_data, flaw_data, chat_history):

    completion = client.chat.completions.create(
        model="charlesfrye/Ministral-8B-Instruct-2410-FP8-Dynamic",
        messages=[
            {"role": "system", "content": BUYER_ROLE },
            {"role": "user", "content": f"Generate me 10 possible messages in a JSON list format of what a buyer should preferrably say in response to the buyer's last few messages. This is the product info that you are negotiating to buy on Facebook Marketplace: Titled '{listing_data['title']}' with description '{listing_data['description']}' and current price of '{listing_data['price']}'. This is the current chat history: {chat_history}. Give me 10 messages, each one varying to have different simulations and calculate the best possible message later on. These are flaws that you have observed from the product's listing image: {(', ').join(flaw_data)}. Bring these flaws up when necessary and don't mess up the flow of the negotiation. JUST OUTPUT THE MESSAGE TEXTS NOTHING ELSE"}
        ],
        extra_body={"guided_json": Response.model_json_schema()},
    )
    
    # Parse the response content as JSON and print the messages
    import json
    try:
        response_content = completion.choices[0].message.content
        print("Raw response:", response_content)
        
        # Try to parse the JSON response
        response_json = json.loads(response_content)
        return response_json['messages']
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {e}")
        print("Raw response was:", response_content)
    except Exception as e:
        print(f"Unexpected error: {e}")

async def seller_layer(listing_data, flaw_data, chat_history):
    completion = client.chat.completions.create(
        model="charlesfrye/Ministral-8B-Instruct-2410-FP8-Dynamic",
        messages=[
            {"role": "system", "content": SELLER_ROLE },
            {"role": "user", "content": f"Generate me 3 varying possible messages in a JSON list format of what a seller would say in response to the buyer's last few messages. This is the product info that you are selling on Facebook Marketplace: Titled '{listing_data['title']}' with description '{listing_data['title']}' and price of '{listing_data['price']}'. This is the current chat history: {chat_history}. Give me 3 messages, each one with varying personalities of a seller in response to the last message from the buyer. JUST OUTPUT THE MESSAGE TEXTS NOTHING ELSE"}
        ],
        extra_body={"guided_json": Response.model_json_schema()},
    )

    # Parse the response content as JSON and print the messages
    import json
    try:
        response_content = completion.choices[0].message.content
        print("Raw response:", response_content)
        
        # Try to parse the JSON response
        response_json = json.loads(response_content)
        return response_json['messages']
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {e}")
        print("Raw response was:", response_content)
    except Exception as e:
        print(f"Unexpected error: {e}")

async def third_layer(listing_data, flaw_data, chat_history):
    completion = client.chat.completions.create(
        model="charlesfrye/Ministral-8B-Instruct-2410-FP8-Dynamic",
        messages=[
            {"role": "system", "content": BUYER_ROLE },
            {"role": "user", "content": f"Generate me 3 possible messages in a JSON list format of what a buyer should preferrably say in response to the buyer's last few messages. This is the product info that you are negotiating to buy on Facebook Marketplace: Titled '{listing_data['title']}' with description '{listing_data['description']}' and current price of '{listing_data['price']}'. This is the current chat history: {chat_history}. Give me 3 messages, each one varying to have different simulations and calculate the best possible message later on. These are flaws that you have observed from the product's listing image: {(', ').join(flaw_data)}. Bring these flaws up when necessary and don't mess up the flow of the negotiation. JUST OUTPUT THE MESSAGE TEXTS NOTHING ELSE"}
        ],
        extra_body={"guided_json": Response.model_json_schema()},
    )
    
    # Parse the response content as JSON and print the messages
    import json
    try:
        response_content = completion.choices[0].message.content
        print("Raw response:", response_content)
        
        # Try to parse the JSON response
        response_json = json.loads(response_content)
        return response_json['messages']
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {e}")
        print("Raw response was:", response_content)
    except Exception as e:
        print(f"Unexpected error: {e}")

async def simulation_algorithm(listing_data, flaw_data, chat_history):
    # First step
    first_layer_messages = await first_layer(listing_data, flaw_data, chat_history)
    
    # Process each first layer message in parallel
    import asyncio
    
    async def process_buyer_layer(buyer_message):
        # Create a new chat history with the first layer message added
        updated_chat_history = f"{chat_history} Buyer: {buyer_message}"
        # Run second layer with the updated chat history
        seller_responses = await seller_layer(listing_data, flaw_data, updated_chat_history)
        
        # Process each seller response in parallel
        async def process_seller_layer(seller_response):
            # Create a new chat history with both buyer and seller messages
            third_layer_chat_history = f"{updated_chat_history} Seller: {seller_response}"
            # Run third layer with the updated chat history
            buyer_replies = await third_layer(listing_data, flaw_data, third_layer_chat_history)
            
            # Process each buyer reply in parallel for the fourth layer
            async def process_fourth_layer(buyer_reply):
                # Create a new chat history with all previous messages
                fourth_layer_chat_history = f"{third_layer_chat_history} Buyer: {buyer_reply}"
                # Run seller layer again to get fourth layer responses
                seller_final_responses = await seller_layer(listing_data, flaw_data, fourth_layer_chat_history)
                # Return the complete conversation thread
                return {
                    "initial_buyer": buyer_message,
                    "seller_response": seller_response,
                    "buyer_reply": buyer_reply,
                    "seller_final_responses": seller_final_responses
                }
            
            # Create tasks for all buyer replies
            fourth_layer_tasks = [process_fourth_layer(reply) for reply in buyer_replies]
            # Run all fourth layer tasks in parallel
            return await asyncio.gather(*fourth_layer_tasks)
        
        # Create tasks for all seller responses
        third_layer_tasks = [process_seller_layer(response) for response in seller_responses]
        # Run all third layer tasks in parallel
        return await asyncio.gather(*third_layer_tasks)
    
    # Create tasks for all first layer messages
    second_layer_tasks = [process_buyer_layer(message) for message in first_layer_messages]
    
    # Run all second layer tasks in parallel and gather results
    all_conversation_threads = await asyncio.gather(*second_layer_tasks)
    
    # Flatten the results into a single list of conversation threads
    flattened_conversations = []
    for thread_group in all_conversation_threads:
        for nested_group in thread_group:
            flattened_conversations.extend(nested_group)
    
    # Return the compiled conversations
    return {
        "conversations": flattened_conversations,
        "total_simulations": len(flattened_conversations)
    }