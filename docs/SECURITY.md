# Security Documentation

This document describes the security mechanisms actually implemented in BloodBridge, plus the known
security caveats present in the repository.

## Summary

| Area | Status |
| --- | --- |
| Password hashing | ✅ BCrypt |
| Authentication | ✅ Stateless JWT (HMAC) |
| Authorization | ✅ URL role rules + ownership checks |
| Input validation | ✅ Jakarta Bean Validation on all DTOs |
| CORS | ✅ Configurable allow-list |
| CSRF | ✅ Disabled (appropriate for stateless token API) |
| Secrets management | ⚠️ Default DB password & JWT secret committed to `application.properties` |
| Transport security (HTTPS) | ⚠️ Not configured in-app (terminate TLS at a proxy) |
| Rate limiting / brute-force protection | ⛔ Not implemented |

## JWT

- Tokens are signed with HMAC using `application.security.jwt.secret` (decoded as Base64 when possible,
  otherwise raw UTF-8 bytes). See `JwtService`.
- Default expiration is 24h (`JWT_EXPIRATION_MS=86400000`).
- The subject is the user's email; authorities are derived from the user's role.
- Validation checks signature, expiration, and subject match. Failures produce a JSON `401`
  (`"Invalid or expired JWT token"`).
- **Client storage:** the frontend stores the token in `localStorage`. This is convenient but readable by
  any JavaScript on the page, so it is susceptible to XSS-based token theft. A hardened deployment would use
  `HttpOnly` cookies or at least strict CSP; see [`FUTURE_IMPROVEMENTS.md`](./FUTURE_IMPROVEMENTS.md).

## Password Encryption

- `BCryptPasswordEncoder` is registered as the `PasswordEncoder` bean in `SecurityConfig`.
- Passwords are hashed on registration (`AuthServiceImpl.register`) and verified by the
  `DaoAuthenticationProvider` during login.
- Password hashes are never exposed: `UserResponse` (and therefore every API response) omits the password
  field.

## Validation

- All inbound request DTOs (`RegisterRequest`, `LoginRequest`, `DonorProfileRequest`,
  `BloodRequestRequest`) carry Jakarta Bean Validation constraints, enforced by `@Valid` on controller
  methods.
- Validation failures are converted to a `400` with a field→message map by `GlobalExceptionHandler`,
  preventing malformed data from reaching the persistence layer.
- Server-side validation is authoritative; the frontend also validates but that is only a UX convenience.

## CORS

Configured in `SecurityConfig` from `application.cors.allowed-origins`:

- **Allowed origins:** the configured comma-separated list (default `http://localhost:5173`,
  `http://localhost:3000`).
- **Allowed methods:** `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`.
- **Allowed headers:** `Authorization`, `Content-Type`, `Accept`.
- **Credentials:** allowed.
- `OPTIONS /**` is permitted so CORS preflight succeeds.

Lock the allow-list down to your real frontend origin(s) in production.

## CSRF Considerations

CSRF protection is **disabled** (`csrf.disable()`). This is the correct choice for a stateless,
token-authenticated REST API: there is no session cookie for a browser to send automatically, and the JWT
must be attached explicitly by the client. Note the residual risk: because the token is kept in
`localStorage` and sent via an `Authorization` header (not a cookie), classic CSRF does not apply, but XSS
does — mitigate with input/output encoding and a Content-Security-Policy.

## Secure API Practices Implemented

- **Least privilege on registration:** the server ignores any client-supplied role and always assigns
  `DONOR`, preventing privilege escalation to `ADMIN`.
- **Ownership enforcement:** blood-request read/update/delete use `findByIdAndCreatedBy`, so one user
  cannot access another user's requests (a miss returns `404`, not `403`, avoiding resource enumeration).
- **Uniform error envelope:** `ApiResponse` returns structured errors without leaking stack traces
  (the generic handler returns a generic message; the exception detail is placed in `errors`).
- **Stateless sessions:** no session store to fixate or hijack.
- **`open-in-view=false`:** avoids accidental lazy-loading/serialization of entities outside a transaction.

## Known Caveats (must address before production)

1. **Committed secrets.** `application.properties` ships with a real-looking default DB password
   (`OhYesAbhi#16`) and a default JWT secret. Anyone with repo access can read them. Actions:
   - Override `DB_PASSWORD` and `JWT_SECRET` via environment variables in all shared environments.
   - Rotate the database password and JWT secret.
   - Consider removing the literal defaults (or replacing them with obvious placeholders) so a
     misconfigured deployment fails fast instead of silently using a known secret.
2. **Token in `localStorage`** — XSS exposure (see JWT section).
3. **No rate limiting / account lockout** — login is unthrottled; brute-force is possible.
4. **No HTTPS enforcement in-app** — terminate TLS at a load balancer/reverse proxy and redirect HTTP.
5. **The generic 500 handler places the exception message in `errors`** — fine for development, but you may
   want to suppress that detail in production to avoid information disclosure.

See [`FUTURE_IMPROVEMENTS.md`](./FUTURE_IMPROVEMENTS.md) for prioritized hardening suggestions.
