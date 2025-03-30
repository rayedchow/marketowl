from openai import OpenAI
from pydantic import BaseModel  # Add this import
from websocket_state import active_connections
import json  # Move this import to the top level
import asyncio

N = 10

client = OpenAI(
    base_url="https://rayedchow--example-vllm-openai-compatible-serve.modal.run/v1",
	api_key="super-secret-key",
)

# Define Response as a proper Pydantic model
class Response(BaseModel):
    messages: list[str]

class FinalResponse(BaseModel):
    messages: list[str]
    scores: list[float]

SELLER_ROLE = "You are a seller on Facebook Marketplace that imitates what real sellers act like to assist simulations of negotiation conversations to be as accurate as possible. You are given the chat history of what the seller and buyer have said about a negotiation conversation regarding a specific product that will also be provided to you. Imitate what the seller would respond to the buyer with 3 various personalities: The Firm & No-Nonsense Seller, The Flexible & Friendly Seller, and The Opportunistic & Emotional Seller"

BUYER_ROLE = "You are a buyer on Facebook Marketplace that imitates what real buyers act like to assist simulations of negotiation conversations to be as accurate as possible. You are given the chat history of what the seller and buyer have said about a negotiation conversation regarding a specific product that will also be provided to you, and you are also given data about flaws about the product that are observed from the product's listing image. Generate the best possible responses to send to the seller to lower and negotiate to the lowest price possible."

async def first_layer(listing_data, flaw_data, chat_history):

    completion = await asyncio.to_thread(client.chat.completions.create,  
        model="charlesfrye/Ministral-8B-Instruct-2410-FP8-Dynamic",
        messages=[
            {"role": "system", "content": BUYER_ROLE },
            {"role": "user", "content": f"Generate me {N} possible messages in a JSON list format of what a buyer should preferrably say in response to the buyer's last few messages. This is the product info that you are negotiating to buy on Facebook Marketplace: Titled '{listing_data['title']}' with description '{listing_data['description']}' and current price of '{listing_data['price']}'. This is the current chat history: {chat_history}. Give me {N} messages, each one varying to have different simulations and calculate the best possible message later on. These are flaws that you have observed from the product's listing image: {(', ').join(flaw_data)}. Bring these flaws up when necessary and don't mess up the flow of the negotiation. JUST OUTPUT THE MESSAGE TEXTS NOTHING ELSE"}
        ],
        extra_body={"guided_json": Response.model_json_schema()},
    )
    
    # Parse the response content as JSON and print the messages
    import json
    try:
        response_content = completion.choices[0].message.content
        
        # Try to parse the JSON response
        response_json = json.loads(response_content)
        return response_json['messages']
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {e}")
        print("Raw response was:", response_content)
    except Exception as e:
        print(f"Unexpected error: {e}")

async def seller_layer(listing_data, flaw_data, chat_history):
    completion = await asyncio.to_thread(client.chat.completions.create,  
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
        
        # Try to parse the JSON response
        response_json = json.loads(response_content)
        return response_json['messages']
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {e}")
        print("Raw response was:", response_content)
    except Exception as e:
        print(f"Unexpected error: {e}")

async def third_layer(listing_data, flaw_data, chat_history):
    completion = await asyncio.to_thread(client.chat.completions.create,  
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
        
        # Try to parse the JSON response
        response_json = json.loads(response_content)
        return response_json['messages']
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {e}")
        print("Raw response was:", response_content)
    except Exception as e:
        print(f"Unexpected error: {e}")

async def final_layer(listing_data, flaw_data, chat_history, first_message, broadcast_callback):
    completion = await asyncio.to_thread(client.chat.completions.create,  
        model="charlesfrye/Ministral-8B-Instruct-2410-FP8-Dynamic",
        messages=[
            {"role": "system", "content": SELLER_ROLE },
            {"role": "user", "content": f"Generate me 3 varying possible messages in a JSON list format of what a seller would say in response to the buyer's last few messages. This is the product info that you are selling on Facebook Marketplace: Titled '{listing_data['title']}' with description '{listing_data['title']}' and price of '{listing_data['price']}'. This is the current chat history: {chat_history}. Give me 3 messages, each one with varying personalities of a seller in response to the last message from the buyer. JUST OUTPUT THE MESSAGE TEXTS NOTHING ELSE. Then, score each of the three simulations (the past 4 messages between the seller and the buyer, including the ones you generated) on how well it simulates a real negotiation conversation and how well it was able to negotiate down, fulfilling the buyer's goal of getting the lowest price possible. YOU MUST GIVE ME THE SCORE AS A FLOAT STRICTLY FROM -1 (is not realistic at all and does not help negotiate down) to 1 (is realistic and helps negotiate down a lot). DO NOT GO BELOW -1 OR ABOVE 1."}
        ],
        extra_body={"guided_json": FinalResponse.model_json_schema()},
    )

    try:
        response_content = completion.choices[0].message.content
        response_json = json.loads(response_content)

        message_data = {
            "type": "simulation_score",
            "data": {
                "message": first_message,
                "score": sum(response_json['scores']) / len(response_json['scores'])
            }
        }
        message_str = json.dumps(message_data)

        print("Broadcasting simulation data...")
        print(message_str)

        # ✅ Modified to handle closed connections
        for connection in active_connections.copy():  # Use a copy to avoid modification during iteration
            try:
                await connection.send_text(message_str)
            except Exception as e:
                print(f"Error sending to connection: {e}")
                # You might want to remove closed connections here if needed
                # active_connections.remove(connection)

        return {
            "message": first_message,
            "score": sum(response_json['scores']) / len(response_json['scores'])
        }

    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {e}")
        print("Raw response was:", response_content)
    except Exception as e:
        print(f"Unexpected error: {e}")

async def simulation_algorithm(listing_data, flaw_data, chat_history, broadcast_callback):
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
                # Use final_layer instead of seller_layer for the fourth layer
                final_response = await final_layer(listing_data, flaw_data, fourth_layer_chat_history, buyer_message, broadcast_callback)
                
                # Return the complete conversation thread with score
                return {
                    "message": final_response['message'],
                    "score": final_response['score']
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
    all_threads = await asyncio.gather(*second_layer_tasks)
    print(all_threads[0][0][0])
    
    # Rank messages based on their average scores
    ranked_messages = rank_messages_by_score(all_threads)
    print("Ranked messages by score:", ranked_messages)
    
    # Return the compiled conversations
    return ranked_messages

def rank_messages_by_score(all_threads):
    """
    Traverses through all simulation threads and ranks messages by their average scores.
    
    Args:
        all_threads: Nested list of simulation results
        
    Returns:
        List of dictionaries with messages and their average scores, sorted by score
    """
    # Dictionary to store message scores
    message_scores = {}
    message_counts = {}
    
    # Traverse through the nested structure
    for buyer_thread in all_threads:
        for seller_thread in buyer_thread:
            for result in seller_thread:
                if 'message' in result and 'score' in result:
                    message = result['message']
                    score = result['score']
                    
                    # Add to running total
                    if message not in message_scores:
                        message_scores[message] = 0
                        message_counts[message] = 0
                    
                    message_scores[message] += score
                    message_counts[message] += 1
    
    # Calculate average scores
    message_averages = []
    for message, total_score in message_scores.items():
        count = message_counts[message]
        average = total_score / count if count > 0 else 0
        message_averages.append({
            "message": message,
            "average_score": average,
            "sample_count": count
        })
    
    # Sort by average score in descending order
    ranked_messages = sorted(message_averages, key=lambda x: x['average_score'], reverse=True)
    
    print("got ranked messages")
    return ranked_messages