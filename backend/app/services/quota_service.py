import time
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.db_models import APIKey, UsageLog
from typing import Optional

class QuotaService:
    @staticmethod
    async def get_active_key(db: AsyncSession, provider: str) -> Optional[APIKey]:
        """Find an active key for a provider that is not on cooldown and has quota."""
        now = int(time.time())
        stmt = select(APIKey).where(
            APIKey.provider == provider,
            APIKey.is_active == True,
            (APIKey.cooldown_until == None) | (APIKey.cooldown_until <= now)
        )
        # We can add more logic here, like selecting the one with most remaining quota
        result = await db.execute(stmt)
        keys = result.scalars().all()
        
        for key in keys:
            # Check if quota reset is needed (daily reset)
            if now - key.last_reset >= 86400:
                key.used_today = 0
                key.last_reset = now
            
            if key.daily_quota == 0 or key.used_today < key.daily_quota:
                return key
        
        return None

    @staticmethod
    async def log_usage(db: AsyncSession, key_id: int, model: str, prompt_tokens: int, completion_tokens: int):
        """Record token usage for a specific key."""
        total_tokens = prompt_tokens + completion_tokens
        
        # Log the detailed usage
        new_log = UsageLog(
            api_key_id=key_id,
            model=model,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=total_tokens
        )
        db.add(new_log)
        
        # Update the key's accumulated usage
        await db.execute(
            update(APIKey)
            .where(APIKey.id == key_id)
            .values(used_today=APIKey.used_today + total_tokens)
        )
        
        await db.commit()

    @staticmethod
    async def set_cooldown(db: AsyncSession, key_id: int, duration_seconds: int = 300):
        """Put a key on cooldown, usually after a 429 error."""
        cooldown_end = int(time.time()) + duration_seconds
        await db.execute(
            update(APIKey)
            .where(APIKey.id == key_id)
            .values(cooldown_until=cooldown_end)
        )
        await db.commit()

quota_service = QuotaService()
