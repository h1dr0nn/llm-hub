from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.core.router import router

api_router = APIRouter()

@api_router.post("/chat", response_model=ChatResponse)
async def chat_completion(request: ChatRequest):
    try:
        response = await router.route(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
