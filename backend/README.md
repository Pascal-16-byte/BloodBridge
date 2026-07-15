# BloodBridge Backend

Spring Boot 3 backend for BloodBridge, using Java 21, Maven, MySQL, Spring Security 6, JWT, JPA/Hibernate, Lombok, and Bean Validation.

## Project Structure

```text
backend/
  pom.xml
  src/main/resources/application.properties
  src/main/java/com/bloodbridge/
    BloodBridgeApplication.java
    config/SecurityConfig.java
    constants/{BloodGroup,Gender,Role}.java
    controller/{AuthController,DonorController,AdminController}.java
    dto/request/{RegisterRequest,LoginRequest}.java
    dto/response/{ApiResponse,LoginResponse,UserResponse}.java
    entity/User.java
    exception/{DuplicateEmailException,ResourceNotFoundException,GlobalExceptionHandler}.java
    jwt/{JwtService,JwtAuthenticationFilter,JwtAuthenticationEntryPoint}.java
    mapper/UserMapper.java
    repository/UserRepository.java
    security/ApplicationUserDetailsService.java
    service/{AuthService,UserService}.java
    service/impl/{AuthServiceImpl,UserServiceImpl}.java
    util/SecurityUtils.java
```

## Configuration

Default local API base URL: `http://localhost:8080/api`

Set these environment variables for non-local use:

```text
DB_URL=jdbc:mysql://localhost:3306/bloodbridge?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=root
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-bytes
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
DDL_AUTO=update
SHOW_SQL=true
```

Run:

```bash
mvn spring-boot:run
```

## API Response Format

Success:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}
```

## Endpoints

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register a donor |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/donor/profile` | DONOR | Current donor profile |
| GET | `/api/admin/users` | ADMIN | List all users |

## Request Examples

Register:

```json
{
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
}
```

Login:

```json
{
  "email": "asha@example.com",
  "password": "StrongPass123"
}
```

Protected requests:

```text
Authorization: Bearer <token>
```

## Database Schema

`users`

| Column | Type | Notes |
| --- | --- | --- |
| id | BIGINT | Primary key, auto-increment |
| full_name | VARCHAR(120) | Required |
| email | VARCHAR(160) | Required, unique |
| password | VARCHAR(255) | BCrypt hash, never returned |
| phone_number | VARCHAR(20) | Required |
| blood_group | ENUM/VARCHAR(20) | Required |
| gender | ENUM/VARCHAR(20) | Required |
| date_of_birth | DATE | Required |
| city | VARCHAR(80) | Required |
| state | VARCHAR(80) | Required |
| address | VARCHAR(255) | Required |
| last_donation_date | DATE | Optional |
| available | BIT/BOOLEAN | Required |
| role | ENUM/VARCHAR(20) | `DONOR` or `ADMIN` |
| created_at | DATETIME | Audited |
| updated_at | DATETIME | Audited |

## Postman Testing Sequence

1. Start MySQL and run the app with `mvn spring-boot:run`.
2. `POST /api/auth/register` with the register JSON above. Confirm password is stored as a BCrypt hash.
3. `POST /api/auth/login` with email and password. Copy `data.token`.
4. `GET /api/donor/profile` with `Authorization: Bearer <token>`.
5. Confirm `/api/admin/users` rejects the donor token with 403.
6. Promote a user for admin testing:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'asha@example.com';
```

7. Login again and call `GET /api/admin/users` with the new token.

## Frontend Integration

The frontend uses `VITE_API_BASE_URL || http://localhost:8080/api`, so calls should use paths like `/auth/login` and `/auth/register`.

Map responses as:

```text
register: response.data.data -> UserResponse
login: response.data.data.token -> JWT
login: response.data.data.user -> UserResponse
```

Store the token client-side according to your frontend security strategy and attach it as `Authorization: Bearer <token>` for protected endpoints.

## Future Improvements

- Add refresh tokens and token revocation.
- Add admin user management endpoints instead of manual role promotion.
- Add donor search and emergency blood request modules.
- Add database migrations with Flyway or Liquibase.
- Add integration tests with Testcontainers MySQL.
- Add audit logging for admin actions.
