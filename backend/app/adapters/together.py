from app.adapters.openai import OpenAIAdapter

class TogetherAdapter(OpenAIAdapter):
    BASE_URL = "https://api.together.xyz/v1/chat/completions"
    MODELS_URL = "https://api.together.xyz/v1/models"

    def _map_model(self, logical_model: str) -> str:
        mapping = {
            "smart": "meta-llama/Llama-3-70b-chat-hf",
            "fast": "meta-llama/Llama-3-8b-chat-hf",
            "cheap": "mistralai/Mistral-7B-Instruct-v0.1",
            "any": "meta-llama/Llama-3-8b-chat-hf"
        }
        return mapping.get(logical_model, "meta-llama/Llama-3-8b-chat-hf")
