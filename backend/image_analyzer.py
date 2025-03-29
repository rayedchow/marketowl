import ollama
import httpx
import base64
from io import BytesIO
from PIL import Image

async def download_image(url: str) -> bytes:
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.content

async def analyze_image_with_llama(image_url: str) -> str:
    # Download the image
    image_data = await download_image(image_url)
    
    # Convert image to base64
    image = Image.open(BytesIO(image_data))
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    # Prompt for Llama
    prompt = """You are an advanced visual analysis assistant for a Facebook Marketplace negotiator app. Your task is to examine an image of a product being sold and identify any visible defects to bring up in a negotiation. Look for issues such as stains, rips, dirt, breakage, or any other signs of damage. For each defect you find, provide a detailed description including its type, location on the product, and how it might affect the item's overall condition and value. If the image does not show any visible defects, state that the product appears to be in excellent condition."""

    # Call Llama through Ollama
    response = ollama.generate(
        model='llama2',
        prompt=prompt,
        images=[img_str]
    )
    
    return response['response']