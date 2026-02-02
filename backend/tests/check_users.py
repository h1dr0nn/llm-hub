import asyncio
from app.core.database import AsyncSessionLocal
from app.models.db_models import User
from sqlalchemy import select

async def check():
    async with AsyncSessionLocal() as db:
        r = await db.execute(select(User))
        users = r.scalars().all()
        print(f"Users found: {[u.username for u in users]}")

if __name__ == "__main__":
    asyncio.run(check())
