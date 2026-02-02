from abc import ABC, abstractmethod
from typing import List, Dict, Any
from app.models.schemas import ChatRequest, ChatResponse

class ProviderAdapter(ABC):
    @abstractmethod
    async def chat_completion(self, request: ChatRequest, api_key: str) -> ChatResponse:
        pass

    @abstractmethod
    async def list_models(self, api_key: str) -> List[str]:
        """List available models for this provider/key."""
        pass

    @abstractmethod
    async def get_quota_info(self, api_key: str) -> Dict[str, Any]:
        """Fetch remaining quota/limit information if available."""
        pass
