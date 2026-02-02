import json
import httpx
import asyncio

BASE_URL = "http://localhost:8010/v1"

async def test_auth():
    async with httpx.AsyncClient() as client:
        # 1. Register a new user
        print("\n1. Testing Registration...")
        reg_payload = {
            "username": "admin_test",
            "password": "password123",
            "email": "admin@example.com"
        }
        response = await client.post(f"{BASE_URL}/auth/register", json=reg_payload)
        print(f"Registration Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Registered User: {response.json()['username']} as {response.json()['role']}")
        else:
            print(f"Registration Failed: {response.text}")

        # 2. Login
        print("\n2. Testing Login...")
        login_payload = {
            "username": "admin_test",
            "password": "password123"
        }
        response = await client.post(f"{BASE_URL}/auth/login", json=login_payload)
        print(f"Login Status: {response.status_code}")
        if response.status_code == 200:
            token = response.json()["access_token"]
            print("Login Successful, Token received.")
        else:
            print(f"Login Failed: {response.text}")
            return

        # 3. Access Protected /me endpoint
        print("\n3. Testing /me endpoint (Authenticated)...")
        headers = {"Authorization": f"Bearer {token}"}
        response = await client.get(f"{BASE_URL}/auth/me", headers=headers)
        print(f"/me Status: {response.status_code}")
        if response.status_code == 200:
            print(f"User Profile: {response.json()['username']}")
        else:
            print(f"/me Failed: {response.text}")

        # 4. Access Protected Admin Debug endpoint
        print("\n4. Testing /admin/debug endpoint (Admin Role)...")
        response = await client.get(f"{BASE_URL}/admin/debug", headers=headers)
        print(f"/admin/debug Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Admin Debug Response: {response.json()['message']}")
        else:
            print(f"/admin/debug Failed: {response.text}")

        # 5. Testing Unauthorized access
        print("\n5. Testing Unauthorized access...")
        response = await client.get(f"{BASE_URL}/admin/debug")
        print(f"Unauthorized Request Status: {response.status_code} (Expected 401)")

if __name__ == "__main__":
    asyncio.run(test_auth())
