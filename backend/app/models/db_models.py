import time
from typing import List, Optional
from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class APIKey(Base):
    __tablename__ = "api_keys"

    id: Mapped[int] = mapped_column(primary_key=True)
    provider: Mapped[str] = mapped_column(String(50))
    key_value: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(default=True)
    cooldown_until: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    daily_quota: Mapped[int] = mapped_column(default=0)  # 0 means unlimited
    used_today: Mapped[int] = mapped_column(default=0)
    last_reset: Mapped[int] = mapped_column(default=lambda: int(time.time()))

    usage_logs: Mapped[List["UsageLog"]] = relationship(back_populates="api_key")

class UsageLog(Base):
    __tablename__ = "usage_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    api_key_id: Mapped[int] = mapped_column(ForeignKey("api_keys.id"))
    timestamp: Mapped[int] = mapped_column(default=lambda: int(time.time()))
    model: Mapped[str] = mapped_column(String(50))
    prompt_tokens: Mapped[int] = mapped_column(default=0)
    completion_tokens: Mapped[int] = mapped_column(default=0)
    total_tokens: Mapped[int] = mapped_column(default=0)

    api_key: Mapped["APIKey"] = relationship(back_populates="usage_logs")

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[Optional[str]] = mapped_column(String(100), unique=True, index=True, nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="user")  # admin, user
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[int] = mapped_column(default=lambda: int(time.time()))
    last_login: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

