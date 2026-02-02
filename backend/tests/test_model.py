import asyncio
from app.models.db_models import User
from app.core.security import get_password_hash

def test_model():
    try:
        print("Testing password hash...")
        h = get_password_hash("test")
        print(f"Hash: {h[:20]}...")
        
        print("Testing User instantiation...")
        u = User(
            username="testuser",
            password_hash=h,
            role="admin"
        )
        print(f"User created: {u.username}, hash: {u.password_hash[:20]}...")
    except Exception as e:
        print(f"ERROR: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_model()
