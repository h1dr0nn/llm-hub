from app.adapters.openai import OpenAIAdapter

class PerplexityAdapter(OpenAIAdapter):
    BASE_URL = "https://api.perplexity.ai/chat/completions"
    MODELS_URL = "https://api.perplexity.ai/models" # Note: Perplexity might not have a public list but standardizes on keys

    def _map_model(self, logical_model: str) -> str:
        mapping = {
            "smart": "sonar-reasoning-pro",
            "fast": "sonar",
            "cheap": "sonar",
            "any": "sonar"
        }
        return mapping.get(logical_model, "sonar")
