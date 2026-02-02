from contextlib import asynccontextmanager
from fastapi import FastAPI
from dotenv import load_dotenv
from app.api.v1.chat import api_router
from app.core.database import init_db

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB
    try:
        await init_db()
        print("Database initialized successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")
        import traceback
        traceback.print_exc()
    yield

app = FastAPI(title="llm-hub", description="Central LLM API Gateway", lifespan=lifespan)

# Include API routes
app.include_router(api_router, prefix="/v1")

@app.get("/")
async def root():
    return {"message": "llm-hub API is running", "version": "v1"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
