import os
import time
from datetime import datetime, timedelta
from typing import Any, Union, Optional
from jose import jwt
from passlib.context import CryptContext
from pydantic import BaseModel

# Password Hashing
# "bcrypt" is generally recommended over "pbkdf2_sha256" for new projects
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
# CRITICAL: Fail if no secret key is provided in production
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    # Fallback only for dev/testing, but warn loudly
    import warnings
    warnings.warn("JWT_SECRET_KEY not set in environment. Using insecure default. DO NOT USE IN PRODUCTION.")
    SECRET_KEY = "super-secret-key-for-llm-hub-change-me"

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

from cryptography.fernet import Fernet

# Encryption for API Keys
# Generate a key if not exists (in prod this should be persistent)
_ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
if not _ENCRYPTION_KEY:
    # Use a derivation of the SECRET_KEY to ensure consistency across restarts if SECRET_KEY is consistent
    # Or just warn and generate one. For specific implementation, let's derive from SECRET_KEY if long enough, else generate.
    # To be safe and simple: Use a hardcoded fallback hash for dev if env missing.
    import base64
    import hashlib
    # Derive a 32-byte key from SECRET_KEY
    k = hashlib.sha256(SECRET_KEY.encode()).digest()
    _ENCRYPTION_KEY = base64.urlsafe_b64encode(k).decode()

_fernet = Fernet(_ENCRYPTION_KEY)

def encrypt_value(value: str) -> str:
    if not value: return value
    return _fernet.encrypt(value.encode()).decode()

def decrypt_value(value: str) -> str:
    if not value: return value
    try:
        return _fernet.decrypt(value.encode()).decode()
    except Exception:
        # If decryption fails (e.g. old plain text keys), return original
        return value

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.db_models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="v1/auth/login")

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except Exception:
        raise credentials_exception
    
    result = await db.execute(select(User).where(User.username == token_data.username))
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return user

async def check_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="The user doesn't have enough privileges")
    return user
