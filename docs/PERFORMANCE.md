# Performance Considerations

This document describes performance-relevant characteristics **actually present** in the code, and where
optimizations are absent (so nothing is overstated).

## Backend

### Implemented

- **Stateless architecture.** No server-side session store means the API scales horizontally without
  sticky sessions or session replication.
- **Lazy associations.** `DonorProfile.user` and `BloodRequest.createdBy` are `fetch = LAZY`, so related
  entities are only loaded when accessed. Combined with `spring.jpa.open-in-view=false`, this keeps queries
  scoped to the service transaction and avoids serializing entire object graphs.
- **Derived, targeted queries.** Repository methods fetch exactly what's needed:
  - `findByCreatedByOrderByCreatedAtDesc` for the user's own requests,
  - `findByStatus` / `findByStatusAndCityIgnoreCase` (with a `Sort`) for the feed,
  - `countByCreatedByAndStatus` for dashboard counts (a `COUNT` query rather than loading rows),
  - `existsByEmail` / `existsByUser` for cheap existence checks.
- **DTO projections in responses.** Controllers return DTOs (`UserResponse`, `BloodRequestResponse`, …)
  rather than entities, avoiding accidental lazy-loading during serialization and trimming payload size.
- **Sorting pushed to the database** for the `latest` feed (`Sort` passed to the repository). The
  `urgency` ordering is applied in-memory after fetching the active set.

### Not implemented / caveats

- **No pagination.** List and feed endpoints return `List<...>` with no `Pageable`, so `GET /api/requests`,
  `GET /api/requests/feed`, and `GET /api/admin/users` return *all* matching rows. This is fine at small
  scale but should be paginated as data grows.
- **No caching layer** (no `@Cacheable`, Redis, or HTTP cache headers).
- **No custom database indexes** beyond PK/unique/FK. The feed filters on `status` and `city`; adding
  indexes there would help once the table is large (see [`DATABASE.md`](./DATABASE.md)).
- **`ddl-auto=update`** runs schema diffing at startup — acceptable for dev, but production should use
  `validate` + migrations.
- **Urgency sorting is in-memory**, so an urgency-sorted feed still loads the full active set first.

## Frontend

### Implemented

- **Vite build** produces an optimized, minified, tree-shaken production bundle (`npm run build`).
- **On-demand data fetching.** Pages fetch only the data they need inside `useEffect`, with `loading` and
  `error` states and `LoadingSkeleton` placeholders for perceived performance.
- **Scroll-triggered work.** `react-intersection-observer` defers counter animations (`AnimatedCounter`)
  until elements enter the viewport.
- **Request cancellation guard.** Data-loading effects use an `active` flag in their cleanup to ignore
  responses after unmount, preventing stale state updates.
- **Single shared Axios instance** with interceptors — consistent, low-overhead request handling.

### Not implemented / caveats

- **No route-based code splitting / lazy loading.** Routes are imported eagerly in `routes/AppRoutes.jsx`
  (no `React.lazy`/`Suspense`), so the whole app ships in the initial bundle. This is the single biggest
  available frontend optimization (see [`FUTURE_IMPROVEMENTS.md`](./FUTURE_IMPROVEMENTS.md)).
- **No client-side data caching / dedupe.** There is no React Query/SWR; navigating back to a page re-fetches
  its data.
- **No memoization hot-paths of note.** Components generally re-render normally; there is no evidence of
  `React.memo`/`useMemo` tuning beyond `EditRequestPage`'s `useMemo` for form values.
- **Static marketing data** (`utils/siteData.js`, `utils/previewData.js`) is bundled with the app, which is
  fast to render but increases bundle size.

## Summary

BloodBridge follows sensible defaults (lazy JPA associations, DTO responses, targeted queries, a Vite
build, on-demand fetching) but does **not** yet implement pagination, caching, database indexing beyond the
essentials, or frontend code splitting. These are the primary levers for scaling.
