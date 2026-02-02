import asyncio
from sqlalchemy import insert
from app.core.database import AsyncSessionLocal, init_db
from app.models.db_models import APIKey

async def manual_seed():
    await init_db()
    async with AsyncSessionLocal() as db:
        new_key = APIKey(
            provider="openai",
            key_value="sk-test-key",
            daily_quota=1000,
            is_active=True
        )
        db.add(new_key)
        try:
            await db.commit()
            print("Successfully added test key.")
        except Exception as e:
            print(f"Error committing: {e}")
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(manual_seed())
