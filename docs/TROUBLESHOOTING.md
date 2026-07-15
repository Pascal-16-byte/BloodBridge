# Troubleshooting Guide

Common setup and runtime issues, with causes and fixes. Paths assume the repo layout `backend/` and
`frontned/`.

## Backend

### The app fails to start: "Access denied for user 'root'@'localhost'"

- **Cause:** the MySQL credentials don't match. The default password in `application.properties` is a
  development placeholder.
- **Fix:** set `DB_USERNAME` / `DB_PASSWORD` (and `DB_URL` if needed) to match your MySQL instance:
  ```bash
  export DB_USERNAME=root DB_PASSWORD=your-real-password
  ```

### "Communications link failure" / cannot connect to MySQL

- **Cause:** MySQL isn't running or the URL/port is wrong.
- **Fix:** start MySQL, verify it listens on `3306`, and confirm the host in `DB_URL`. Inside Docker, use
  `host.docker.internal` instead of `localhost` to reach the host's MySQL.

### "Public Key Retrieval is not allowed"

- **Cause:** MySQL 8 auth plugin with `allowPublicKeyRetrieval` disabled.
- **Fix:** the default `DB_URL` already includes `allowPublicKeyRetrieval=true&useSSL=false`; keep those
  params if you override `DB_URL`.

### Unknown timezone / "The server time zone value ... is unrecognized"

- **Cause:** JDBC can't infer the server timezone.
- **Fix:** the default URL sets `serverTimezone=UTC`; keep it in any custom `DB_URL`.

### Port 8080 already in use

- **Fix:** stop the other process or run with a different port: `server.port` can be overridden, e.g.
  `mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081` (and update the frontend
  `VITE_API_BASE_URL` accordingly).

### `401 "Invalid or expired JWT token"` on every protected call

- **Causes & fixes:**
  - The token expired (default 24h) — log in again.
  - `JWT_SECRET` changed between token issuance and validation — tokens signed with the old secret are
    invalid; log in again after settling on one secret.
  - The `Authorization` header isn't `Bearer <token>` — check the client is attaching it.

### `401 "Unauthorized request"`

- **Cause:** no/blank token on a protected endpoint.
- **Fix:** authenticate first and include the bearer token.

### `403 Forbidden` when calling `/api/admin/**`

- **Cause:** the authenticated user is a `DONOR`, not an `ADMIN` (all registrations default to `DONOR`).
- **Fix:** promote the user in the DB: `UPDATE users SET role='ADMIN' WHERE email='...';`, then log in again
  to get a token with the new authority.

### Build fails with Lombok/annotation-processing errors

- **Cause:** IDE not running annotation processing, or a JDK mismatch.
- **Fix:** use JDK 21, enable annotation processing in your IDE, and install the Lombok plugin.

## Frontend

### CORS error in the browser console

- **Cause:** the frontend origin isn't in the backend's `CORS_ALLOWED_ORIGINS`.
- **Fix:** add your origin (e.g. `http://localhost:5173`) to `CORS_ALLOWED_ORIGINS` and restart the backend.
  The defaults already include `5173` and `3000`.

### Network errors / all requests fail

- **Causes & fixes:**
  - Backend not running — start it on `http://localhost:8080`.
  - Wrong API URL — set `VITE_API_BASE_URL` in `frontned/.env` and restart `npm run dev` (Vite only reads
    env vars at startup).

### Logged out unexpectedly / redirected to `/login`

- **Cause:** the Axios response interceptor logs the user out on any `401` (e.g. expired token).
- **Fix:** log in again. If it happens immediately after login, check the backend `JWT_SECRET` is stable.

### New blood request doesn't appear in the public feed

- **Not a bug.** New requests are created with status `PENDING`; the feed only shows `ACTIVE` requests.
  Edit the request and set its status to `ACTIVE`.

### "Password reset is not available yet." / Google sign-in does nothing

- **Expected.** Password reset and Google sign-in are placeholders with no backend
  (see [`FEATURES.md`](./FEATURES.md)).

### Find Donors shows the same donors regardless of the backend

- **Expected.** `FindDonorsPage` filters static preview data; there is no donor-search API.

### `npm run lint` / `npm test` "missing script"

- **Expected.** The frontend `package.json` defines only `dev`, `build`, and `preview` — there are no lint
  or test scripts.

## Database

### Tables not created

- **Cause:** `DDL_AUTO` set to `none`/`validate` without an existing schema.
- **Fix:** for first-time local setup use `update` (the default). For production, create the schema (or use
  migrations) and set `DDL_AUTO=validate`.

### Enum value errors

- **Cause:** sending a non-enum value (e.g. `"A+"` instead of `"A_POSITIVE"`).
- **Fix:** use the canonical enum strings (see [`API.md`](./API.md#enum-value-reference)). The frontend
  services already translate display values to enum values.
