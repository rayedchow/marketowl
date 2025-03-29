from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Literal
from openai import OpenAI

app = FastAPI()

# Initialize OpenAI client
client = OpenAI(
    base_url="https://rayedchow--example-vllm-openai-compatible-serve.modal.run/v1",
    api_key="super-secret-key",
)

# Define request models
class Message(BaseModel):
    role: str
    content: str

class CompletionRequest(BaseModel):
    messages: List[Message]
    guided_choice: Optional[List[str]] = None

# Define response models
class SimulationRequest(BaseModel):
    url: str

@app.post("/completion")
async def get_completion(request: CompletionRequest):
    try:
        completion = client.chat.completions.create(
            model="charlesfrye/Ministral-8B-Instruct-2410-FP8-Dynamic",
            messages=[{"role": msg.role, "content": msg.content} for msg in request.messages],
            extra_body={"guided_choice": request.guided_choice} if request.guided_choice else {},
        )
        
        return {
            "content": completion.choices[0].message.content,
            "role": completion.choices[0].message.role
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Welcome to the Completion API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)