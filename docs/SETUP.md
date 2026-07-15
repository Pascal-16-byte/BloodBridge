# Environment Setup

This guide covers running BloodBridge locally and building it for production. The repository has two apps:
`backend/` (Spring Boot) and `frontned/` (React + Vite).

## Prerequisites

| Tool | Version | Used by |
| --- | --- | --- |
| Java (JDK) | 21 | Backend (`java.version` in `pom.xml`) |
| Maven | 3.9+ (or the bundled `mvnw` wrapper if present) | Backend build |
| Node.js | 18+ recommended (Vite 7 requires a modern Node) | Frontend |
| npm | 9+ | Frontend |
| MySQL | 8.x | Database |
| Docker (optional) | latest | Containerized backend |

## Get the Code

```bash
git clone https://github.com/Pascal-16-byte/BloodBridge.git
cd BloodBridge
```

## Database Setup

The backend's JDBC URL includes `createDatabaseIfNotExist=true`, so it will create the `bloodbridge`
schema automatically on first run — you only need a running MySQL server and valid credentials.

If you prefer to create it manually:

```sql
CREATE DATABASE bloodbridge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Tables are created/updated automatically by Hibernate (`ddl-auto=update`). There are no migration scripts.

## Backend Setup

1. **Configure credentials.** The defaults in `application.properties` (username `root`, a committed
   password, and a committed JWT secret) are for local development only. Override them with environment
   variables (recommended):

   ```bash
   export DB_URL="jdbc:mysql://localhost:3306/bloodbridge?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
   export DB_USERNAME="root"
   export DB_PASSWORD="your-mysql-password"
   export JWT_SECRET="a-long-random-secret-at-least-32-bytes"
   export JWT_EXPIRATION_MS="86400000"
   export CORS_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
   ```

2. **Run the API:**

   ```bash
   cd backend
   mvn spring-boot:run
   # or: mvn clean package && java -jar target/*.jar
   ```

   The API starts on `http://localhost:8080` (base path `/api`).

3. **Smoke test:**

   ```bash
   curl http://localhost:8080/api/requests/feed   # public endpoint, should return an ApiResponse
   ```

### Backend with Docker

`backend/Dockerfile` is a multi-stage build (Maven → Temurin JRE):

```bash
cd backend
docker build -t bloodbridge-backend .
docker run --rm -p 8080:8080 \
  -e DB_URL="jdbc:mysql://host.docker.internal:3306/bloodbridge?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC" \
  -e DB_USERNAME="root" -e DB_PASSWORD="your-mysql-password" \
  -e JWT_SECRET="a-long-random-secret" \
  -e CORS_ALLOWED_ORIGINS="http://localhost:5173" \
  bloodbridge-backend
```

## Frontend Setup

```bash
cd frontned
npm install
npm run dev        # Vite dev server (default http://localhost:5173)
```

To point the frontend at a non-default API, create `frontned/.env` (or `.env.local`):

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

The default (when unset) is `http://localhost:8080/api` (`config/environment.js`). Make sure the API's
`CORS_ALLOWED_ORIGINS` includes your frontend origin (the defaults already include `http://localhost:5173`
and `http://localhost:3000`).

Available npm scripts (`frontned/package.json`):

| Script | Command | Purpose |
| --- | --- | --- |
| `npm run dev` | `vite` | Dev server with HMR |
| `npm run build` | `vite build` | Production build to `dist/` |
| `npm run preview` | `vite preview` | Preview the production build locally |

> There are **no `lint` or `test` scripts** defined in the frontend `package.json`.

## Running Locally (end to end)

1. Start MySQL.
2. Start the backend (`mvn spring-boot:run`) → `http://localhost:8080`.
3. Start the frontend (`npm run dev`) → `http://localhost:5173`.
4. Register a user, log in, complete a donor profile, and create a blood request. To see a request in the
   public feed, edit it and set its status to `ACTIVE` (new requests start as `PENDING`).

## Production Deployment

- **Backend:** build the JAR (or Docker image) and run it with production environment variables. Set
  `DDL_AUTO=validate` and `SHOW_SQL=false`, and provide a strong `JWT_SECRET` and real DB credentials.
  Restrict `CORS_ALLOWED_ORIGINS` to your deployed frontend origin(s).
- **Frontend:** `npm run build` produces a static `dist/` bundle deployable to any static host / CDN
  (Netlify, Vercel, S3+CloudFront, Nginx, etc.). Set `VITE_API_BASE_URL` to the deployed API URL at build
  time.
- **Database:** use a managed MySQL instance; consider introducing schema migrations before production (see
  [`FUTURE_IMPROVEMENTS.md`](./FUTURE_IMPROVEMENTS.md)).

> The repository does **not** include a frontend Dockerfile, CI/CD workflows, or infrastructure-as-code.

See [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) for common setup problems and
[`CONFIGURATION.md`](./CONFIGURATION.md) for every configuration knob.
