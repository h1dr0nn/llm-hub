from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.core.database import get_db
from app.core.security import check_admin
from app.models.db_models import User, APIKey, UsageLog
from app.models.schemas import APIKeyCreate, APIKeyOut, UsageLogOut
from typing import List

admin_router = APIRouter()

@admin_router.get("/debug")
async def admin_debug(admin_user: User = Depends(check_admin)):
    return {
        "status": "authorized",
        "message": f"Welcome, Admin {admin_user.username}!",
        "role": admin_user.role
    }

@admin_router.get("/keys", response_model=List[APIKeyOut])
async def list_keys(db: AsyncSession = Depends(get_db), admin: User = Depends(check_admin)):
    result = await db.execute(select(APIKey))
    return result.scalars().all()

@admin_router.post("/keys", response_model=APIKeyOut)
async def create_key(key_in: APIKeyCreate, db: AsyncSession = Depends(get_db), admin: User = Depends(check_admin)):
    new_key = APIKey(
        provider=key_in.provider,
        key_value=key_in.key_value,
        daily_quota=key_in.daily_quota,
        is_active=True
    )
    db.add(new_key)
    await db.commit()
    await db.refresh(new_key)
    return new_key

@admin_router.delete("/keys/{key_id}")
async def delete_key(key_id: int, db: AsyncSession = Depends(get_db), admin: User = Depends(check_admin)):
    await db.execute(delete(APIKey).where(APIKey.id == key_id))
    await db.commit()
    return {"status": "success", "message": "Key deleted"}

@admin_router.get("/logs", response_model=List[UsageLogOut])
async def list_logs(limit: int = 100, db: AsyncSession = Depends(get_db), admin: User = Depends(check_admin)):
    result = await db.execute(select(UsageLog).order_by(UsageLog.timestamp.desc()).limit(limit))
    return result.scalars().all()
