import ollama
import httpx
import base64
from io import BytesIO
from PIL import Image
from pydantic import BaseModel

class Defect(BaseModel):
    description: str
    location: list[str]

class ImageAnalysisResponse(BaseModel):
    defects: list[Defect]

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

    # Revised prompt to explicitly state the image is provided
    prompt = (
        "You are an advanced visual analysis assistant for a Facebook Marketplace negotiator app. "
        "An image is provided below in base64 format. Your task is to analyze the image of the product "
        "being sold and identify any visible defects such as stains, rips, dirt, breakage, or any other signs of damage. "
        "For each defect you find, provide a detailed concise description including its type, location on the product, "
        "and how it might affect the item's overall condition and value. Do not ask for an image upload; "
        "simply analyze the provided image."
    )

    # Call Llama via Ollama with the revised prompt and image
    response = ollama.generate(
        model='llama3.2-vision',
        prompt=prompt,
        images=[img_str],
        format=ImageAnalysisResponse.model_json_schema()
    )

    formattedResponse = ImageAnalysisResponse.model_validate_json(
        response['response'])

    return formattedResponse
