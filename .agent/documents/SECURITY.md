# Security

This document describes the security model and protections implemented in **llm-hub**.

Because llm-hub handles **user accounts, passwords, and third-party API keys**, security is treated as a first-class concern.

---

## 🧠 Security Principles

- Least privilege by default
- No API keys exposed to clients
- Defense in depth
- Secure-by-default configuration
- Clear separation between public API and admin interfaces

---

## 🔐 Authentication

### User Accounts

- Users register with:
  - username or email
  - password
- Passwords are **never stored in plain text**
- Passwords are hashed using:
  - bcrypt or argon2
- Password hashing includes:
  - per-user salt
  - configurable cost factor

---

### Authentication Tokens

- After login, users receive:
  - JWT token **or**
  - server-side session
- Tokens are required for:
  - dashboard access
  - admin API endpoints
- Tokens have:
  - expiration time
  - optional refresh mechanism

---

## 🔑 API Key Handling

### Key Storage

- Third-party API keys are:
  - encrypted at rest
  - never logged
  - never returned via APIs
- Only masked versions are shown in the dashboard:
  - example: `sk-****abcd`

### Encryption

- API keys are encrypted using:
  - AES-256 or equivalent
- Encryption keys are:
  - stored outside source code
  - provided via environment variables or secret managers

---

## 🚫 Key Exposure Prevention

- API keys are:
  - never sent to clients
  - never embedded in frontend code
  - never written to logs
- Dashboard API responses always redact sensitive values

---

## 🛡️ Authorization

- Role-based access control (RBAC) is supported:
  - admin
  - user
- Admin-only capabilities:
  - enable / disable providers
  - force key cooldown
  - view full routing logs

---

## 🌐 Network Security

- Admin endpoints are separated from public API routes
- Dashboard communicates only with admin endpoints
- HTTPS is strongly recommended in production
- CORS is restricted to known dashboard origins

---

## ⚠️ Rate Limiting & Abuse Protection

- Rate limits are applied to:
  - login attempts
  - admin APIs
  - public LLM API (optional)
- Failed login attempts may trigger:
  - temporary lockout
  - exponential backoff

---

## 🧮 Quota & Cooldown Safety

- Keys that hit rate limits or quota exhaustion are:
  - marked as exhausted
  - placed into cooldown state
- Cooldown prevents repeated failures and provider bans
- Routing engine skips keys in cooldown

---

## 📝 Logging & Auditing

- Security-relevant events are logged:
  - login attempts
  - key creation / deletion
  - provider failures
- Logs never contain:
  - passwords
  - API keys
- Logs can be used for:
  - auditing
  - debugging
  - abuse detection

---

## 🧪 Development & Deployment Safety

- Default configuration is safe for local development
- Production deployments should:
  - use strong secrets
  - rotate encryption keys periodically
  - isolate llm-hub from public internet if possible

---

## ❗ Threat Model (Non-Exhaustive)

Potential threats considered:

- API key leakage
- Credential stuffing
- Brute-force login attempts
- Provider rate-limit bans
- Misconfiguration exposing admin APIs

Mitigations are implemented at:

- authentication layer
- routing layer
- storage layer
- network layer

---

## 📌 Summary

llm-hub is designed to:

- Protect user credentials
- Secure third-party API keys
- Prevent accidental key leakage
- Minimize blast radius in case of failure

Security decisions prioritize **practical safety** without adding unnecessary complexity.
