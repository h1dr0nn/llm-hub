from app.adapters.openai import OpenAIAdapter

class GroqAdapter(OpenAIAdapter):
    BASE_URL = "https://api.groq.com/openai/v1/chat/completions"
    MODELS_URL = "https://api.groq.com/openai/v1/models"

    def _map_model(self, logical_model: str) -> str:
        mapping = {
            "smart": "llama-3.1-70b-versatile",
            "fast": "llama-3.1-8b-instant",
            "cheap": "llama-3.1-8b-instant",
            "any": "llama-3.1-8b-instant"
        }
        return mapping.get(logical_model, "llama-3.1-8b-instant")
