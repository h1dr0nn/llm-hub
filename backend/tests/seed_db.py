import asyncio
import os
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal, init_db
from app.models.db_models import APIKey

async def seed():
    # Ensure DB is initialized
    await init_db()
    
    async with AsyncSessionLocal() as db:
        providers = ["openai", "gemini", "anthropic", "deepseek", "groq"]
        
        for p in providers:
            env_key = os.getenv(f"{p.upper()}_API_KEY")
            if env_key:
                # Check if already exists
                from sqlalchemy import select
                result = await db.execute(select(APIKey).where(APIKey.provider == p, APIKey.key_value == env_key))
                if result.scalar_one_or_none():
                    print(f"Key for {p} already exists in DB.")
                    continue
                
                new_key = APIKey(
                    provider=p,
                    key_value=env_key,
                    daily_quota=100000, # Large quota for testing
                    is_active=True
                )
                db.add(new_key)
                print(f"Added {p} key to DB.")
        
        await db.commit()

if __name__ == "__main__":
    asyncio.run(seed())
