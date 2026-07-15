# Project Overview

## Purpose of BloodBridge

BloodBridge is a full-stack **blood donation and emergency blood-request platform**. It lets people
register as donors, maintain a detailed donor profile, create and manage emergency blood requests, and
browse a live feed of active requests. The backend `pom.xml` describes the project as a
*"Blood Donation and Emergency Request System backend"*, and the frontend `index.html` describes it as a
*"warm, modern emergency blood donation platform."*

The codebase is split into two independent applications that live in the same repository:

| Application | Directory | Stack |
| --- | --- | --- |
| Backend REST API | `backend/` | Spring Boot 3 (Java 21) |
| Web client (SPA) | `frontned/` | React 19 + Vite |

> **Note on the directory name:** the frontend folder is spelled `frontned` (not `frontend`) in the
> repository. All paths in this documentation use the real name, `frontned/`.

## Problem Statement

During medical emergencies, coordinating blood donations is slow and fragmented:

- Families and hospitals struggle to find matching, available donors quickly.
- Donors have no simple way to advertise availability or eligibility.
- Emergency requests (patient, hospital, blood group, urgency, deadline) are communicated over ad-hoc
  channels with no structure or tracking.

## Solution

BloodBridge provides a structured, authenticated web application where:

- Users register and receive a JWT-based session.
- Donors complete a rich donor profile (blood group, age, weight, availability, location, preferred
  donation distance) with an automatically computed completion percentage.
- Authenticated users create, view, edit, and delete their own **blood requests** with full patient,
  hospital, contact, urgency, and deadline details.
- Anyone can browse the **public active-request feed**, sortable by recency or urgency and filterable by
  city.
- A personal **dashboard** summarizes profile completion, donation eligibility (based on a 90-day wait),
  emergency availability, and request counts.

## Key Features

Only features that are actually implemented in the code are listed here. Features that are partially
implemented or are frontend-only previews are called out explicitly (see also
[`FEATURES.md`](./FEATURES.md)).

### Fully implemented (backend + frontend wired)

- **User registration** — `POST /api/auth/register`; every registered user is assigned the `DONOR` role.
- **Login with JWT** — `POST /api/auth/login`; returns a signed JWT plus the user object.
- **Current-user profile** — `GET /api/donor/profile` returns the authenticated user's account record.
- **Donor profile management** — create/read/update via `GET/POST/PUT /api/profile`, including a
  completion-percentage calculation.
- **Blood request management (CRUD)** — create, list-own, get-own, update-own, delete-own via
  `/api/requests`.
- **Public active-request feed** — `GET /api/requests/feed` and `GET /api/requests/active`, with
  `sort` (`latest` | `urgency`) and `city` query parameters.
- **Dashboard summary** — `GET /api/dashboard` aggregates profile, eligibility, and request counts.
- **Admin: list all users** — `GET /api/admin/users` (requires `ADMIN` role).
- **Role-based access control** — enforced by Spring Security URL rules (`ADMIN`, `DONOR`, authenticated).

### Partially implemented / placeholder (highlighted)

- **Forgot password** — the frontend page (`ForgotPasswordPage.jsx`) *simulates* sending a reset link with
  a `setTimeout`; there is **no backend endpoint** and `authService.requestPasswordReset()` throws
  `"Password reset is not available yet."`.
- **Find Donors** — `FindDonorsPage.jsx` filters a hard-coded array (`donorDirectory` in
  `utils/previewData.js`); there is **no donor-search API**. `services/donorService.js` contains only
  `TODO` stubs.
- **Become a Donor** — `BecomeDonorPage.jsx` is a frontend-only preview that shows a success modal and
  does not call the backend. (Real donor-profile creation happens on the profile edit page.)
- **Google sign-in** — the button on the login page shows a toast: *"Google sign-in is not enabled for
  this backend yet."*
- **Total donations** — the dashboard `totalDonations` value is hard-coded to `0` in the backend
  (`DashboardServiceImpl`); there is no donation-history model.
- **Notifications** — there is no notifications backend; the dashboard synthesizes notification-style
  cards on the client from the summary data.
- **`RequestBloodPage.jsx`** — an unused/legacy preview form that is **not wired into the router**.
- **`constants/apiEndpoints.js`** — a stale constants file that is not imported by any service (the real
  paths live in the individual service modules).

## Target Users

- **Donors** — individuals who register, complete a donor profile, and manage their availability.
- **Requesters** — authenticated users (also donors, since registration defaults to `DONOR`) who create
  and track blood requests for patients.
- **Administrators** — users promoted to the `ADMIN` role (currently via a manual SQL update; see
  [`AUTHENTICATION.md`](./AUTHENTICATION.md)) who can list all users.
- **Public visitors** — unauthenticated users who can browse marketing pages and the active-request feed.

## Technology Stack

### Backend

| Concern | Technology | Version |
| --- | --- | --- |
| Language | Java | 21 |
| Framework | Spring Boot | 3.3.5 |
| Web | `spring-boot-starter-web` | (managed by parent) |
| Security | `spring-boot-starter-security` (Spring Security 6) | (managed) |
| Persistence | `spring-boot-starter-data-jpa` / Hibernate | (managed) |
| Validation | `spring-boot-starter-validation` (Jakarta Bean Validation) | (managed) |
| Database driver | `com.mysql:mysql-connector-j` | (managed) |
| JWT | `io.jsonwebtoken:jjwt-api/impl/jackson` | 0.12.6 |
| Boilerplate | Lombok | (managed) |
| Build | Maven (via `spring-boot-starter-parent`) | — |
| Container | Docker (multi-stage, Temurin 21) | — |

### Frontend

| Concern | Technology | Version (from `package.json`) |
| --- | --- | --- |
| UI library | React / React DOM | ^19.1.1 |
| Build tool | Vite | ^7.0.4 |
| React plugin | `@vitejs/plugin-react` | ^5.0.0 |
| Routing | `react-router-dom` | ^7.7.1 |
| HTTP client | `axios` | ^1.11.0 |
| Styling | Tailwind CSS + PostCSS + Autoprefixer | ^3.4.17 |
| Animation | `framer-motion` | ^12.23.12 |
| Forms | `react-hook-form` | ^7.81.0 |
| Toasts | `react-hot-toast` | ^2.5.2 |
| Charts | `recharts` | ^3.9.2 |
| Icons | `lucide-react`, `react-icons` | ^1.24.0 / ^5.5.0 |
| Counters/visibility | `react-countup`, `react-intersection-observer` | ^6.5.3 / ^9.16.0 |

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for how these pieces fit together and
[`DEPENDENCIES` in `CONFIGURATION.md`](./CONFIGURATION.md#dependencies) for why each dependency is used.
