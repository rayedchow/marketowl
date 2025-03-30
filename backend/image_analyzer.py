import ollama
import httpx
import base64
from io import BytesIO
from PIL import Image
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from typing import Optional

app = FastAPI(title="Image Defect Analyzer API")

class ImageAnalysisResponse(BaseModel):
    defects: list[str]

class ImageAnalysisRequest(BaseModel):
    image_url: str

class ImageAnalysisRequest(BaseModel):
    image_url: str

async def download_image(url: str) -> bytes:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            return response.content
    except httpx.HTTPError as e:
        raise HTTPException(status_code=400, detail=f"Error downloading image: {str(e)}")

async def analyze_image_with_llama(image_url: str) -> ImageAnalysisResponse:
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
        "For each defect you find, provide a concise description of the type of defect. "
        "Do not ask for an image upload; "
        "simply analyze the provided image."
    )

    try:
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")

@app.post("/analyze-image", response_model=ImageAnalysisResponse)
async def analyze_image_endpoint(request: ImageAnalysisRequest):
    """
    Analyze an image for defects.
    
    Provide an image URL and receive a detailed analysis of any defects found.
    """
    return await analyze_image_with_llama(request.image_url)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=6000)