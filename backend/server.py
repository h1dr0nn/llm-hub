from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.api.v1.chat import api_router
from app.api.v1.auth import auth_router
from app.api.v1.admin import admin_router
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

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/v1")
app.include_router(auth_router, prefix="/v1/auth", tags=["auth"])
app.include_router(admin_router, prefix="/v1/admin", tags=["admin"])

@app.get("/")
async def root():
    return {"message": "llm-hub API is running", "version": "v1"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
