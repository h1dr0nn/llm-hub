import os
import httpx
from typing import List, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.adapters.openai import OpenAIAdapter
from app.adapters.gemini import GeminiAdapter
from app.adapters.anthropic import AnthropicAdapter
from app.adapters.deepseek import DeepSeekAdapter
from app.adapters.groq import GroqAdapter
from app.adapters.mistral import MistralAdapter
from app.adapters.perplexity import PerplexityAdapter
from app.adapters.together import TogetherAdapter
from app.adapters.openrouter import OpenRouterAdapter
from app.adapters.cohere import CohereAdapter
from app.adapters.xai import XAIAdapter
from app.models.schemas import ChatRequest, ChatResponse, LogicalModel
from app.services.quota_service import quota_service

class RoutingEngine:
    def __init__(self):
        # Register all adapters
        self.adapters = {
            "openai": OpenAIAdapter(),
            "gemini": GeminiAdapter(),
            "anthropic": AnthropicAdapter(),
            "deepseek": DeepSeekAdapter(),
            "groq": GroqAdapter(),
            "mistral": MistralAdapter(),
            "perplexity": PerplexityAdapter(),
            "together": TogetherAdapter(),
            "openrouter": OpenRouterAdapter(),
            "cohere": CohereAdapter(),
            "xai": XAIAdapter()
        }
        
        # Mapping logical models to provider priority
        self.routing_config = {
            LogicalModel.SMART: ["openai", "anthropic", "gemini", "mistral", "perplexity"],
            LogicalModel.FAST: ["groq", "openai", "gemini", "mistral", "together"],
            LogicalModel.CHEAP: ["deepseek", "groq", "gemini", "mistral", "together"],
            LogicalModel.ANY: ["openai", "gemini", "groq", "anthropic", "deepseek", "mistral", "perplexity", "together", "openrouter", "cohere", "xai"]
        }

    async def route(self, db: AsyncSession, request: ChatRequest) -> ChatResponse:
        providers = self.routing_config.get(request.model, [])
        
        last_exception = None
        for provider_name in providers:
            # Get an active key from the database for this provider
            active_key = await quota_service.get_active_key(db, provider_name)
            
            if not active_key:
                # Fallback to env var if no keys in DB yet (for backward compatibility/initial setup)
                # In a full Phase 2 system, we would expect keys to be in DB.
                env_key_name = f"{provider_name.upper()}_API_KEY"
                api_key = os.getenv(env_key_name)
                key_id = None
                if not api_key:
                    continue
            else:
                api_key = active_key.key_value
                key_id = active_key.id
                
            adapter = self.adapters.get(provider_name)
            if not adapter:
                continue
                
            try:
                print(f"Routing request for {request.model} to {provider_name}...")
                response = await adapter.chat_completion(request, api_key)
                
                # Log usage if we have a key_id (meaning it came from DB)
                if key_id:
                    await quota_service.log_usage(
                        db, 
                        key_id, 
                        request.model, 
                        response.usage.prompt_tokens, 
                        response.usage.completion_tokens
                    )
                
                return response
            except httpx.HTTPStatusError as e:
                # Detect rate limits
                if e.response.status_code == 429 and key_id:
                    print(f"Rate limit hit for {provider_name}, putting key on cooldown.")
                    await quota_service.set_cooldown(db, key_id)
                
                print(f"HTTP Error with provider {provider_name}: {str(e)[:100]}")
                last_exception = e
                continue
            except Exception as e:
                print(f"Error with provider {provider_name}: {str(e)[:100]}")
                last_exception = e
                continue
        
        if last_exception:
            raise Exception(f"All providers failed. Last error: {str(last_exception)}")
        raise Exception(f"No providers available for model {request.model}")

router = RoutingEngine()
