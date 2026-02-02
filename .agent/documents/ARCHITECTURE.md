# Architecture

This document describes the high-level architecture of **llm-hub**, including its core components, data flow, and design decisions.

The system is designed to act as a **central LLM API gateway** with routing, quota awareness, authentication, and observability.

---

## 🧠 Design Goals

- Single unified API endpoint for clients
- Support multiple LLM providers
- Support multiple API keys per provider
- Automatically route around quota and rate limits
- Secure API key storage and usage
- Web-based dashboard for administration
- Simple to self-host and extend

---

## 🏗️ High-Level Architecture

```
Client / App / Game
        ↓
   Public API Layer
        ↓
   Routing Engine
        ↓
┌───────────────────────────────┐
│ Provider Adapters             │
│  - OpenAI                     │
│  - Gemini                     │
│  - Claude                     │
│  - (extensible)               │
└───────────────────────────────┘
        ↓
   Quota & Rate Limit Tracker
        ↓
   Storage Layer
```

---

## 🧩 Core Components

### 1. API Layer

- Exposes a unified REST API (OpenAI-style)
- Example endpoint:
  - `POST /v1/chat`
- Responsible for:
  - Request validation
  - Authentication
  - Request normalization

---

### 2. Routing Engine

The routing engine decides **which provider and which API key** should handle each request.

Responsibilities:

- Provider selection based on priority
- API key rotation
- Quota-aware routing
- Automatic fallback on failure
- Cooldown handling after rate-limit errors

Routing decisions are **transparent to clients**.

---

### 3. Provider Adapters

Each provider has a dedicated adapter module.

Responsibilities:

- Translate unified request format into provider-specific API calls
- Handle provider-specific errors
- Normalize responses back into a unified format

Adapters are isolated so new providers can be added without affecting core logic.

---

### 4. Quota & Rate Limit Tracker

This component tracks usage across all API keys.

Tracked metrics:

- Tokens used
- Requests per minute
- Requests per day
- Last reset timestamp
- Cooldown state

Used to:

- Prevent sending requests to exhausted keys
- Trigger fallback logic
- Surface warnings in the dashboard

---

### 5. Storage Layer

Storage is pluggable and environment-dependent.

- Development:
  - SQLite
- Production:
  - Redis (quota / rate)
  - Postgres (persistent metadata)

Stored data includes:

- Users and credentials
- API key metadata (encrypted)
- Usage statistics
- Routing logs

---

## 🔐 Authentication & Authorization

- Dashboard users authenticate via username/email + password
- Passwords are hashed using a strong algorithm (bcrypt or argon2)
- Auth tokens (JWT or session-based) protect admin endpoints
- Public LLM API access can be:
  - Open (internal use)
  - Token-protected (optional)

---

## 🌐 Data Flow (Chat Request)

```
1. Client sends POST /v1/chat
2. API layer authenticates request
3. Routing engine selects provider + API key
4. Provider adapter sends request to LLM
5. Response is normalized
6. Usage metrics are recorded
7. Response is returned to client
```

---

## 📊 Dashboard Architecture

The dashboard communicates with the backend via **admin APIs**.

Dashboard responsibilities:

- User authentication
- API key management (add / remove / disable)
- Quota and usage visualization
- Routing and fallback logs
- Provider health monitoring

The dashboard **never directly communicates with LLM providers**.

---

## 🔄 Extensibility

llm-hub is designed to be extended in the following ways:

- Add new providers via adapter modules
- Add new routing strategies
- Plug in alternative storage backends
- Integrate alerting or monitoring systems

---

## ⚠️ Non-Goals

- Training or fine-tuning models
- Acting as a chatbot UI for end users
- Providing free or shared API keys

llm-hub focuses strictly on **LLM API routing and infrastructure**.

---

## 📌 Summary

llm-hub acts as:

- A unified LLM API gateway
- A quota-aware routing engine
- A secure API key manager
- An admin-controlled infrastructure layer

It is designed for developers who need **control, visibility, and flexibility** when working with multiple LLM providers.
