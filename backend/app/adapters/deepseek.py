from app.adapters.openai import OpenAIAdapter

class DeepSeekAdapter(OpenAIAdapter):
    BASE_URL = "https://api.deepseek.com/chat/completions"

    def _map_model(self, logical_model: str) -> str:
        mapping = {
            "smart": "deepseek-chat",
            "fast": "deepseek-chat",
            "cheap": "deepseek-chat",
            "any": "deepseek-chat"
        }
        return mapping.get(logical_model, "deepseek-chat")
