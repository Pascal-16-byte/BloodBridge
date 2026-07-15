# Features Documentation

This document describes each feature and its **actual implementation status**, based strictly on the code.
Every feature is tagged:

- ✅ **Implemented** — backend endpoint(s) exist and the frontend is wired to them.
- 🟡 **Partial / Preview** — UI exists but is not (fully) connected to a backend.
- ⛔ **Placeholder / Not implemented** — stub, simulated, or unused code.

| Feature | Status |
| --- | --- |
| User registration | ✅ Implemented |
| Login (JWT) | ✅ Implemented |
| Current-user hydration | ✅ Implemented |
| Donor profile management | ✅ Implemented |
| Blood request management (CRUD) | ✅ Implemented |
| Public active-request feed | ✅ Implemented |
| Dashboard summary | ✅ Implemented (with hard-coded `totalDonations`) |
| Admin: list users | ✅ Implemented (backend only, no UI) |
| Role-based access control | ✅ Implemented |
| Find Donors / search | 🟡 Preview (static data) |
| "Become a Donor" quick form | 🟡 Preview (no backend call) |
| Notifications | 🟡 Client-synthesized (no backend) |
| Forgot / reset password | ⛔ Placeholder (simulated) |
| Google sign-in | ⛔ Placeholder (toast only) |
| Donation history / total donations | ⛔ Not implemented (hard-coded `0`) |

---

## ✅ User Registration

- **Backend:** `POST /api/auth/register` → `AuthServiceImpl.register`. Normalizes email, BCrypt-hashes the
  password, forces `role = DONOR`, rejects duplicate emails (`409`).
- **Frontend:** `RegisterPage.jsx` (react form) → `authService.register`. Collects full name, email,
  password, phone, blood group, gender, date of birth, city, state, availability, and (unused) role/avatar.
  The frontend composes `address` as `"city, state"` before sending.
- **Caveat:** the UI's role selector and avatar upload are **not** sent to / stored by the backend.

## ✅ Login (JWT)

- **Backend:** `POST /api/auth/login` → authenticates via `AuthenticationManager`, returns a signed JWT +
  user.
- **Frontend:** `LoginPage.jsx` → `AuthContext.login` stores token/user in `localStorage`, then fetches the
  profile. Redirects to the originally requested protected page or `/dashboard`.

## ✅ Current-User Hydration

- **Backend:** `GET /api/donor/profile` (role `DONOR`) returns the caller's account (`UserResponse`).
- **Frontend:** called on app load (if a token exists) and after login to refresh `currentUser`.

## ✅ Donor Profile Management

- **Backend:** `GET/POST/PUT /api/profile` → `DonorProfileServiceImpl`. One profile per user; `POST`
  returns `409` if one already exists. The mapper computes `completionPercentage` over 12 fields and sets
  `profileCompleted`.
- **Frontend:**
  - `ProfilePage.jsx` — reads `/profile`; if `404`, prompts the user to complete the profile.
  - `EditProfilePage.jsx` — create-or-update flow with client-side validation (age 18–65, weight ≥45,
    distance 1–250, pincode, past `lastDonationDate`, `medicalConditions` length).

## ✅ Blood Request Management (CRUD)

- **Backend:** `/api/requests` — create (`POST`), list-own (`GET`), get-own (`GET /{id}`), update-own
  (`PUT /{id}`), delete-own (`DELETE /{id}`). Ownership enforced via `findByIdAndCreatedBy`. New requests
  default to `PENDING`.
- **Frontend:**
  - `CreateRequestPage.jsx` → `POST /requests` (via shared `BloodRequestForm`).
  - `MyRequestsPage.jsx` → lists and deletes the caller's requests.
  - `RequestDetailsPage.jsx` → view + delete a single request.
  - `EditRequestPage.jsx` → update, with the `status` field enabled (this is how a request is moved to
    `ACTIVE`, `FULFILLED`, etc.).

## ✅ Public Active-Request Feed

- **Backend:** `GET /api/requests/feed` (and its alias `/active`) — **public**, returns only `ACTIVE`
  requests. Supports `sort=latest|urgency` and an optional case-insensitive `city` filter.
- **Frontend:** `ActiveRequestsPage.jsx` (routes `/active-requests` and `/requests/feed`) →
  `getActiveRequestFeed`, with sort toggle and city search rendered by `RequestFeed`.
- **Note:** because new requests are `PENDING`, a request only appears in the feed after its owner sets its
  status to `ACTIVE` via edit.

## ✅ Dashboard

- **Backend:** `GET /api/dashboard` → `DashboardServiceImpl` returns `userName`, `bloodGroup`,
  `profileCompletion`, `donationEligibility` (eligible when no donation in the last 90 days),
  `lastDonationDate`, `emergencyAvailability`, `totalDonations` (**hard-coded `0`**), `activeRequestsCount`,
  and `pendingRequestsCount`.
- **Frontend:** `DashboardPage.jsx` renders stat cards, a Recharts pie + bar chart, a timeline, and
  notification-style cards **derived on the client** from the summary.

## ✅ Admin: List Users

- **Backend:** `GET /api/admin/users` (role `ADMIN`) → `UserServiceImpl` returns all users.
- **Frontend:** **none** — there is no admin route or UI. The endpoint must be called directly with an
  admin JWT. Admin promotion is a manual DB update (see [`AUTHENTICATION.md`](./AUTHENTICATION.md)).

## ✅ Role-Based Access Control

Enforced by `SecurityConfig` URL rules (`ADMIN`, `DONOR`, authenticated, public) plus service-layer
ownership checks. See [`AUTHENTICATION.md`](./AUTHENTICATION.md#protected-routes).

---

## 🟡 Find Donors / Search

- **Frontend:** `FindDonorsPage.jsx` filters a hard-coded array `donorDirectory` from
  `utils/previewData.js` (by blood group, state, district, city) with in-memory pagination.
- **Backend:** **none** — there is no donor-search/listing endpoint. `services/donorService.js` contains
  only empty `TODO` stubs (`getDonors`, `registerDonor`). This is a UI preview, not a live search.

## 🟡 "Become a Donor" Quick Form

- **Frontend:** `BecomeDonorPage.jsx` (routes `/donor`, `/become-donor`) is a marketing form that keeps
  state locally and shows a `SuccessModal` on submit. It does **not** call the backend.
- **Real donor onboarding** happens by registering and then completing the donor profile on
  `/profile/edit`.

## 🟡 Notifications

- There is **no notifications backend** (no entity, endpoint, or service). `DashboardPage.jsx` synthesizes
  notification-style cards from the dashboard summary on the client. Treat these as UI hints, not a
  persisted notification system.

---

## ⛔ Forgot / Reset Password

- **Frontend:** `ForgotPasswordPage.jsx` simulates success with a `setTimeout` (~1s) and shows a confirmation
  state; the page itself notes production email delivery isn't wired up.
- **Service:** `authService.requestPasswordReset()` throws `"Password reset is not available yet."`.
- **Backend:** no reset endpoint exists. Fully a placeholder.

## ⛔ Google Sign-In

- **Frontend:** the "Continue with Google" button on `LoginPage.jsx` only shows a toast:
  *"Google sign-in is not enabled for this backend yet."* No OAuth is implemented.

## ⛔ Donation History / Total Donations

- `DashboardResponse.totalDonations` is hard-coded to `0` in `DashboardServiceImpl`. There is no
  donation-history entity or endpoint.

---

## Unused / Legacy Code (for maintainers)

- `pages/RequestBloodPage.jsx` — a preview request form that is **not referenced by the router**.
- `constants/apiEndpoints.js` — a constants file listing endpoints (some non-existent, e.g.
  `/auth/forgot-password`, `/donors`, `/dashboard/summary`) that is **not imported** by any service. The
  real endpoint paths live inside each `services/*.js` module.
