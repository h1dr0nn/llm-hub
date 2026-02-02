# LLM Hub

**LLM Hub** is a lightweight, open-source LLM API gateway that routes requests across multiple AI providers and API keys with quota-aware fallback, user authentication, and a built-in dashboard.

The project is designed for developers who work with **multiple free or limited API keys** and want a single unified endpoint with automatic routing, failover, and observability.

---

## ✨ Features

- Unified `/v1/chat` API (OpenAI-style)
- Multi-provider support (OpenAI, Gemini, Claude, etc.)
- Multiple API keys per provider
- Quota-aware routing & automatic fallback
- Rate-limit & cooldown handling
- Web dashboard (React)
- User accounts (username/email + password)
- Secure API key management via dashboard
- Admin monitoring & routing logs
- MIT licensed, public & self-hostable

---

## 🧠 Use Cases

- Pool multiple **free-tier API keys**
- Automatically switch when a key hits quota
- Compare or fallback between providers
- Internal AI gateway for teams
- Experimentation without hardcoding keys
- LLM infrastructure layer for games, tools, or products

---

## 🏗️ Architecture Overview

```
Client / App / Game
        ↓
      LLM Hub
        ↓
┌─────────────────────────────┐
│ Provider Router             │
│  - OpenAI (multiple keys)   │
│  - Gemini (multiple keys)   │
│  - Claude (multiple keys)   │
└─────────────────────────────┘
        ↓
   Quota & Rate Tracker
        ↓
   SQLite / Redis / Postgres
```

- **Backend:** Python + FastAPI
- **Frontend:** React (Next.js)
- **Storage:** SQLite (dev), Redis/Postgres (prod)

---

## 📁 Repository Structure

```
llm-hub/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry
│   │   ├── router.py        # Routing & fallback logic
│   │   ├── providers/       # Provider adapters
│   │   ├── quota/           # Quota & rate tracking
│   │   ├── admin/           # Admin & dashboard APIs
│   │   └── auth/            # User auth & sessions
│   └── requirements.txt
│
├── dashboard/
│   ├── app/                 # React / Next.js app
│   ├── components/
│   └── lib/
│
├── docker/
├── docs/
├── LICENSE
└── README.md
```

---

## 🌐 Public API

### Chat endpoint

```
POST /v1/chat
```

Request body:

```
{
  "model": "smart",
  "messages": [
    { "role": "user", "content": "Hello" }
  ]
}
```

### Logical model routing

- `smart` → high-quality model with fallback
- `fast` → low-latency model
- `cheap` → low-cost model
- `any` → first available provider with quota

Clients do **not** need to know:

- Which provider is used
- Which API key is active
- When fallback happens

---

## 📊 Dashboard

The dashboard is a **core part of llm-hub**, not an optional add-on.

### Dashboard capabilities

- User registration & login (account + password)
- Add / remove / disable API keys
- Assign API keys to providers
- View quota usage per key
- Routing & fallback logs
- Provider health & latency
- Admin-only controls

---

## 🔐 Authentication & Security

- Username/email + password authentication
- Passwords hashed (bcrypt or argon2)
- API keys encrypted at rest
- API keys never exposed to clients
- Keys masked in UI (example: `sk-****1234`)
- Dashboard access requires authentication

---

## 📄 License

This project is licensed under the **MIT License**.
