import os
import random
from typing import List, Dict, Optional
from app.adapters.openai import OpenAIAdapter
from app.adapters.gemini import GeminiAdapter
from app.adapters.anthropic import AnthropicAdapter
from app.adapters.deepseek import DeepSeekAdapter
from app.adapters.groq import GroqAdapter
from app.models.schemas import ChatRequest, ChatResponse, LogicalModel

class RoutingEngine:
    def __init__(self):
        # Register all adapters
        self.adapters = {
            "openai": OpenAIAdapter(),
            "gemini": GeminiAdapter(),
            "anthropic": AnthropicAdapter(),
            "deepseek": DeepSeekAdapter(),
            "groq": GroqAdapter()
        }
        
        # Mapping logical models to provider priority
        # Format: { logical_model: [list of (provider, api_key_env_var)] }
        self.routing_config = {
            LogicalModel.SMART: [
                ("openai", "OPENAI_API_KEY"),
                ("anthropic", "ANTHROPIC_API_KEY"),
                ("gemini", "GEMINI_API_KEY")
            ],
            LogicalModel.FAST: [
                ("groq", "GROQ_API_KEY"),
                ("openai", "OPENAI_API_KEY"),
                ("gemini", "GEMINI_API_KEY")
            ],
            LogicalModel.CHEAP: [
                ("deepseek", "DEEPSEEK_API_KEY"),
                ("groq", "GROQ_API_KEY"),
                ("gemini", "GEMINI_API_KEY")
            ],
            LogicalModel.ANY: [
                ("openai", "OPENAI_API_KEY"),
                ("gemini", "GEMINI_API_KEY"),
                ("groq", "GROQ_API_KEY"),
                ("anthropic", "ANTHROPIC_API_KEY"),
                ("deepseek", "DEEPSEEK_API_KEY")
            ]
        }

    async def route(self, request: ChatRequest) -> ChatResponse:
        providers = self.routing_config.get(request.model, [])
        
        last_exception = None
        for provider_name, key_env in providers:
            api_key = os.getenv(key_env)
            if not api_key:
                continue
                
            adapter = self.adapters.get(provider_name)
            if not adapter:
                continue
                
            try:
                print(f"Routing request for {request.model} to {provider_name}...")
                return await adapter.chat_completion(request, api_key)
            except Exception as e:
                # Log error and try next provider
                print(f"Error with provider {provider_name}: {str(e)[:100]}")
                last_exception = e
                continue
        
        if last_exception:
            raise Exception(f"All providers failed. Last error from {provider_name}: {str(last_exception)}")
        raise Exception(f"No providers with API keys available for model {request.model}")

router = RoutingEngine()
