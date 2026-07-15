# BloodBridge

**BloodBridge** is a full-stack blood donation and emergency blood-request platform. It lets people
register as donors, maintain a detailed donor profile, create and manage emergency blood requests, and
browse a live, public feed of active requests.

It consists of a **Spring Boot 3 (Java 21) REST API** and a **React 19 + Vite** single-page application.

> **Repository note:** the frontend lives in a directory spelled **`frontned/`** (not `frontend/`). All
> paths in this documentation use the real name.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend | Java 21, Spring Boot 3.3.5, Spring Security, Spring Data JPA, Bean Validation, JWT (jjwt 0.12.6), Lombok |
| Database | MySQL 8 (schema managed by Hibernate `ddl-auto`) |
| Frontend | React 19, Vite 7, React Router 7, Axios, Tailwind CSS, Framer Motion, react-hook-form, Recharts, react-hot-toast |
| Container | Docker (backend only) |

See [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md) for full details.

## Repository Structure

```text
BloodBridge/
├── backend/      # Spring Boot REST API (com.bloodbridge)
├── frontned/     # React + Vite SPA
├── docs/         # Full project documentation
├── backend.zip   # Archived copy of the backend (source lives in backend/)
├── frontned.zip  # Archived copy of the frontend (source lives in frontned/)
└── .gitignore
```

## Quick Start

Prerequisites: **JDK 21**, **Maven**, **Node.js 18+**, **npm**, and **MySQL 8**.

```bash
git clone https://github.com/Pascal-16-byte/BloodBridge.git
cd BloodBridge
```

**1. Backend** (`http://localhost:8080`, base path `/api`):

```bash
cd backend
# Override the development defaults (recommended):
export DB_USERNAME=root DB_PASSWORD=your-mysql-password
export JWT_SECRET="a-long-random-secret-at-least-32-bytes"
mvn spring-boot:run
```

The database `bloodbridge` is created automatically on first run.

**2. Frontend** (`http://localhost:5173`):

```bash
cd frontned
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in `frontned/.env` if your API isn't at the default `http://localhost:8080/api`.

Full instructions (Docker, production, env vars) are in [`docs/SETUP.md`](docs/SETUP.md).

## Key Features

- **User registration & JWT login** (every user is assigned the `DONOR` role).
- **Donor profile management** with an automatically computed completion percentage.
- **Blood request management** — create, list, view, edit, and delete your own requests (with ownership
  enforcement).
- **Public active-request feed** — sortable by recency/urgency and filterable by city.
- **Personal dashboard** — profile completion, donation eligibility (90-day rule), and request counts.
- **Admin endpoint** to list all users (role `ADMIN`).

Some UI features are **previews or placeholders** (Find Donors, "Become a Donor" quick form, forgot
password, Google sign-in, notifications, donation totals). These are clearly marked in
[`docs/FEATURES.md`](docs/FEATURES.md) — nothing is presented as working that isn't.

## Documentation

| Document | Contents |
| --- | --- |
| [PROJECT_OVERVIEW](docs/PROJECT_OVERVIEW.md) | Purpose, problem/solution, features, users, stack |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | High-level, frontend, backend, DB, auth, deployment (Mermaid) |
| [BACKEND](docs/BACKEND.md) | Controllers, services, repositories, entities, DTOs, security, exceptions |
| [FRONTEND](docs/FRONTEND.md) | React architecture, routing, components, pages, hooks, styling |
| [API](docs/API.md) | Every endpoint: method, body, params, responses, examples, errors |
| [DATABASE](docs/DATABASE.md) | ER diagram, tables, relationships, keys, constraints |
| [AUTHENTICATION](docs/AUTHENTICATION.md) | Login/registration flows, JWT, roles, protected routes |
| [FEATURES](docs/FEATURES.md) | Per-feature status (implemented / preview / placeholder) |
| [SETUP](docs/SETUP.md) | Prerequisites, install, run, deploy |
| [CONFIGURATION](docs/CONFIGURATION.md) | `application.properties`, `pom.xml`, `package.json`, Vite, deps |
| [SECURITY](docs/SECURITY.md) | JWT, BCrypt, validation, CORS, CSRF, caveats |
| [PERFORMANCE](docs/PERFORMANCE.md) | Implemented optimizations and gaps |
| [TROUBLESHOOTING](docs/TROUBLESHOOTING.md) | Common setup/runtime issues and fixes |
| [CONTRIBUTING](docs/CONTRIBUTING.md) | Coding standards, workflow, checklist |
| [FUTURE_IMPROVEMENTS](docs/FUTURE_IMPROVEMENTS.md) | Realistic, code-grounded enhancements |

## Security Note

`backend/src/main/resources/application.properties` ships with a **default database password and JWT
secret** for local development. **Override `DB_PASSWORD` and `JWT_SECRET` via environment variables** (and
rotate them) before deploying anywhere shared. See [`docs/SECURITY.md`](docs/SECURITY.md).

## License

No `LICENSE` file is currently present in the repository, so the project has **no explicit open-source
license**. By default this means all rights are reserved and reuse/distribution terms are undefined. If you
intend this to be open source, add a `LICENSE` file (e.g. MIT, Apache-2.0) — see
[`docs/FUTURE_IMPROVEMENTS.md`](docs/FUTURE_IMPROVEMENTS.md).
