# API Documentation

Base URL (local): `http://localhost:8080/api`

All endpoints are mounted under `/api`. Every response uses the standard `ApiResponse<T>` envelope:

```jsonc
// success
{ "success": true,  "message": "…", "data": { /* T */ } }
// error
{ "success": false, "message": "…", "errors": { /* field map or detail, may be null */ } }
```

Authenticated endpoints require an `Authorization: Bearer <JWT>` header. Access levels come from
`SecurityConfig` (see [`BACKEND.md`](./BACKEND.md#security-configuration)):

| Level | Meaning |
| --- | --- |
| **Public** | No token required |
| **Authenticated** | Any valid JWT |
| **DONOR** | User with `ROLE_DONOR` (the default role for all registered users) |
| **ADMIN** | User with `ROLE_ADMIN` |

### Enum value reference

- `bloodGroup`: `A_POSITIVE`, `A_NEGATIVE`, `B_POSITIVE`, `B_NEGATIVE`, `AB_POSITIVE`, `AB_NEGATIVE`,
  `O_POSITIVE`, `O_NEGATIVE`
- `gender`: `MALE`, `FEMALE`, `OTHER`
- `urgency`: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- `status` (`RequestStatus`): `PENDING`, `ACTIVE`, `FULFILLED`, `CANCELLED`
- `role`: `DONOR`, `ADMIN`

### Endpoint summary

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register a new user (role forced to `DONOR`) |
| POST | `/api/auth/login` | Public | Authenticate, receive JWT |
| GET | `/api/donor/profile` | DONOR | Current user's account record |
| GET | `/api/admin/users` | ADMIN | List all users |
| GET | `/api/dashboard` | Authenticated | Dashboard summary |
| GET | `/api/profile` | Authenticated | Current user's donor profile |
| POST | `/api/profile` | Authenticated | Create the donor profile |
| PUT | `/api/profile` | Authenticated | Update the donor profile |
| POST | `/api/requests` | Authenticated | Create a blood request |
| GET | `/api/requests` | Authenticated | List the caller's own requests |
| GET | `/api/requests/feed` | Public | Active-request feed (sort, city) |
| GET | `/api/requests/active` | Public | Alias of `/feed` |
| GET | `/api/requests/{id}` | Authenticated | Get one of the caller's own requests |
| PUT | `/api/requests/{id}` | Authenticated | Update one of the caller's own requests |
| DELETE | `/api/requests/{id}` | Authenticated | Delete one of the caller's own requests |

### Common error responses

| Status | When | Body |
| --- | --- | --- |
| 400 | Bean-validation failure | `{ "success": false, "message": "Validation failed", "errors": { "field": "message" } }` |
| 401 | Missing/invalid/expired token | `{ "success": false, "message": "Unauthorized request" \| "Invalid or expired JWT token", "errors": null }` |
| 401 | Bad login credentials | `{ "success": false, "message": "Invalid email or password", "errors": null }` |
| 403 | Authenticated but wrong role | Spring Security default 403 |
| 404 | Resource not found / not owned | `{ "success": false, "message": "…was not found", "errors": null }` |
| 409 | Duplicate email / existing profile | `{ "success": false, "message": "…", "errors": null }` |
| 500 | Unexpected error | `{ "success": false, "message": "An unexpected error occurred", "errors": "<detail>" }` |

---

## Auth

### `POST /api/auth/register`

- **Description:** Register a new user. The server normalizes the email to lowercase, BCrypt-hashes the
  password, and always assigns `role = DONOR`.
- **Access:** Public
- **Request body** (`RegisterRequest`):

| Field | Type | Rules |
| --- | --- | --- |
| `fullName` | string | required, 2–120 |
| `email` | string | required, valid email, ≤160 |
| `password` | string | required, 8–72 |
| `phoneNumber` | string | required, `^[0-9+\-\s]{8,20}$` |
| `bloodGroup` | enum | required |
| `gender` | enum | required |
| `dateOfBirth` | date (`YYYY-MM-DD`) | required, must be in the past |
| `city` | string | required, ≤80 |
| `state` | string | required, ≤80 |
| `address` | string | required, ≤255 |
| `lastDonationDate` | date | optional, past-or-present |
| `available` | boolean | required |

- **Example request:**

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Asha Verma",
    "email": "asha@example.com",
    "password": "StrongPass123",
    "phoneNumber": "+919876543210",
    "bloodGroup": "O_POSITIVE",
    "gender": "FEMALE",
    "dateOfBirth": "1997-04-21",
    "city": "Mumbai",
    "state": "Maharashtra",
    "address": "Andheri West",
    "lastDonationDate": "2026-01-15",
    "available": true
  }'
```

- **Success `201 Created`** (`ApiResponse<UserResponse>`):

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": 1, "fullName": "Asha Verma", "email": "asha@example.com",
    "phoneNumber": "+919876543210", "bloodGroup": "O_POSITIVE", "gender": "FEMALE",
    "dateOfBirth": "1997-04-21", "city": "Mumbai", "state": "Maharashtra",
    "address": "Andheri West", "lastDonationDate": "2026-01-15",
    "available": true, "role": "DONOR",
    "createdAt": "2026-07-15T10:00:00", "updatedAt": "2026-07-15T10:00:00"
  }
}
```

- **Errors:** `400` validation; `409` `"Email is already registered"`.

### `POST /api/auth/login`

- **Description:** Authenticate and receive a JWT.
- **Access:** Public
- **Request body** (`LoginRequest`): `{ "email": string, "password": string }` (both required, email valid).
- **Example request:**

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "asha@example.com", "password": "StrongPass123" }'
```

- **Success `200 OK`** (`ApiResponse<LoginResponse>`):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "user": { "id": 1, "fullName": "Asha Verma", "email": "asha@example.com", "role": "DONOR" }
  }
}
```

- **Errors:** `400` validation; `401` `"Invalid email or password"`.

---

## Donor (account)

### `GET /api/donor/profile`

- **Description:** Returns the authenticated user's **account** record (a `UserResponse`, not the donor
  profile). Used by the frontend to hydrate the current user.
- **Access:** DONOR
- **Query/body:** none.
- **Example:**

```bash
curl http://localhost:8080/api/donor/profile -H "Authorization: Bearer $TOKEN"
```

- **Success `200`:** `ApiResponse<UserResponse>` with message `"Profile fetched successfully"`.
- **Errors:** `401` no/invalid token; `403` non-DONOR token.

---

## Admin

### `GET /api/admin/users`

- **Description:** Lists all users.
- **Access:** ADMIN
- **Success `200`:** `ApiResponse<List<UserResponse>>`, message `"Users fetched successfully"`.
- **Errors:** `401`; `403` for non-admin tokens (e.g. a `DONOR`).

> There is no API to promote users to `ADMIN`; it is done manually in the database
> (see [`AUTHENTICATION.md`](./AUTHENTICATION.md)).

---

## Dashboard

### `GET /api/dashboard`

- **Description:** Aggregated dashboard summary for the authenticated user.
- **Access:** Authenticated
- **Success `200`** (`ApiResponse<DashboardResponse>`):

```json
{
  "success": true,
  "message": "Dashboard fetched successfully",
  "data": {
    "userName": "Asha Verma",
    "bloodGroup": "O_POSITIVE",
    "profileCompletion": 100,
    "donationEligibility": true,
    "lastDonationDate": "2026-01-15",
    "emergencyAvailability": true,
    "totalDonations": 0,
    "activeRequestsCount": 2,
    "pendingRequestsCount": 1
  }
}
```

- Notes: `totalDonations` is always `0` (no donation history model). `profileCompletion` and
  `emergencyAvailability` fall back to account-level data when no donor profile exists.

---

## Donor Profile

The donor profile is separate from the account. One profile per user.

### `GET /api/profile`

- **Access:** Authenticated
- **Success `200`:** `ApiResponse<DonorProfileResponse>`.
- **Errors:** `404` `"Donor profile was not found"` if the user hasn't created one yet.

### `POST /api/profile`

- **Description:** Create the authenticated user's donor profile.
- **Access:** Authenticated
- **Request body** (`DonorProfileRequest`):

| Field | Type | Rules |
| --- | --- | --- |
| `bloodGroup` | enum | required |
| `age` | int | required, 18–65 |
| `gender` | enum | required |
| `weight` | number | required, ≥45.0 |
| `lastDonationDate` | date | optional, past-or-present |
| `medicalConditions` | string | optional, ≤500 |
| `emergencyAvailable` | boolean | required |
| `preferredDonationDistance` | int | required, 1–250 |
| `city` | string | required, ≤80 |
| `district` | string | required, ≤80 |
| `state` | string | required, ≤80 |
| `pincode` | string | required, `^[0-9]{5,10}$` |

- **Example:**

```bash
curl -X POST http://localhost:8080/api/profile \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{ "bloodGroup":"O_POSITIVE","age":29,"gender":"FEMALE","weight":58.5,
        "emergencyAvailable":true,"preferredDonationDistance":25,
        "city":"Mumbai","district":"Mumbai Suburban","state":"Maharashtra","pincode":"400053" }'
```

- **Success `201`** (`ApiResponse<DonorProfileResponse>`): includes computed `profileCompleted` and
  `completionPercentage`.
- **Errors:** `400` validation; `409` `"Donor profile already exists"`.

### `PUT /api/profile`

- **Description:** Update the existing donor profile (same body as `POST`).
- **Access:** Authenticated
- **Success `200`:** `ApiResponse<DonorProfileResponse>`.
- **Errors:** `400` validation; `404` if no profile exists.

---

## Blood Requests

### `POST /api/requests`

- **Description:** Create a blood request owned by the authenticated user. New requests are always created
  with `status = PENDING` (the server ignores any status supplied on create).
- **Access:** Authenticated
- **Request body** (`BloodRequestRequest`):

| Field | Type | Rules |
| --- | --- | --- |
| `patientName` | string | required, ≤120 |
| `bloodGroup` | enum | required |
| `unitsRequired` | int | required, 1–20 |
| `hospitalName` | string | required, ≤160 |
| `hospitalAddress` | string | required, ≤255 |
| `city` | string | required, ≤80 |
| `district` | string | required, ≤80 |
| `state` | string | required, ≤80 |
| `contactPerson` | string | required, ≤120 |
| `contactNumber` | string | required, `^[0-9+\-\s]{8,20}$` |
| `urgency` | enum | required |
| `requiredBefore` | datetime (`YYYY-MM-DDTHH:mm:ss`) | required, must be in the future |
| `notes` | string | optional, ≤500 |
| `status` | enum | optional (honored only on update) |

- **Example:**

```bash
curl -X POST http://localhost:8080/api/requests \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{ "patientName":"Ravi Kumar","bloodGroup":"A_POSITIVE","unitsRequired":2,
        "hospitalName":"City Hospital","hospitalAddress":"MG Road",
        "city":"Pune","district":"Pune","state":"Maharashtra",
        "contactPerson":"Sita","contactNumber":"+919812345678",
        "urgency":"CRITICAL","requiredBefore":"2026-08-01T10:00:00","notes":"Surgery" }'
```

- **Success `201`** (`ApiResponse<BloodRequestResponse>`), message `"Blood request created successfully"`:

```json
{
  "success": true,
  "message": "Blood request created successfully",
  "data": {
    "id": 10, "createdById": 1, "createdByName": "Asha Verma",
    "patientName": "Ravi Kumar", "bloodGroup": "A_POSITIVE", "unitsRequired": 2,
    "hospitalName": "City Hospital", "hospitalAddress": "MG Road",
    "city": "Pune", "district": "Pune", "state": "Maharashtra",
    "contactPerson": "Sita", "contactNumber": "+919812345678",
    "urgency": "CRITICAL", "requiredBefore": "2026-08-01T10:00:00",
    "notes": "Surgery", "status": "PENDING", "createdAt": "2026-07-15T10:05:00"
  }
}
```

- **Errors:** `400` validation (e.g. `requiredBefore` not in future).

### `GET /api/requests`

- **Description:** List the authenticated user's own requests, newest first.
- **Access:** Authenticated
- **Success `200`:** `ApiResponse<List<BloodRequestResponse>>`.

### `GET /api/requests/feed` and `GET /api/requests/active`

- **Description:** Public feed of **ACTIVE** requests. The two paths are identical (both call
  `getActiveFeed`).
- **Access:** Public
- **Query parameters:**

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| `sort` | string | `latest` | `latest` (createdAt desc) or `urgency` (CRITICAL→LOW, then recency) |
| `city` | string | — | Optional case-insensitive exact city filter |

- **Example:**

```bash
curl "http://localhost:8080/api/requests/feed?sort=urgency&city=Pune"
```

- **Success `200`:** `ApiResponse<List<BloodRequestResponse>>`, message `"Active request feed fetched
  successfully"` (for `/feed`) or `"Active requests fetched successfully"` (for `/active`).

> Only requests whose status is `ACTIVE` appear in the feed. Newly created requests are `PENDING`, so they
> do **not** appear until their status is changed to `ACTIVE` (e.g. via `PUT /api/requests/{id}`).

### `GET /api/requests/{id}`

- **Description:** Fetch a single request **owned by the caller**.
- **Access:** Authenticated (owner only)
- **Success `200`:** `ApiResponse<BloodRequestResponse>`.
- **Errors:** `404` `"Blood request was not found"` if it doesn't exist or isn't owned by the caller.

### `PUT /api/requests/{id}`

- **Description:** Update an owned request. Full body (`BloodRequestRequest`); if `status` is supplied it is
  applied (this is how a request becomes `ACTIVE`, `FULFILLED`, etc.).
- **Access:** Authenticated (owner only)
- **Success `200`:** `ApiResponse<BloodRequestResponse>`.
- **Errors:** `400` validation; `404` if not owned/found.

### `DELETE /api/requests/{id}`

- **Description:** Delete an owned request.
- **Access:** Authenticated (owner only)
- **Success `200`** (`ApiResponse<Void>`): `{ "success": true, "message": "Blood request deleted successfully" }`.
- **Errors:** `404` if not owned/found.

---

## Endpoints referenced by the frontend but NOT implemented

`frontned/src/constants/apiEndpoints.js` lists some paths that have **no backend implementation** and are
not used by the active service modules:

- `/auth/forgot-password` — no controller; `authService.requestPasswordReset()` throws locally.
- `/donors` (list/register) — no controller; `donorService` functions are empty stubs.
- `/dashboard/summary` — the real dashboard endpoint is `/dashboard` (the app uses that one).

These are documented here only so integrators don't mistake them for live endpoints.
