import asyncio
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.db_models import APIKey

async def check():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(APIKey))
        keys = result.scalars().all()
        print(f"Total keys in DB: {len(keys)}")
        for k in keys:
            print(f"Provider: {k.provider}, Active: {k.is_active}, Quota: {k.daily_quota}, Used: {k.used_today}")

if __name__ == "__main__":
    asyncio.run(check())
