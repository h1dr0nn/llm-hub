# Deployment

This document describes how to deploy **llm-hub** in development and production environments.

llm-hub is designed to be **self-hosted**, container-friendly, and configurable via environment variables.

---

## 🧠 Deployment Goals

- Simple local development setup
- Clear separation between backend and dashboard
- Secure handling of secrets
- Easy path to production deployment

---

## 🏗️ Components to Deploy

llm-hub consists of two main services:

- Backend API (FastAPI)
- Dashboard (React / Next.js)

Optional supporting services:

- Redis (quota & rate tracking)
- Postgres (persistent storage)

---

## 🧪 Local Development

### Backend (Local)

Requirements:

- Python 3.11+
- virtualenv

Steps:

```
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend will be available at:

```
http://localhost:8000
```

---

### Dashboard (Local)

Requirements:

- Node.js 18+

Steps:

```
cd dashboard
npm install
npm run dev
```

Dashboard will be available at:

```
http://localhost:3000
```

---

## 🐳 Docker Deployment

### Docker Images

Recommended services:

- llm-hub-backend
- llm-hub-dashboard
- redis (optional)
- postgres (optional)

---

### Docker Compose Example

```
version: "3.9"

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - redis

  dashboard:
    build: ./dashboard
    ports:
      - "3000:3000"
    env_file:
      - .env

  redis:
    image: redis:7
    ports:
      - "6379:6379"
```

---

## 🔐 Environment Variables

### Backend Environment Variables

Required:

- `SECRET_KEY`  
  Used for token signing and encryption.

- `DATABASE_URL`  
  Example:
  `sqlite:///./llmhub.db`

Optional:

- `REDIS_URL`
- `TOKEN_EXPIRATION_MINUTES`
- `ENABLE_PUBLIC_API_AUTH`

---

### Dashboard Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`  
  Example:
  `http://localhost:8000`

---

## 🔑 Secrets Management

- Secrets must **never** be committed to the repository
- Use:
  - `.env` files (local)
  - environment variables (production)
  - secret managers (recommended)

Sensitive secrets include:

- encryption keys
- auth signing keys
- database credentials
- third-party API keys

---

## 🌐 Production Considerations

- Always use HTTPS
- Place llm-hub behind a reverse proxy (Nginx / Caddy)
- Restrict access to admin APIs
- Enable logging and monitoring
- Rotate secrets periodically

---

## 🚀 Scaling

- Backend is stateless and horizontally scalable
- Redis enables shared quota tracking
- Database supports multi-instance deployments

---

## 📌 Summary

llm-hub can be deployed:

- locally for development
- via Docker Compose for small setups
- in production environments with proper secret handling

The system is designed to scale while keeping deployment complexity manageable.
