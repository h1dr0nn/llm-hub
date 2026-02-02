from app.adapters.openai import OpenAIAdapter

class MistralAdapter(OpenAIAdapter):
    BASE_URL = "https://api.mistral.ai/v1/chat/completions"
    MODELS_URL = "https://api.mistral.ai/v1/models"

    def _map_model(self, logical_model: str) -> str:
        mapping = {
            "smart": "mistral-large-latest",
            "fast": "mistral-small-latest",
            "cheap": "open-mistral-7b",
            "any": "mistral-medium-latest"
        }
        return mapping.get(logical_model, "mistral-medium-latest")
