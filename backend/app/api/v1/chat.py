from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.schemas import ChatRequest, ChatResponse
from app.core.router import router
from app.core.database import get_db

api_router = APIRouter()

@api_router.post("/chat", response_model=ChatResponse)
async def chat_completion(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    try:
        response = await router.route(db, request)
        return response
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
