from app.adapters.openai import OpenAIAdapter

class OpenRouterAdapter(OpenAIAdapter):
    BASE_URL = "https://openrouter.ai/api/v1/chat/completions"
    MODELS_URL = "https://openrouter.ai/api/v1/models"

    def _map_model(self, logical_model: str) -> str:
        mapping = {
            "smart": "openai/gpt-4o",
            "fast": "google/gemini-flash-1.5",
            "cheap": "meta-llama/llama-3-8b-instruct",
            "any": "anthropic/claude-3-haiku"
        }
        return mapping.get(logical_model, "google/gemini-flash-1.5")
