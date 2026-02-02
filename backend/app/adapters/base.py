from abc import ABC, abstractmethod
from app.models.schemas import ChatRequest, ChatResponse

class ProviderAdapter(ABC):
    @abstractmethod
    async def chat_completion(self, request: ChatRequest, api_key: str) -> ChatResponse:
        pass
