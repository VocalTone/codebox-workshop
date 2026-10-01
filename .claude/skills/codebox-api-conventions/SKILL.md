---
name: codebox-api-conventions
description: Use when adding or reviewing Express API endpoints in CodeBox that read or write Supabase data.
---

# CodeBox API conventions

- Keep HTTP concerns in `routes/`, data access in `services/`, and the Supabase client in `db/`.
- Validate route parameters and JSON input before calling a service. A user id must be a positive integer; a user name must be a non-empty trimmed string.
- Preserve established response shapes for existing endpoints. New mutations return JSON and appropriate HTTP status codes.
- Pass asynchronous failures to Express error middleware. Log only safe error metadata; never log environment values, tokens, or request authorization headers.
- Require the existing JWT middleware for endpoints that change user data. Keep read endpoints public unless the feature request says otherwise.
