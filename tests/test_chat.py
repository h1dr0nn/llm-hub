import json
import httpx
import asyncio

async def test_chat():
    url = "http://localhost:8000/v1/chat"
    payload = {
        "model": "smart",
        "messages": [
            {"role": "user", "content": "Hello, how are you?"}
        ],
        "temperature": 0.7
    }
    
    print(f"Sending request to {url}...")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=10.0)
            print(f"Status Code: {response.status_code}")
            if response.status_code == 200:
                print("Response JSON:")
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Error Detail: {response.text}")
    except Exception as e:
        print(f"Connection Error: {e}")

if __name__ == "__main__":
    # This script assumes the server is running at localhost:8000
    # and OPENAI_API_KEY is NOT set (so it should fail with "No providers available" or similar)
    asyncio.run(test_chat())
