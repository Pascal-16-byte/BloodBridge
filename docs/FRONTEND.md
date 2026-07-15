# Frontend Documentation

The frontend is a React 19 single-page application built with Vite, located in `frontned/` (note the
spelling). It is styled with Tailwind CSS and animated with Framer Motion.

## Entry Points

```jsx
// src/main.jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-right" toastOptions={{ /* rounded, bordered toasts */ }} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
```

- `index.html` — mounts `#root` and loads `/src/main.jsx`.
- `main.jsx` — wraps the app in `BrowserRouter`, `AuthProvider`, and a global `Toaster`.
- `App.jsx` — renders `<AppRoutes />` (nothing else).

## Folder Structure

```text
frontned/src/
├── main.jsx  App.jsx
├── assets/images/          # blood.jpg + .gitkeep
├── components/
│   ├── AnimatedCounter.jsx  PageTransition.jsx  SectionHeading.jsx
│   ├── auth/               # AuthLayout, AuthSection, ProfileUpload, ProtectedRoute
│   ├── buttons/            # PrimaryButton, SecondaryButton
│   ├── common/            # AnimatedCard, BloodBadge, ConfirmDialog, EmptyState,
│   │                        FeatureCard, LoadingSkeleton, PageHeader, SearchBar,
│   │                        SectionTitle, StatCard, SuccessModal
│   ├── faq/               # FAQAccordion
│   ├── layout/            # Navbar, Footer
│   ├── navbar/            # UserMenu
│   ├── requests/          # BloodRequestForm, RequestFeed
│   └── ui/                # Card, ErrorMessage, InputField, LoadingButton,
│                            PasswordField, SelectField, SuccessMessage, authStyles.js
├── config/                # axios.js, environment.js
├── constants/             # apiEndpoints.js, bloodGroups.js, routes.js
├── context/               # AuthContext.jsx
├── helpers/               # formatDate.js, storage.js, validation.js
├── hooks/                 # useAuth.js
├── layout/                # MainLayout.jsx
├── pages/                 # 20 route/page components
├── routes/                # AppRoutes.jsx
├── services/              # authService, dashboardService, donorService, profileService, requestService
├── styles/                # index.css (Tailwind entry + font import)
└── utils/                 # authStorage, authValidation, previewData, siteData, toast
```

## React Architecture

- **Composition:** `main.jsx` → `App` → `AppRoutes` → `MainLayout` (Navbar + `<Outlet/>` + Footer) →
  page components.
- **State:** authentication is the only global state, held in `AuthContext`. Everything else is local
  component state (`useState`/`useEffect`) or server state fetched on demand via service modules. There is
  **no Redux/Zustand/React Query** — see [State Management](#state-management).
- **Data fetching:** pages call service functions in `services/*` inside `useEffect`, tracking
  `loading`/`error` locally and rendering `LoadingSkeleton` / `EmptyState` accordingly.

## Routing

Routing uses `react-router-dom` v7 via `useRoutes` in `routes/AppRoutes.jsx`, wrapped in Framer Motion's
`AnimatePresence` keyed by pathname for page transitions. Route path constants live in
`constants/routes.js` (`ROUTES`, `navLinks`, `footerLinks`).

| Path | Page | Protected? |
| --- | --- | --- |
| `/` | `HomePage` | Public |
| `/about` | `AboutPage` | Public |
| `/donor`, `/become-donor` | `BecomeDonorPage` | Public |
| `/find-donors` | `FindDonorsPage` | Public |
| `/active-requests`, `/requests/feed` | `ActiveRequestsPage` | Public |
| `/contact` | `ContactPage` | Public |
| `/faq` | `FAQPage` | Public |
| `/emergency-request`, `/request-blood` | `CreateRequestPage` | **Protected** |
| `/requests` | `MyRequestsPage` | **Protected** |
| `/requests/:id` | `RequestDetailsPage` | **Protected** |
| `/requests/:id/edit` | `EditRequestPage` | **Protected** |
| `/dashboard` | `DashboardPage` | **Protected** |
| `/profile` | `ProfilePage` | **Protected** |
| `/profile/edit` | `EditProfilePage` | **Protected** |
| `/login` | `LoginPage` | Public (outside `MainLayout`) |
| `/register` | `RegisterPage` | Public (outside `MainLayout`) |
| `/forgot-password` | `ForgotPasswordPage` | Public (outside `MainLayout`) |
| `*` | `NotFoundPage` | Public |

Protected routes are wrapped in `<ProtectedRoute>`, which shows a skeleton while auth is resolving and
redirects to `/login` (preserving `location` in router state) when unauthenticated.

## Pages

| Page | Backend calls | Notes |
| --- | --- | --- |
| `HomePage` | — | Marketing landing (hero, stats, why/how, testimonials) from `utils/siteData.js` |
| `AboutPage`, `ContactPage`, `FAQPage` | — | Static content from `utils/previewData.js` |
| `LoginPage` | `login()` → `/auth/login` then `/donor/profile` | Google button shows "not enabled" toast |
| `RegisterPage` | `register()` → `/auth/register` | Collects a `role` field that the backend ignores (always `DONOR`); `address` is composed as `"city, state"` |
| `ForgotPasswordPage` | **none** | Simulated with `setTimeout` — placeholder |
| `DashboardPage` | `getDashboardSummary()` → `/dashboard` | Recharts pie/bar + derived stats, timeline, notifications |
| `ProfilePage` | `getDonorProfile()` → `/profile` | 404 → prompt to complete profile |
| `EditProfilePage` | `getDonorProfile`, `createDonorProfile`, `updateDonorProfile` | Create-or-update donor profile |
| `CreateRequestPage` | `createBloodRequest()` → `POST /requests` | Uses `BloodRequestForm` |
| `MyRequestsPage` | `getBloodRequests()`, `deleteBloodRequest()` | Lists the caller's requests |
| `RequestDetailsPage` | `getBloodRequest(id)`, `deleteBloodRequest(id)` | View/delete a single request |
| `EditRequestPage` | `getBloodRequest(id)`, `updateBloodRequest(id)` | Edit with status field enabled |
| `ActiveRequestsPage` | `getActiveRequestFeed()` → `/requests/feed` | Public live feed with sort + city filter |
| `FindDonorsPage` | **none** | Filters static `donorDirectory` preview data — placeholder |
| `BecomeDonorPage` | **none** | Frontend-only preview form (success modal) — placeholder |
| `RequestBloodPage` | **none** | **Not routed** — legacy/unused preview form |
| `NotFoundPage` | — | 404 fallback |

## Components

Reusable components grouped by folder:

- **Top-level:** `AnimatedCounter` (react-countup + intersection observer), `PageTransition` (Framer
  Motion page wrapper), `SectionHeading`.
- **`auth/`:** `AuthLayout` (split-screen auth shell), `AuthSection` (grouped form section),
  `ProfileUpload` (avatar preview), `ProtectedRoute` (route guard).
- **`buttons/`:** `PrimaryButton`, `SecondaryButton` (both support `as={Link}` polymorphism).
- **`common/`:** `AnimatedCard`, `BloodBadge`, `ConfirmDialog`, `EmptyState`, `FeatureCard`,
  `LoadingSkeleton`, `PageHeader`, `SearchBar`, `SectionTitle`, `StatCard`, `SuccessModal`.
- **`faq/`:** `FAQAccordion`.
- **`layout/`:** `Navbar` (scroll-aware, responsive, shows `UserMenu` when logged in), `Footer`.
- **`navbar/`:** `UserMenu` (accessible dropdown with Dashboard/Profile/Logout + keyboard navigation).
- **`requests/`:** `BloodRequestForm` (react-hook-form powered, shared by create/edit), `RequestFeed`
  (card grid with urgency/status badges).
- **`ui/`:** `Card`, `ErrorMessage`, `InputField`, `LoadingButton`, `PasswordField` (with strength meter),
  `SelectField`, `SuccessMessage`, and `authStyles.js` (shared typography classes).

## Hooks

- `hooks/useAuth.js` — `useContext(AuthContext)` wrapper that throws if used outside `AuthProvider`.
  Exposes `{ currentUser, isAuthenticated, loading, loadCurrentUser, login, logout, register }`.
- `BloodRequestForm` uses `react-hook-form`'s `useForm` for field registration, validation, and submit
  handling.

## Context / API Layer

### `context/AuthContext.jsx`

Provides the auth state and actions:

- On mount, reads any stored token; if present, hydrates `currentUser` from `localStorage` then refreshes
  it via `GET /donor/profile`. Registers an unauthorized handler with the Axios instance so a `401`
  triggers `logout()`.
- `login({ email, password })` — calls `/auth/login`, stores token + user, then re-fetches the profile.
- `register(payload)` — calls `/auth/register`.
- `logout({ redirect })` — clears the session and (by default) navigates to `/login`.

### `config/axios.js`

A single Axios instance with:

- **Request interceptor** — attaches `Authorization: Bearer <token>` from `getAuthToken()`.
- **Response interceptor** — on `401` for non-auth requests, clears the session and invokes the registered
  unauthorized handler (or hard-redirects to `/login`).
- `setUnauthorizedHandler(fn)` — lets `AuthContext` hook into the interceptor.

### `services/*.js`

Thin wrappers over Axios that unwrap `response.data.data`, translate blood-group/gender values, normalize
payloads, and convert Axios errors into friendly messages (`getApiErrorMessage`). Modules: `authService`,
`dashboardService`, `profileService`, `requestService`, and `donorService` (**stub only** — its functions
are empty `TODO`s). See [`API.md`](./API.md) for the endpoint mapping.

## State Management

There is no external state-management library. State is handled by:

1. **React Context** (`AuthContext`) for authentication — the only global state.
2. **Local component state** (`useState` + `useEffect`) for page-level server data and UI state.
3. **`localStorage`** (`utils/authStorage.js`, keys `bloodbridge-auth-token` and `bloodbridge-auth-user`)
   for session persistence across reloads.

## UI Libraries Used

- **Tailwind CSS** — utility-first styling (see below).
- **Framer Motion** — page transitions, dropdown/menu animations, entrance animations.
- **lucide-react** and **react-icons** — icon sets.
- **react-hot-toast** — global toast notifications (`utils/toast.js`).
- **recharts** — dashboard charts (pie + bar).
- **react-countup** + **react-intersection-observer** — animated stat counters.
- **react-hook-form** — the blood-request form.

## Styling System

- **Tailwind config** (`tailwind.config.js`) defines the brand palette (`primary #B71C1C`,
  `secondary #E53935`, `accent`, `surface`, `text`), custom fonts (`Poppins` / `Outfit`), custom shadows
  (`glow`, `soft`), gradient backgrounds (`hero-fade`, `mesh`), and keyframe animations (`float`, `wave`,
  `shake`, `shimmer`, `pop`).
- **PostCSS** (`postcss.config.js`) runs `tailwindcss` + `autoprefixer`.
- **Global CSS** (`styles/index.css`) imports Google Fonts, pulls in Tailwind's `base`/`components`/
  `utilities`, sets base `body` styles, and defines a few helper classes (e.g. autofill fix,
  `.auth-date-input`).
- Content scanning is configured for `./index.html` and `./src/**/*.{js,jsx,ts,tsx}`.
