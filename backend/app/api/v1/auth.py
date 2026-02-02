from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import create_access_token, get_password_hash, verify_password, Token
from app.models.db_models import User
from app.models.schemas import UserRegister, UserOut, UserLogin
from typing import List

auth_router = APIRouter()

@auth_router.post("/register", response_model=UserOut)
async def register(user_in: UserRegister, db: AsyncSession = Depends(get_db)):
    try:
        # Check if user already exists
        result = await db.execute(select(User).where(User.username == user_in.username))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Username already registered")
        
        if user_in.email:
            result = await db.execute(select(User).where(User.email == user_in.email))
            if result.scalar_one_or_none():
                raise HTTPException(status_code=400, detail="Email already registered")

        # Create new user
        hashed_password = get_password_hash(user_in.password)
        # First user is admin
        result = await db.execute(select(User))
        is_first = result.scalars().first() is None
        
        new_user = User(
            username=user_in.username,
            email=user_in.email,
            password_hash=hashed_password,
            role="admin" if is_first else "user"
        )
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user
    except Exception as e:
        import traceback
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@auth_router.post("/login", response_model=Token)
async def login(user_in: UserLogin, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(User).where(User.username == user_in.username))
        user = result.scalar_one_or_none()
        
        if not user or not verify_password(user_in.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token = create_access_token(data={"sub": user.username, "role": user.role})
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

from app.core.security import get_current_user

@auth_router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
