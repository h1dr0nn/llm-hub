# Authentication & Authorization

This document describes the authentication and authorization system used by **llm-hub**.

llm-hub includes a **built-in account system** to secure the dashboard and administrative APIs.

---

## 🧠 Goals

- Protect dashboard and admin APIs
- Support multiple users
- Prevent unauthorized access to API keys
- Keep the system simple to self-host

---

## 👤 User Accounts

### Account Model

Each user account includes:

- unique user ID
- username or email
- password hash
- role (user / admin)
- created timestamp
- last login timestamp

---

### Registration

- User registration can be:
  - enabled (default for self-hosted)
  - disabled (admin-only creation)
- Registration requires:
  - username or email
  - password

Passwords must meet minimum requirements:

- minimum length
- configurable complexity rules

---

## 🔐 Password Handling

- Passwords are never stored in plain text
- Passwords are hashed using:
  - bcrypt or argon2
- Hashing configuration:
  - per-user salt
  - adjustable cost factor

---

## 🔑 Login Flow

```
1. User submits username/email + password
2. Backend verifies password hash
3. Backend issues authentication token
4. Token is returned to client
5. Client stores token securely
```

---

## 🎟️ Authentication Tokens

llm-hub supports one of the following token strategies:

### Option 1: JWT (Recommended)

- Signed JSON Web Tokens
- Stored client-side (memory or secure storage)
- Included in requests via:
  - Authorization header

Example:

```
Authorization: Bearer <token>
```

JWT payload may include:

- user ID
- role
- expiration timestamp

---

### Option 2: Session-Based Auth

- Server-side session storage
- Session ID stored in HTTP-only cookie
- Requires session store (Redis / DB)

---

## 🛂 Authorization

### Roles

llm-hub supports role-based access control (RBAC):

- **admin**
  - manage providers
  - manage API keys
  - view routing logs
  - manage users
- **user**
  - view usage
  - manage own API keys (optional)

---

### Endpoint Protection

- Public LLM API:
  - optional authentication
  - configurable for internal or external use
- Admin endpoints:
  - always require authentication
  - require appropriate role

---

## 🔒 Token Expiration & Refresh

- Tokens have:
  - fixed expiration time
- Optional refresh flow:
  - short-lived access token
  - longer-lived refresh token
- Expired tokens are rejected automatically

---

## 🚫 Abuse Protection

- Rate limits on:
  - login attempts
  - registration attempts
- Failed login attempts may trigger:
  - temporary lockout
  - exponential backoff

---

## 🌐 Frontend Integration (Dashboard)

The dashboard:

- redirects unauthenticated users to login page
- stores auth token securely
- attaches token to all admin API requests
- handles token expiration by re-authentication

---

## 📌 Summary

The authentication system in llm-hub:

- protects sensitive admin functionality
- secures API key management
- supports multi-user environments
- remains simple enough for self-hosting

It is designed to balance **security, usability, and maintainability**.
