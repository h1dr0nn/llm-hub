# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

LLM Hub is a lightweight, open-source LLM API gateway that routes requests across multiple AI providers and API keys with quota-aware fallback, user authentication, and a built-in dashboard. The system unifies access to multiple LLM providers (OpenAI, Gemini, Claude, DeepSeek, Groq) through a single API endpoint with automatic routing, failover, and observability.

## Development Commands

### Backend

#### Server Management
```bash
cd backend
python server.py
```
The backend server runs on `http://localhost:8000` by default using FastAPI + Uvicorn.

#### Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Testing
Backend tests are standalone Python scripts that need to be run from the repository root:

- **Unit/Logic Tests (no server required):**
  ```bash
  python backend/tests/test_model.py
  ```

- **Integration Tests (requires running server):**
  First start the server (`python backend/server.py`), then in a separate terminal:
  ```bash
  python backend/tests/test_auth.py
  python tests/test_chat.py
  ```

### Frontend

#### Development Server
```bash
cd frontend
npm run dev
```

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Linting
```bash
cd frontend
npm run lint
```

#### Build
```bash
cd frontend
npm run build
```

## Architecture

### Backend Architecture

#### Core Components

**RoutingEngine** (`app/core/router.py`): The central orchestration system that routes chat requests to providers based on logical model types (smart/fast/cheap/any). Uses a priority-based fallback strategy where it tries providers in order until one succeeds.

**Provider Adapters** (`app/adapters/`): All adapters inherit from `ProviderAdapter` base class and implement the `chat_completion()` method. Each adapter translates the unified `ChatRequest` format to provider-specific API formats:
- `openai.py` - OpenAI/GPT models
- `gemini.py` - Google Gemini
- `anthropic.py` - Anthropic Claude
- `deepseek.py` - DeepSeek
- `groq.py` - Groq

**QuotaService** (`app/services/quota_service.py`): Manages API key selection, usage tracking, and cooldown handling:
- Selects active keys that are not on cooldown and have remaining quota
- Automatically resets daily quotas (86400 seconds)
- Logs token usage to database
- Sets 300-second cooldown on keys that receive 429 (rate limit) errors

#### Database Models

**APIKey** (`app/models/db_models.py`):
- Stores encrypted API keys per provider
- Tracks `is_active`, `cooldown_until`, `daily_quota`, `used_today`, `last_reset`
- Has one-to-many relationship with UsageLogs

**UsageLog**: Records every API call with token counts (prompt_tokens, completion_tokens, total_tokens), model, and timestamp.

**User**: Stores user accounts with hashed passwords, roles (admin/user), and authentication state.

#### API Endpoints

- **POST /v1/chat**: Main chat completion endpoint accepting logical models (smart/fast/cheap/any)
- **POST /v1/auth/register**: User registration
- **POST /v1/auth/login**: User authentication (returns token)
- **GET /v1/admin/keys**: List all API keys
- **POST /v1/admin/keys**: Add new API key
- **GET /v1/admin/logs**: Retrieve usage logs

#### Routing Strategy

Logical model to provider priority mapping (defined in `RoutingEngine.routing_config`):
- `smart`: OpenAI → Anthropic → Gemini (quality-focused)
- `fast`: Groq → OpenAI → Gemini (latency-focused)
- `cheap`: DeepSeek → Groq → Gemini (cost-focused)
- `any`: All providers in order

When a provider fails (HTTP error or exception), the router automatically tries the next provider in the priority list. If a key returns 429 (rate limit), it's automatically placed on cooldown.

### Frontend Architecture

**Technology Stack**: React 19 + Vite + TypeScript

**Main Pages** (`src/pages/`):
- `Dashboard.tsx`: Overview with metrics and provider health
- `Keys.tsx`: API key management interface
- `Logs.tsx`: Usage logs and routing history
- `Login.tsx`: Authentication page

**State Management**: Uses `AuthContext` (`src/context/AuthContext.tsx`) for global authentication state.

**Layout**: `AdminLayout` component (`src/components/AdminLayout.tsx`) provides navigation and page chrome.

## Database

- **Development**: SQLite (`llm_hub.db` in backend root)
- **Production**: Redis/Postgres (as indicated in README)
- **ORM**: SQLAlchemy with async support (`aiosqlite` driver for SQLite)

The database is automatically initialized on server startup via the `lifespan` context manager in `server.py`.

## Environment Variables

API keys can be configured in two ways:
1. **Database**: Primary method - keys stored in `api_keys` table via dashboard
2. **Environment Variables**: Fallback for initial setup, format: `{PROVIDER}_API_KEY` (e.g., `OPENAI_API_KEY`, `GEMINI_API_KEY`)

The system prioritizes database keys but falls back to environment variables if no database keys exist for a provider.

## Security Model

- Passwords hashed using bcrypt/argon2 (via passlib)
- API keys encrypted at rest in database
- JWT tokens for session management (python-jose)
- Keys never exposed to chat API clients
- Dashboard shows masked keys (`sk-****1234` format)
- CORS configured (currently `*` for development, should be restricted in production)

## Important Notes

- The chat API endpoint (`/v1/chat`) accepts **logical model names** (smart/fast/cheap/any), NOT provider-specific model names
- Clients should NOT know which provider or API key is being used - the routing is transparent
- The dashboard is a core component, not optional - it's the primary interface for key management
- All test scripts must be run from the repository root, not from subdirectories
- The backend automatically creates database tables on first run via `init_db()`
