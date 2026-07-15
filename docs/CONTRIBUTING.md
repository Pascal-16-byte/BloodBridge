# Contributing Guide

Thanks for your interest in improving BloodBridge! This guide reflects the current repository structure and
conventions.

## Project Structure

```text
BloodBridge/
├── backend/     # Spring Boot 3 (Java 21) REST API
├── frontned/    # React 19 + Vite SPA  (note: spelled "frontned")
└── docs/        # Project documentation (this folder)
```

See [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`BACKEND.md`](./BACKEND.md), and [`FRONTEND.md`](./FRONTEND.md)
for detailed layouts before making changes.

## Development Workflow

1. **Fork & branch.** Create a feature branch from the default branch (`main`):
   ```bash
   git checkout -b feat/short-description
   ```
2. **Set up locally.** Follow [`SETUP.md`](./SETUP.md) to run MySQL, the backend, and the frontend.
3. **Make focused changes.** Keep PRs scoped to one concern.
4. **Verify your changes build:**
   - Backend: `cd backend && mvn clean package`
   - Frontend: `cd frontned && npm install && npm run build`
5. **Commit** with clear, imperative messages (e.g. `Add city index to blood_requests`).
6. **Open a Pull Request** describing what changed and why. Reference any related issue.

## Coding Standards

### Backend (Java / Spring Boot)

- **Java 21**, 4-space indentation.
- Follow the existing **layered architecture**: `controller → service (interface + impl) → repository`, with
  DTOs at the boundary and mappers for entity⇄DTO conversion. Don't return entities from controllers.
- Use **constructor injection** (`@RequiredArgsConstructor`), not field injection.
- Wrap all responses in `ApiResponse<T>` and let `GlobalExceptionHandler` translate exceptions — throw the
  appropriate custom exception (`ConflictException`, `DuplicateEmailException`, `ResourceNotFoundException`)
  instead of returning ad-hoc error bodies.
- Validate inbound DTOs with Jakarta Bean Validation annotations + `@Valid`.
- Keep business logic in services; keep controllers thin.
- Never log or return secrets or password hashes.
- Prefer derived Spring Data query methods; add `@Query` only when necessary.

### Frontend (React / JavaScript)

- **Functional components + hooks** only.
- 2-space indentation; ES modules.
- Do all HTTP through the shared Axios instance (`config/axios.js`) and the `services/*` modules — don't
  call `axios`/`fetch` directly from components.
- Keep route path strings in `constants/routes.js`.
- Style with **Tailwind utility classes**; reuse the theme tokens defined in `tailwind.config.js` rather
  than hard-coding colors.
- Reuse existing components in `components/` (buttons, `ui/`, `common/`) before adding new ones.
- Use `react-hot-toast` (`utils/toast.js`) for user feedback and `LoadingSkeleton`/`EmptyState` for async
  states.
- Guard protected pages with `ProtectedRoute`.

## Documentation Expectations

- Update the relevant file(s) in `docs/` when you change behavior, endpoints, configuration, or the schema.
- **Base documentation strictly on the code.** If a feature is a placeholder or preview, label it as such
  (see the tagging convention in [`FEATURES.md`](./FEATURES.md)).

## Testing

- The backend includes test dependencies (`spring-boot-starter-test`, `spring-security-test`) but **no test
  classes yet** — new tests are welcome under `backend/src/test/java`. Run with `mvn test`.
- The frontend has **no test tooling configured**. Adding a test setup (e.g. Vitest + React Testing Library)
  is a valuable contribution — see [`FUTURE_IMPROVEMENTS.md`](./FUTURE_IMPROVEMENTS.md).

## Commit & PR Checklist

- [ ] Backend compiles: `mvn clean package`
- [ ] Frontend builds: `npm run build`
- [ ] No secrets or credentials committed
- [ ] `docs/` updated if behavior/config/schema changed
- [ ] Placeholders/incomplete work clearly labeled
- [ ] PR description explains the what and why
