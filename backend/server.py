import os
from fastapi import FastAPI
from dotenv import load_dotenv
from app.api.v1.chat import api_router

# Load environment variables
load_dotenv()

app = FastAPI(title="llm-hub", description="Central LLM API Gateway")

# Include API routes
app.include_router(api_router, prefix="/v1")

@app.get("/")
async def root():
    return {"message": "llm-hub API is running", "version": "v1"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
