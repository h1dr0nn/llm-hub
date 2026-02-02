import time
import uuid
import httpx
from typing import Dict, Any
from app.adapters.base import ProviderAdapter
from app.models.schemas import ChatRequest, ChatResponse, ChatChoice, ChatMessage, Usage

class OpenAIAdapter(ProviderAdapter):
    BASE_URL = "https://api.openai.com/v1/chat/completions"

    async def chat_completion(self, request: ChatRequest, api_key: str) -> ChatResponse:
        # Map logical model to specific OpenAI model if needed
        # For now, let's assume a mapping or just use a default
        openai_model = self._map_model(request.model)
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": openai_model,
            "messages": [m.dict() for m in request.messages],
            "temperature": request.temperature,
            "max_tokens": request.max_tokens,
            "stream": request.stream
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(self.BASE_URL, headers=headers, json=payload, timeout=30.0)
            response.raise_for_status()
            data = response.json()

        return self._normalize_response(data, request.model)

    def _map_model(self, logical_model: str) -> str:
        mapping = {
            "smart": "gpt-4-turbo",
            "fast": "gpt-3.5-turbo",
            "cheap": "gpt-3.5-turbo",
            "any": "gpt-3.5-turbo"
        }
        return mapping.get(logical_model, "gpt-3.5-turbo")

    def _normalize_response(self, data: Dict[str, Any], logical_model: str) -> ChatResponse:
        choices = [
            ChatChoice(
                index=c["index"],
                message=ChatMessage(
                    role=c["message"]["role"],
                    content=c["message"]["content"]
                ),
                finish_reason=c.get("finish_reason")
            ) for c in data["choices"]
        ]
        
        usage = Usage(
            prompt_tokens=data["usage"]["prompt_tokens"],
            completion_tokens=data["usage"]["completion_tokens"],
            total_tokens=data["usage"]["total_tokens"]
        )

        return ChatResponse(
            id=data.get("id", f"hub-{uuid.uuid4()}"),
            created=data.get("created", int(time.time())),
            model=logical_model,
            choices=choices,
            usage=usage
        )
