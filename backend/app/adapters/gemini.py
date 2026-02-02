import time
import uuid
import httpx
from typing import Dict, Any, List
from app.adapters.base import ProviderAdapter
from app.models.schemas import ChatRequest, ChatResponse, ChatChoice, ChatMessage, Usage

class GeminiAdapter(ProviderAdapter):
    # Google AI Studio API
    BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

    async def chat_completion(self, request: ChatRequest, api_key: str) -> ChatResponse:
        gemini_model = self._map_model(request.model)
        url = self.BASE_URL.format(model=gemini_model, api_key=api_key)
        
        # Convert our messages to Gemini format
        contents = []
        for msg in request.messages:
            role = "user" if msg.role in ["user", "system"] else "model"
            contents.append({
                "role": role,
                "parts": [{"text": msg.content}]
            })
        
        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": request.temperature,
                "maxOutputTokens": request.max_tokens,
            }
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=30.0)
            response.raise_for_status()
            data = response.json()

        return self._normalize_response(data, request.model, gemini_model)

    async def list_models(self, api_key: str) -> List[str]:
        # Google AI Studio model list endpoint
        url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            return [m["name"].split("/")[-1] for m in data.get("models", []) if "gemini" in m["name"]]

    async def get_quota_info(self, api_key: str) -> Dict[str, Any]:
        return {"info": "Quota info not available via public API"}

    def _map_model(self, logical_model: str) -> str:
        mapping = {
            "smart": "gemini-1.5-pro",
            "fast": "gemini-1.5-flash",
            "cheap": "gemini-1.5-flash",
            "any": "gemini-1.5-flash"
        }
        return mapping.get(logical_model, "gemini-1.5-flash")

    def _normalize_response(self, data: Dict[str, Any], logical_model: str, actual_model: str) -> ChatResponse:
        # Gemini can return multiple candidates
        candidates = data.get("candidates", [])
        choices = []
        
        for i, cand in enumerate(candidates):
            content = cand.get("content", {})
            parts = content.get("parts", [])
            text = "".join([p.get("text", "") for p in parts])
            
            choices.append(ChatChoice(
                index=i,
                message=ChatMessage(role="assistant", content=text),
                finish_reason=cand.get("finishReason")
            ))
            
        # Gemini doesn't always return usage in the same format
        usage_data = data.get("usageMetadata", {})
        usage = Usage(
            prompt_tokens=usage_data.get("promptTokenCount", 0),
            completion_tokens=usage_data.get("candidatesTokenCount", 0),
            total_tokens=usage_data.get("totalTokenCount", 0)
        )

        return ChatResponse(
            id=f"gemini-{uuid.uuid4()}",
            created=int(time.time()),
            model=logical_model,
            choices=choices,
            usage=usage
        )
