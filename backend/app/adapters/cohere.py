import time
import uuid
import httpx
from typing import Dict, Any, List
from app.adapters.base import ProviderAdapter
from app.models.schemas import ChatRequest, ChatResponse, ChatChoice, ChatMessage, Usage

class CohereAdapter(ProviderAdapter):
    BASE_URL = "https://api.cohere.ai/v1/chat"

    async def chat_completion(self, request: ChatRequest, api_key: str) -> ChatResponse:
        cohere_model = self._map_model(request.model)
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "accept": "application/json"
        }
        
        # Cohere uses "message" for current turn and "chat_history"
        chat_history = []
        for msg in request.messages[:-1]:
            chat_history.append({
                "role": "USER" if msg.role == "user" else "CHATBOT",
                "message": msg.content
            })
            
        payload = {
            "model": cohere_model,
            "message": request.messages[-1].content,
            "chat_history": chat_history,
            "temperature": request.temperature,
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(self.BASE_URL, headers=headers, json=payload, timeout=30.0)
            response.raise_for_status()
            data = response.json()

        return self._normalize_response(data, request.model)

    async def list_models(self, api_key: str) -> List[str]:
        return ["command-r", "command-r-plus", "command-light", "command"]

    async def get_quota_info(self, api_key: str) -> Dict[str, Any]:
        return {"info": "Cohere quota dashboard recommended"}

    def _map_model(self, logical_model: str) -> str:
        mapping = {
            "smart": "command-r-plus",
            "fast": "command-r",
            "cheap": "command-light",
            "any": "command"
        }
        return mapping.get(logical_model, "command")

    def _normalize_response(self, data: Dict[str, Any], logical_model: str) -> ChatResponse:
        choices = [
            ChatChoice(
                index=0,
                message=ChatMessage(role="assistant", content=data.get("text", "")),
                finish_reason="complete"
            )
        ]
        
        # Cohere usage format
        token_count = data.get("token_count", {})
        usage = Usage(
            prompt_tokens=token_count.get("prompt_tokens", 0),
            completion_tokens=token_count.get("response_tokens", 0),
            total_tokens=token_count.get("total_tokens", 0)
        )

        return ChatResponse(
            id=data.get("generation_id", f"cohere-{uuid.uuid4()}"),
            created=int(time.time()),
            model=logical_model,
            choices=choices,
            usage=usage
        )
