from app.adapters.openai import OpenAIAdapter

class XAIAdapter(OpenAIAdapter):
    BASE_URL = "https://api.x.ai/v1/chat/completions"
    MODELS_URL = "https://api.x.ai/v1/models"

    def _map_model(self, logical_model: str) -> str:
        mapping = {
            "smart": "grok-beta",
            "fast": "grok-beta",
            "cheap": "grok-beta",
            "any": "grok-beta"
        }
        return mapping.get(logical_model, "grok-beta")
