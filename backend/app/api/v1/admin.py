from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.core.database import get_db
from app.core.security import check_admin
from app.models.db_models import User, APIKey, UsageLog
from app.models.schemas import APIKeyCreate, APIKeyOut, UsageLogOut
from typing import List

from app.core.router import router
from typing import List, Dict, Any

admin_router = APIRouter()

@admin_router.post("/keys/discover")
async def discover_key(key_in: APIKeyCreate, admin: User = Depends(check_admin)):
    """Discovery available models and quota for a key without saving it."""
    adapter = router.adapters.get(key_in.provider)
    if not adapter:
        raise HTTPException(status_code=400, detail="Provider adapter not found")
    
    try:
        models = await adapter.list_models(key_in.key_value)
        quota = await adapter.get_quota_info(key_in.key_value)
        suggested_quota = 500000
        if models:
            first_model = models[0].lower()
            if "gpt" in first_model or "claude" in first_model or "gemini" in first_model:
                suggested_quota = 1000000

        return {
            "provider": key_in.provider,
            "models": models,
            "quota": quota,
            "suggested_daily_quota": suggested_quota
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Failed to discover key: {str(e)}")

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
    import logging
    logging.info(f"Adding key: {key_in.name} for provider {key_in.provider}")
    
    # Create prefix (e.g., sk-abc...xy12)
    val = key_in.key_value
    if len(val) > 12:
        prefix = f"{val[:7]}...{val[-4:]}"
    elif len(val) > 4:
        prefix = f"{val[:3]}...{val[-1:]}"
    else:
        prefix = "sk-***"
    
    new_key = APIKey(
        name=key_in.name.strip() or "Unnamed Instance",
        provider=key_in.provider,
        key_value=encrypt_value(key_in.key_value),
        key_prefix=prefix,
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

from app.models.schemas import APIKeyUpdate

@admin_router.patch("/keys/{key_id}", response_model=APIKeyOut)
async def update_key(key_id: int, key_in: APIKeyUpdate, db: AsyncSession = Depends(get_db), admin: User = Depends(check_admin)):
    result = await db.execute(select(APIKey).where(APIKey.id == key_id))
    key = result.scalar_one_or_none()
    if not key:
        raise HTTPException(status_code=404, detail="Key not found")
    
    if key_in.name is not None:
        key.name = key_in.name
    if key_in.is_active is not None:
        key.is_active = key_in.is_active
    if key_in.daily_quota is not None:
        key.daily_quota = key_in.daily_quota
        
    await db.commit()
    await db.refresh(key)
    return key

@admin_router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db), admin: User = Depends(check_admin)):
    """Aggregate stats for dashboard"""
    # Total requests
    result = await db.execute(select(UsageLog))
    logs = result.scalars().all()
    
    total_requests = len(logs)
    total_tokens = sum(log.total_tokens for log in logs)
    
    # Simple distribution
    model_counts = {}
    for log in logs:
        m = log.model
        model_counts[m] = model_counts.get(m, 0) + 1
        
    model_share = [
        {"name": m, "value": count, "color": "#06b6d4"} # Color placeholder
        for m, count in model_counts.items()
    ]
    
    # Calculate percentage
    total = sum(item["value"] for item in model_share)
    if total > 0:
        for item in model_share:
            item["value"] = round((item["value"] / total) * 100, 1)
            
    # Time-series data (Last 24 hours, grouped by 4-hour blocks)
    import time
    now = int(time.time())
    one_day_ago = now - 86400
    
    # Initialize buckets (6 buckets of 4 hours)
    buckets = []
    for i in range(6):
        t = one_day_ago + (i * 14400)
        # Format as HH:00
        import datetime
        dt = datetime.datetime.fromtimestamp(t)
        buckets.append({
            "name": dt.strftime("%H:00"),
            "requests": 0,
            "tokens": 0,
            "start": t,
            "end": t + 14400
        })
        
    for log in logs:
        if log.timestamp >= one_day_ago:
            for b in buckets:
                if b["start"] <= log.timestamp < b["end"]:
                    b["requests"] += 1
                    b["tokens"] += log.total_tokens
                    break
    
    # Clean up buckets for response
    usage_data = [
        {"name": b["name"], "requests": b["requests"], "tokens": b["tokens"]}
        for b in buckets
    ]

    return {
        "total_requests": total_requests,
        "total_tokens": total_tokens,
        "avg_latency": "N/A", # Not tracked yet
        "model_share": model_share,
        "usage_data": usage_data
    }

@admin_router.get("/logs", response_model=List[UsageLogOut])
async def list_logs(limit: int = 100, db: AsyncSession = Depends(get_db), admin: User = Depends(check_admin)):
    result = await db.execute(select(UsageLog).order_by(UsageLog.timestamp.desc()).limit(limit))
    return result.scalars().all()
