import time
import uuid
import httpx
from typing import Dict, Any, List, Optional
from app.adapters.base import ProviderAdapter
from app.models.schemas import ChatRequest, ChatResponse, ChatChoice, ChatMessage, Usage

class AnthropicAdapter(ProviderAdapter):
    BASE_URL = "https://api.anthropic.com/v1/messages"

    async def chat_completion(self, request: ChatRequest, api_key: str) -> ChatResponse:
        anthropic_model = self._map_model(request.model)
        
        # Anthropic likes system prompt separate
        system_prompt = ""
        messages = []
        for msg in request.messages:
            if msg.role == "system":
                system_prompt += msg.content + "\n"
            else:
                messages.append({
                    "role": "user" if msg.role == "user" else "assistant",
                    "content": msg.content
                })
        
        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        
        payload = {
            "model": anthropic_model,
            "system": system_prompt.strip() if system_prompt else None,
            "messages": messages,
            "max_tokens": request.max_tokens,
            "temperature": request.temperature,
            "stream": request.stream
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(self.BASE_URL, headers=headers, json=payload, timeout=30.0)
            response.raise_for_status()
            data = response.json()

        return self._normalize_response(data, request.model)

    def _map_model(self, logical_model: str) -> str:
        mapping = {
            "smart": "claude-3-5-sonnet-20240620",
            "fast": "claude-3-haiku-20240307",
            "cheap": "claude-3-haiku-20240307",
            "any": "claude-3-haiku-20240307"
        }
        return mapping.get(logical_model, "claude-3-haiku-20240307")

    def _normalize_response(self, data: Dict[str, Any], logical_model: str) -> ChatResponse:
        # Anthropic returns content as a list of blocks
        content_blocks = data.get("content", [])
        text = "".join([b.get("text", "") for b in content_blocks if b.get("type") == "text"])
        
        choices = [
            ChatChoice(
                index=0,
                message=ChatMessage(role="assistant", content=text),
                finish_reason=data.get("stop_reason")
            )
        ]
        
        usage_data = data.get("usage", {})
        usage = Usage(
            prompt_tokens=usage_data.get("input_tokens", 0),
            completion_tokens=usage_data.get("output_tokens", 0),
            total_tokens=usage_data.get("input_tokens", 0) + usage_data.get("output_tokens", 0)
        )

        return ChatResponse(
            id=data.get("id", f"anthropic-{uuid.uuid4()}"),
            created=int(time.time()),
            model=logical_model,
            choices=choices,
            usage=usage
        )
