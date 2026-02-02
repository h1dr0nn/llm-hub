# API Specification

This document defines the public API exposed by **llm-hub**.

The API is designed to be **simple, unified, and OpenAI-compatible in spirit**, while abstracting away providers, API keys, and routing logic.

---

## 🌐 Base URL

```
/v1
```

All public endpoints are prefixed with `/v1`.

---

## 🔐 Authentication (Optional)

Public API authentication is **configurable**.

Possible modes:

- Disabled (internal usage)
- API token required
- User-based authentication

Authentication, if enabled, is provided via HTTP headers.

Example:

```
Authorization: Bearer <token>
```

---

## 💬 Chat Completion API

### Endpoint

```
POST /v1/chat
```

---

### Request Body

```
{
  "model": "smart",
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Hello!" }
  ],
  "temperature": 0.7,
  "max_tokens": 512
}
```

---

### Request Fields

- `model` (string, required)  
  Logical model identifier.

  Supported values:
  - `smart`
  - `fast`
  - `cheap`
  - `any`

- `messages` (array, required)  
  Chat messages in role-content format.

- `temperature` (number, optional)  
  Controls randomness.

- `max_tokens` (number, optional)  
  Maximum tokens in the response.

Additional fields may be ignored or passed through depending on provider support.

---

## 🧠 Logical Model Routing

Logical models are mapped internally to providers and API keys.

Example mapping:

- `smart` → high-quality provider with fallback
- `fast` → low-latency provider
- `cheap` → lowest-cost provider
- `any` → first available provider with remaining quota

Clients do **not** need to know:

- which provider is selected
- which API key is used
- whether fallback occurred

---

## 📤 Response Format

```
{
  "id": "chatcmpl-xyz",
  "object": "chat.completion",
  "created": 1700000000,
  "model": "smart",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 18,
    "total_tokens": 30
  }
}
```

---

## 🧮 Usage & Quota Tracking

- Token usage is tracked per:
  - API key
  - provider
  - request
- Usage data is:
  - stored internally
  - visible in the dashboard
- Clients may optionally receive usage metadata in responses.

---

## ⚠️ Error Handling

Errors are returned using standard HTTP status codes.

Common errors:

- `400` – invalid request
- `401` – unauthorized
- `429` – rate limit exceeded
- `500` – internal routing error

Example error response:

```
{
  "error": {
    "message": "All providers are currently rate-limited.",
    "type": "rate_limit",
    "code": 429
  }
}
```

---

## 🔄 Fallback Behavior

When a provider or API key fails:

- llm-hub automatically retries with:
  - a different API key
  - or a different provider
- Fallback behavior is transparent to clients
- Fallback events are logged for observability

---

## 🧪 Future Extensions

Planned API extensions include:

- streaming responses
- embeddings endpoint
- health check endpoint
- admin-only introspection APIs

---

## 📌 Summary

The llm-hub API:

- provides a single unified chat endpoint
- abstracts provider complexity
- handles quota and fallback automatically
- is safe to expose to internal or controlled external clients
