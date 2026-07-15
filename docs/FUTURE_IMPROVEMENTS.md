# Future Improvements

Realistic, code-grounded enhancements. Each item references what exists today so the suggestion is
actionable rather than speculative.

## Complete the Placeholder Features

These already have UI but no backend (see [`FEATURES.md`](./FEATURES.md)):

- **Password reset.** `authService.requestPasswordReset()` throws and `ForgotPasswordPage` is simulated.
  Add a reset flow: `POST /api/auth/forgot-password` (issue a time-limited token + email) and
  `POST /api/auth/reset-password`. An `/auth/forgot-password` path is already referenced in
  `constants/apiEndpoints.js`.
- **Donor search / directory.** `FindDonorsPage` filters static `donorDirectory` data and
  `donorService.getDonors()` is a stub. Add `GET /api/donors` with filters (blood group, city/district,
  availability) and pagination, then wire the page to it.
- **"Become a Donor" submission.** `BecomeDonorPage` only shows a success modal. Either connect it to the
  donor-profile endpoints or remove it in favor of the existing `/profile/edit` flow to avoid confusion.
- **Google sign-in.** Replace the placeholder toast with a real OAuth2 flow (`spring-boot-starter-oauth2-client`
  or an OpenID Connect provider) if social login is desired.

## Donation History & Real Metrics

- `DashboardResponse.totalDonations` is hard-coded to `0`. Introduce a `donations` entity (donor, request,
  date, units) so `totalDonations`, eligibility, and dashboard charts reflect real data.

## Admin Capabilities

- Only `GET /api/admin/users` exists, with no UI. Add an admin dashboard route (guarded for `ADMIN`) and
  endpoints for managing users/requests (e.g. changing request status, deactivating users). Add an API to
  grant/revoke the `ADMIN` role instead of manual SQL.

## Persistence & Schema Management

- Replace `ddl-auto=update` with **managed migrations** (Flyway or Liquibase) and set `DDL_AUTO=validate`
  in production.
- Add **database indexes** for the feed query (`blood_requests.status`, `blood_requests.city`) once data
  grows (see [`DATABASE.md`](./DATABASE.md)).
- Add **pagination** (`Pageable`) to `GET /api/requests`, `GET /api/requests/feed`, and
  `GET /api/admin/users` — currently they return all rows (see [`PERFORMANCE.md`](./PERFORMANCE.md)).

## Security Hardening

(See [`SECURITY.md`](./SECURITY.md) for detail.)

- **Remove committed secrets.** Replace the default `DB_PASSWORD` and `JWT_SECRET` in
  `application.properties` with obvious placeholders (fail-fast) and rotate the real values.
- **Token storage.** Move JWTs to `HttpOnly` cookies (or add a strict CSP) to reduce XSS token-theft risk.
- **Rate limiting / lockout** on `/api/auth/login` to slow brute-force attempts.
- **HTTPS** enforced at the proxy, with HTTP→HTTPS redirects.
- Consider **refresh tokens** so access tokens can be short-lived.

## Frontend Performance & DX

- **Route-based code splitting** with `React.lazy` + `Suspense` in `routes/AppRoutes.jsx` (currently all
  pages are imported eagerly).
- **Server-state caching** with React Query/SWR to dedupe and cache API calls.
- **Add tooling:** ESLint + Prettier and a test setup (Vitest + React Testing Library); add matching npm
  scripts (`lint`, `test`) — none exist today.
- **Clean up dead code:** the unused `pages/RequestBloodPage.jsx` and the stale
  `constants/apiEndpoints.js`.

## Testing & CI/CD

- Add **backend tests** (the test dependencies are already present, but no tests exist) covering auth,
  ownership rules, and validation.
- Add **frontend tests** for services and key pages.
- Add a **CI pipeline** (e.g. GitHub Actions) to build/test both apps on PRs.
- Add a **frontend Dockerfile** and/or deployment config (none exists; only the backend is containerized).

## Product Enhancements

- **Request status lifecycle in the UI:** surface a clear action to move a request `PENDING → ACTIVE` so it
  appears in the public feed (today this is only possible via the edit form's status field).
- **Notifications backend:** replace the client-synthesized dashboard "notifications" with a real
  notifications model and endpoint.
- **Matching:** notify eligible donors when a nearby request matches their blood group and location.
- **Repository hygiene:** consider renaming `frontned/` → `frontend/`, adding a root `LICENSE` file (none is
  present — see [the README](../README.md#license)), and committing a root README (added by this docs work).
