# Dashboard

This document describes the web dashboard of **llm-hub**, including its purpose, user flows, and major UI components.

The dashboard is a **core system component**, responsible for authentication, API key management, and system observability.

---

## 🎯 Dashboard Goals

- Provide a secure interface for administrators and users
- Allow direct management of third-party API keys
- Visualize quota usage and routing behavior
- Control providers and routing behavior
- Avoid exposing sensitive data to clients

---

## 👤 User Access & Authentication

### Login & Registration

- The dashboard provides:
  - login page
  - optional registration page
- Authentication uses:
  - username or email
  - password
- Unauthenticated users are redirected to the login page

---

### Session Handling

- After login, the dashboard:
  - stores auth token securely
  - attaches token to all admin API requests
- Expired or invalid sessions:
  - force re-authentication

---

## 🔑 API Key Management

The dashboard is the **only place** where API keys are entered.

### Add API Key Flow

```
1. User navigates to "API Keys"
2. User selects provider (OpenAI, Gemini, Claude, etc.)
3. User enters API key
4. User optionally sets:
   - priority
   - usage limits
5. Key is encrypted and stored
```

---

### API Key States

Each API key can be in one of the following states:

- active
- near limit
- exhausted
- cooldown
- disabled

Only **active** keys are eligible for routing.

---

### API Key Display Rules

- Full API keys are never shown
- Keys are masked:
  - example: `sk-****abcd`
- Sensitive metadata is hidden from non-admin users

---

## 📊 Usage & Quota Visualization

The dashboard provides real-time and historical views of usage.

Displayed metrics include:

- token usage per key
- request count per provider
- quota percentage remaining
- cooldown status

Visual elements:

- tables
- charts
- warning indicators for near-limit keys

---

## 🔄 Routing & Fallback Logs

The dashboard exposes routing behavior for transparency.

Each log entry may include:

- timestamp
- logical model used
- selected provider
- fallback reason (if any)
- latency

Logs help diagnose:

- quota exhaustion
- provider instability
- routing configuration issues

---

## ⚙️ Provider Management

Admins can:

- enable or disable providers
- adjust provider priority
- temporarily block a provider
- view provider health and error rates

Provider changes take effect immediately.

---

## 🛂 Roles & Permissions

### User Role

- view own usage
- manage own API keys (optional)
- access limited dashboard features

---

### Admin Role

- manage all API keys
- manage providers
- view all routing logs
- manage users
- override routing behavior

---

## 🧱 Frontend Architecture

- Framework: React (Next.js)
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- Charts: Recharts
- State management: React Query

The dashboard communicates exclusively with backend **admin APIs**.

---

## 🔐 Security Considerations

- Dashboard endpoints require authentication
- CSRF protection is enabled where applicable
- API keys never leave the backend
- No secrets are embedded in frontend code

---

## 📌 Summary

The llm-hub dashboard:

- is the control plane of the system
- manages users and API keys
- provides visibility into routing and quota
- enforces security boundaries

Without the dashboard, llm-hub cannot be safely operated.
