# Roadmap

This document outlines the planned development roadmap for **llm-hub**.

The roadmap is organized into phases, from core functionality to production readiness and future extensions.

---

## 🧱 Phase 0 — Project Foundation

- [x] Define project scope and goals
- [x] Choose project name (`llm-hub`)
- [x] Select license (MIT)
- [x] Decide tech stack (Python + React)
- [x] Define high-level architecture
- [x] Prepare core documentation structure

---

## 🚀 Phase 1 — Core Backend (MVP)

### API & Routing

- [x] Initialize FastAPI project
- [x] Implement `/v1/chat` endpoint
- [x] Define unified request/response schema
- [x] Implement logical model abstraction (`smart`, `fast`, `cheap`, `any`)
- [x] Implement provider adapter interface
- [x] Add first provider adapter (OpenAI)
- [x] Add second provider adapter (Gemini or Claude)

### Routing Logic

- [x] Provider priority routing
- [x] API key rotation per provider
- [x] Basic fallback on failure
- [x] Handle retryable errors
- [x] Normalize provider responses

---

## 🧮 Phase 2 — Quota & Rate Management

- [x] Token usage tracking
- [x] Request count tracking
- [x] Per-key quota limits
- [x] Rate-limit detection (429 handling)
- [x] Cooldown mechanism for exhausted keys
- [x] Skip cooldown keys during routing
- [x] Persist usage data (SQLite)

---

## 🔐 Phase 3 — Authentication & Security

- [ ] User account model
- [ ] Password hashing (bcrypt or argon2)
- [ ] Login endpoint
- [ ] Registration endpoint (configurable)
- [ ] JWT or session-based authentication
- [ ] Role-based access control (admin / user)
- [ ] Protect admin endpoints
- [ ] Mask sensitive fields in API responses
- [ ] Encrypt API keys at rest

---

## 📊 Phase 4 — Dashboard (Web UI)

### Core UI

- [ ] Setup React / Next.js project
- [ ] Implement login page
- [ ] Implement registration page
- [ ] Authenticated layout (protected routes)
- [ ] API client for admin endpoints

### API Key Management

- [ ] Add API key form
- [ ] Select provider when adding key
- [ ] List API keys
- [ ] Mask API key display
- [ ] Enable / disable API keys
- [ ] Show key status (active / cooldown / exhausted)

### Observability

- [ ] Overview dashboard
- [ ] Usage charts (tokens, requests)
- [ ] Provider health view
- [ ] Routing & fallback logs

---

## ⚙️ Phase 5 — Configuration & Control Plane

- [ ] Provider enable / disable controls
- [ ] Provider priority management
- [ ] Runtime routing overrides
- [ ] Force key cooldown via dashboard
- [ ] Logical model mapping editor
- [ ] Config validation

---

## 🐳 Phase 6 — Deployment & Production

- [ ] Dockerfile for backend
- [ ] Dockerfile for dashboard
- [ ] Docker Compose setup
- [ ] Environment variable validation
- [ ] Redis integration (quota / rate)
- [ ] Postgres integration (metadata)
- [ ] Reverse proxy setup (Nginx / Caddy)
- [ ] HTTPS configuration

---

## 🛡️ Phase 7 — Hardening & Stability

- [ ] Request concurrency limits per key
- [ ] Global rate limiting
- [ ] Circuit breaker for unstable providers
- [ ] Improved retry & backoff strategy
- [ ] Audit logging
- [ ] Alerting for near-quota exhaustion
- [ ] Health check endpoint

---

## 🧪 Phase 8 — Advanced Features (Optional)

- [ ] Streaming responses
- [ ] Embeddings endpoint
- [ ] Batch requests
- [ ] Cost estimation per request
- [ ] Multi-tenant isolation
- [ ] Per-user quotas
- [ ] Usage export (CSV / JSON)

---

## 🌱 Phase 9 — Open Source & Community

- [ ] CONTRIBUTING.md
- [ ] Code of Conduct
- [ ] Issue templates
- [ ] PR templates
- [ ] Example integrations
- [ ] Public roadmap updates
- [ ] CI workflow (lint / test)

---

## 🧭 Future Ideas (Backlog)

- [ ] Plugin system for providers
- [ ] Webhook-based alerts
- [ ] UI theming
- [ ] Usage-based billing integration
- [ ] Multi-region deployment
- [ ] CLI tool for llm-hub

---

## 📌 Notes

- The roadmap is intentionally modular.
- Phases may overlap depending on development needs.
- Contributions are welcome once core stability is achieved.

This roadmap reflects the long-term vision of **llm-hub** as a robust, self-hosted LLM infrastructure layer.
