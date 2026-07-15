# Configuration Documentation

This document explains every configuration file and dependency in the repository.

## Backend: `application.properties`

Location: `backend/src/main/resources/application.properties`. Every externally-relevant value uses the
`${ENV_VAR:default}` syntax so it can be overridden by environment variables.

```properties
spring.application.name=BloodBridge
server.port=8080

spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/bloodbridge?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:OhYesAbhi#16}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=${DDL_AUTO:update}
spring.jpa.show-sql=${SHOW_SQL:true}
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false

application.security.jwt.secret=${JWT_SECRET:BloodBridgeJwtSecretKeyForLocalDevelopmentOnlyChangeThisImmediately12345}
application.security.jwt.expiration-ms=${JWT_EXPIRATION_MS:86400000}

application.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:3000}
```

| Property | Env var | Default | Notes |
| --- | --- | --- | --- |
| `server.port` | — | `8080` | HTTP port |
| `spring.datasource.url` | `DB_URL` | local MySQL, auto-create DB | JDBC URL |
| `spring.datasource.username` | `DB_USERNAME` | `root` | DB user |
| `spring.datasource.password` | `DB_PASSWORD` | ⚠️ committed value | **Override in every real environment** |
| `spring.jpa.hibernate.ddl-auto` | `DDL_AUTO` | `update` | Use `validate` in production |
| `spring.jpa.show-sql` | `SHOW_SQL` | `true` | Set `false` in production |
| `spring.jpa.open-in-view` | — | `false` | Prevents lazy-loading outside transactions |
| `application.security.jwt.secret` | `JWT_SECRET` | ⚠️ committed value | HMAC key (Base64 or raw UTF-8); **override** |
| `application.security.jwt.expiration-ms` | `JWT_EXPIRATION_MS` | `86400000` (24h) | Token lifetime |
| `application.cors.allowed-origins` | `CORS_ALLOWED_ORIGINS` | `localhost:5173,localhost:3000` | Comma-separated allow-list |

> ⚠️ **Security:** `application.properties` contains a default database password (`OhYesAbhi#16`) and a
> default JWT secret checked into version control. These are development conveniences only — always override
> `DB_PASSWORD` and `JWT_SECRET` via environment variables in shared/production environments, and consider
> rotating them. See [`SECURITY.md`](./SECURITY.md).

## Backend: `pom.xml`

- **Parent:** `spring-boot-starter-parent:3.3.5` (manages dependency versions and plugin config).
- **Coordinates:** `com.bloodbridge:bloodbridge-backend:0.0.1-SNAPSHOT`.
- **Properties:** `java.version=21`, `jjwt.version=0.12.6`.
- **Build plugins:**
  - `maven-compiler-plugin` with `<proc>full</proc>` and Lombok as an annotation-processor path.
  - `spring-boot-maven-plugin` (repackages the fat JAR; excludes Lombok from the runtime artifact).

### Dependencies

| Dependency | Scope | Why it's used |
| --- | --- | --- |
| `spring-boot-starter-web` | compile | REST controllers, embedded Tomcat, Jackson JSON |
| `spring-boot-starter-security` | compile | Authentication/authorization, `SecurityFilterChain`, BCrypt |
| `spring-boot-starter-data-jpa` | compile | Hibernate ORM + Spring Data repositories |
| `spring-boot-starter-validation` | compile | Jakarta Bean Validation (`@Valid`, constraint annotations) |
| `mysql-connector-j` | runtime | MySQL JDBC driver |
| `jjwt-api` / `jjwt-impl` / `jjwt-jackson` | compile / runtime | Create, sign, parse, and validate JWTs |
| `lombok` | provided (optional) | Boilerplate reduction (`@Getter`, `@Builder`, `@RequiredArgsConstructor`) |
| `spring-boot-devtools` | runtime (optional) | Hot reload during development |
| `spring-boot-starter-test` | test | JUnit 5, Mockito, Spring test support |
| `spring-security-test` | test | Security-aware test utilities |

> There are currently no test classes committed under `backend/src/test`, but the test dependencies are
> present for future use.

## Frontend: `package.json`

- `"type": "module"` — ES modules.
- **Scripts:** `dev` (`vite`), `build` (`vite build`), `preview` (`vite preview`). No `lint`/`test`.

### Dependencies

| Package | Why it's used |
| --- | --- |
| `react`, `react-dom` (^19.1.1) | Core UI library |
| `react-router-dom` (^7.7.1) | Client-side routing (`useRoutes`, `Outlet`, `Navigate`) |
| `axios` (^1.11.0) | HTTP client with interceptors for auth + error handling |
| `framer-motion` (^12.23.12) | Page transitions and micro-animations |
| `react-hook-form` (^7.81.0) | Blood-request form state + validation |
| `react-hot-toast` (^2.5.2) | Global toast notifications |
| `recharts` (^3.9.2) | Dashboard charts |
| `lucide-react` (^1.24.0), `react-icons` (^5.5.0) | Icon sets |
| `react-countup` (^6.5.3) | Animated numeric counters |
| `react-intersection-observer` (^9.16.0) | Trigger animations/counters on scroll into view |

### Dev dependencies

| Package | Why it's used |
| --- | --- |
| `vite` (^7.0.4) | Build tool / dev server |
| `@vitejs/plugin-react` (^5.0.0) | React fast-refresh + JSX support for Vite |
| `tailwindcss` (^3.4.17) | Utility-first CSS framework |
| `postcss` (^8.5.6), `autoprefixer` (^10.4.21) | CSS processing pipeline for Tailwind |
| `@types/react`, `@types/react-dom` | Type definitions (editor/IntelliSense; the app is plain JS/JSX) |

## Frontend: Vite configuration

`frontned/vite.config.js` is intentionally minimal:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

No custom dev-server proxy is configured, so the app talks to the API by absolute URL
(`VITE_API_BASE_URL`, default `http://localhost:8080/api`) and relies on backend CORS.

## Frontend: Tailwind & PostCSS

`frontned/tailwind.config.js`:

- `content`: `['./index.html', './src/**/*.{js,jsx,ts,tsx}']`.
- `theme.extend`: brand colors (`primary #B71C1C`, `secondary #E53935`, `accent`, `surface`, `text`),
  fonts (`display: Outfit`, `sans: Poppins`), shadows (`glow`, `soft`), background images
  (`hero-fade`, `mesh`), and keyframe animations (`float`, `wave`, `shake`, `shimmer`, `pop`).

`frontned/postcss.config.js`:

```js
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

## Frontend: runtime environment config

`frontned/src/config/environment.js`:

```js
export const environment = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  appMode: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
```

The only build-time env var the app reads is `VITE_API_BASE_URL`.

## Build Configuration Summary

| Concern | Backend | Frontend |
| --- | --- | --- |
| Build tool | Maven (`spring-boot-maven-plugin`) | Vite |
| Output | fat JAR in `backend/target/` | static bundle in `frontned/dist/` |
| Container | `backend/Dockerfile` (multi-stage) | none |
| Config source | env vars + `application.properties` | `VITE_*` env vars |
