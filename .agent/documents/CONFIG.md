# Configuration

This document describes how **llm-hub** is configured, including providers, API keys, routing rules, and quota strategies.

Configuration is designed to be **explicit, flexible, and safe by default**.

---

## 🧠 Configuration Goals

- Support multiple providers and API keys
- Enable quota-aware routing
- Allow safe fallback and rotation
- Avoid hardcoding secrets in code
- Be easy to reason about and modify

---

## ⚙️ Configuration Sources

llm-hub supports configuration from:

- environment variables
- database (runtime state)
- static defaults in code

Sensitive data (API keys, secrets) are **never stored in plain text**.

---

## 🌐 Providers

Each LLM provider is defined with metadata and priority.

Example provider configuration:

```
provider:
  name: openai
  enabled: true
  priority: 1
```

Provider fields:

- `name` – unique provider identifier
- `enabled` – whether routing is allowed
- `priority` – lower number = higher priority

Providers with higher priority are selected first during routing.

---

## 🔑 API Key Configuration

Each provider can have multiple API keys.

Example:

```
api_key:
  provider: openai
  encrypted_key: <encrypted>
  status: active
  priority: 1
```

API key fields:

- `provider` – owning provider
- `status` – active / disabled / cooldown / exhausted
- `priority` – optional ordering within provider

Only keys with `status = active` are eligible for routing.

---

## 🧮 Quota Configuration

Quota limits may be:

- explicitly configured
- inferred from provider defaults
- dynamically learned from usage

Tracked quota dimensions:

- tokens per minute
- tokens per day
- requests per minute
- requests per day

Quota configuration example:

```
quota:
  tokens_per_day: 100000
  requests_per_minute: 60
```

---

## 🔄 Routing Strategy

The routing engine selects a provider and API key based on:

1. Provider enabled status
2. Provider priority
3. API key status
4. Remaining quota
5. Cooldown state

Routing strategy is **deterministic but adaptive**.

---

### Fallback Rules

Fallback is triggered when:

- quota is exhausted
- rate limit is hit
- provider returns retryable error

Fallback order:

- next API key in same provider
- next provider by priority

Fallback events are logged for observability.

---

## 🧊 Cooldown Strategy

When a key hits a rate limit:

- key is placed into cooldown
- cooldown duration is configurable

Example:

```
cooldown:
  duration_seconds: 300
```

Keys in cooldown are skipped until cooldown expires.

---

## 🧠 Logical Model Mapping

Logical model names are mapped internally.

Example:

```
model_mapping:
  smart:
    - openai
    - claude
  fast:
    - gemini
  cheap:
    - mistral
```

The router attempts providers in listed order.

---

## ⚠️ Safety Defaults

Default configuration favors safety:

- conservative rate limits
- minimal concurrency per key
- automatic cooldown on errors
- disabled providers excluded entirely

These defaults reduce the risk of:

- provider bans
- cascading failures
- quota exhaustion storms

---

## 🔧 Runtime Overrides

Admins may override configuration at runtime:

- disable providers
- force cooldown keys
- adjust priorities

Runtime overrides do not modify static configuration files.

---

## 📌 Summary

Configuration in llm-hub controls:

- which providers are used
- how API keys are rotated
- how quotas are enforced
- how routing and fallback behave

Clear configuration is essential for **safe and predictable operation**.
