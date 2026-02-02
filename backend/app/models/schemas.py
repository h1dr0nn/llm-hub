from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum

class LogicalModel(str, Enum):
    SMART = "smart"
    FAST = "fast"
    CHEAP = "cheap"
    ANY = "any"

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: LogicalModel
    messages: List[ChatMessage]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 512
    stream: Optional[bool] = False

class ChatChoice(BaseModel):
    index: int
    message: ChatMessage
    finish_reason: Optional[str] = None

class Usage(BaseModel):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int

class ChatResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int
    model: str
    choices: List[ChatChoice]
    usage: Usage

class UserBase(BaseModel):
    username: str
    email: Optional[str] = None

class UserRegister(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: int

    class Config:
        from_attributes = True

class APIKeyBase(BaseModel):
    provider: str
    daily_quota: Optional[int] = 0

class APIKeyCreate(APIKeyBase):
    key_value: str

class APIKeyOut(APIKeyBase):
    id: int
    is_active: bool
    used_today: int
    cooldown_until: Optional[int] = None

    class Config:
        from_attributes = True

class UsageLogOut(BaseModel):
    id: int
    api_key_id: int
    timestamp: int
    model: str
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int

    class Config:
        from_attributes = True
