from fastapi import APIRouter, Depends
from app.core.security import check_admin
from app.models.db_models import User

admin_router = APIRouter()

@admin_router.get("/debug")
async def admin_debug(admin_user: User = Depends(check_admin)):
    return {
        "status": "authorized",
        "message": f"Welcome, Admin {admin_user.username}!",
        "role": admin_user.role
    }
