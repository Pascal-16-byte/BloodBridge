# Backend Documentation

The backend is a Spring Boot 3 (Java 21) REST API located in `backend/`. Root package:
`com.bloodbridge`. Entry point: `BloodBridgeApplication`.

```java
@SpringBootApplication
@EnableJpaAuditing
public class BloodBridgeApplication {
    public static void main(String[] args) {
        SpringApplication.run(BloodBridgeApplication.class, args);
    }
}
```

`@EnableJpaAuditing` powers the `@CreatedDate` / `@LastModifiedDate` fields on the audited entities.

## Package / Folder Structure

```text
backend/src/main/java/com/bloodbridge/
├── BloodBridgeApplication.java        # Spring Boot entry point
├── config/
│   └── SecurityConfig.java            # Security filter chain, CORS, beans
├── constants/                         # Enums used across entities & DTOs
│   ├── BloodGroup.java  Gender.java  Role.java  RequestStatus.java  Urgency.java
├── controller/                        # REST endpoints
│   ├── AuthController.java            # /api/auth
│   ├── DonorController.java           # /api/donor
│   ├── AdminController.java           # /api/admin
│   ├── DashboardController.java       # /api/dashboard
│   ├── BloodRequestController.java    # /api/requests
│   └── DonorProfileController.java    # /api/profile
├── dto/
│   ├── request/                       # Inbound payloads (validated)
│   └── response/                      # Outbound payloads + ApiResponse<T>
├── entity/                            # JPA entities: User, DonorProfile, BloodRequest
├── exception/                         # Custom exceptions + GlobalExceptionHandler
├── jwt/                               # JwtService, filter, entry point
├── mapper/                            # Entity <-> DTO mapping
├── repository/                        # Spring Data JPA repositories
├── security/                          # ApplicationUserDetailsService
├── service/ + service/impl/           # Business logic
└── util/                              # SecurityUtils
```

`src/main/resources/application.properties` holds the configuration (see
[`CONFIGURATION.md`](./CONFIGURATION.md)).

## Spring Boot Architecture

Requests flow through a standard layered architecture:

```text
HTTP → SecurityFilterChain (JWT filter) → Controller → Service (interface + impl)
     → Mapper (entity ⇄ DTO) → Repository (Spring Data JPA) → MySQL
```

- Controllers are thin: they validate input (`@Valid`), call a service, and wrap the result in
  `ApiResponse`.
- Services (`service/impl/*`) contain all business logic and transaction boundaries
  (`@Transactional`).
- Mappers translate between entities and DTOs and perform trimming/normalization.
- Repositories are Spring Data JPA interfaces (no hand-written SQL).
- All uncaught exceptions are translated to JSON by `GlobalExceptionHandler`.

## Controllers

All controllers use constructor injection (`@RequiredArgsConstructor`) and return
`ResponseEntity<ApiResponse<T>>`.

| Controller | Base path | Endpoints |
| --- | --- | --- |
| `AuthController` | `/api/auth` | `POST /register`, `POST /login` |
| `DonorController` | `/api/donor` | `GET /profile` (current user's account) |
| `AdminController` | `/api/admin` | `GET /users` |
| `DashboardController` | `/api/dashboard` | `GET /` |
| `BloodRequestController` | `/api/requests` | `POST /`, `GET /`, `GET /feed`, `GET /active`, `GET /{id}`, `PUT /{id}`, `DELETE /{id}` |
| `DonorProfileController` | `/api/profile` | `GET /`, `POST /`, `PUT /` |

Example — `AuthController`:

```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse userResponse = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful", userResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Login successful", authService.login(request)));
    }
}
```

The `BloodRequestController` exposes both `/feed` and `/active`; both delegate to
`bloodRequestService.getActiveFeed(sort, city)` — they are functionally identical endpoints.

Full per-endpoint request/response detail is in [`API.md`](./API.md).

## Services

Each service is defined as an interface in `service/` and implemented in `service/impl/`.

| Interface | Implementation | Responsibility |
| --- | --- | --- |
| `AuthService` | `AuthServiceImpl` | Register (dedupe email, BCrypt hash, force `DONOR` role), login (authenticate + issue JWT) |
| `UserService` | `UserServiceImpl` | Current user's account, list all users |
| `DonorProfileService` | `DonorProfileServiceImpl` | Get/create/update the authenticated user's donor profile |
| `BloodRequestService` | `BloodRequestServiceImpl` | CRUD for the caller's own requests + public active feed |
| `DashboardService` | `DashboardServiceImpl` | Aggregate dashboard summary |

### Business rules worth noting

- **Registration** (`AuthServiceImpl.register`): normalizes email to lowercase, rejects duplicates with
  `DuplicateEmailException`, BCrypt-hashes the password, and **always sets `Role.DONOR`** (the client
  cannot choose `ADMIN`).
- **Login** (`AuthServiceImpl.login`): runs `authenticationManager.authenticate(...)` before generating
  the token, so bad credentials never yield a token.
- **Ownership enforcement** (`BloodRequestServiceImpl`): read/update/delete use
  `findByIdAndCreatedBy(id, currentUser)`, so users can only touch their own requests; a miss throws
  `ResourceNotFoundException` (404).
- **Feed sorting** (`BloodRequestServiceImpl.getActiveFeed`): only `RequestStatus.ACTIVE` requests are
  returned, sorted by `createdAt DESC`; when `sort=urgency`, results are re-sorted by a numeric urgency
  rank (`CRITICAL=4 … LOW=1`), tie-broken by recency. Optional case-insensitive `city` filter.
- **Donor profile** (`DonorProfileServiceImpl`): one profile per user — `create` throws
  `ConflictException` if a profile already exists.
- **Dashboard eligibility** (`DashboardServiceImpl`): a donor is eligible when `lastDonationDate` is null
  or at least `DONATION_WAIT_DAYS = 90` days in the past. `totalDonations` is currently hard-coded to `0`
  (no donation-history model exists).

Example — `AuthServiceImpl.register`:

```java
@Override
@Transactional
public UserResponse register(RegisterRequest request) {
    String normalizedEmail = request.getEmail().trim().toLowerCase();
    if (userRepository.existsByEmail(normalizedEmail)) {
        throw new DuplicateEmailException("Email is already registered");
    }
    User user = userMapper.toEntity(request);
    user.setEmail(normalizedEmail);
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(Role.DONOR);
    return userMapper.toResponse(userRepository.save(user));
}
```

## Repositories

Spring Data JPA interfaces in `repository/`:

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}

public interface DonorProfileRepository extends JpaRepository<DonorProfile, Long> {
    Optional<DonorProfile> findByUser(User user);
    boolean existsByUser(User user);
}

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByCreatedByOrderByCreatedAtDesc(User createdBy);
    List<BloodRequest> findByStatus(RequestStatus status, Sort sort);
    List<BloodRequest> findByStatusAndCityIgnoreCase(RequestStatus status, String city, Sort sort);
    Optional<BloodRequest> findByIdAndCreatedBy(Long id, User createdBy);
    long countByCreatedByAndStatus(User createdBy, RequestStatus status);
}
```

All queries are derived from method names; no `@Query` or native SQL is used.

## Entities

Three JPA entities in `entity/`. Enums are stored as strings.

### `User` (`users`)

Implements `org.springframework.security.core.userdetails.UserDetails`, so it is used directly as the
security principal. Audited (`@CreatedDate`, `@LastModifiedDate`).

```java
@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
}

@Override
public String getUsername() { return email; }   // username == email
```

Fields: `id`, `fullName`, `email` (unique), `password` (BCrypt), `phoneNumber`, `bloodGroup`, `gender`,
`dateOfBirth`, `city`, `state`, `address`, `lastDonationDate`, `available`, `role`, `createdAt`,
`updatedAt`.

### `DonorProfile` (`donor_profiles`)

`@OneToOne` to `User` with a unique `user_id`. Fields: `id`, `user`, `bloodGroup`, `age`, `gender`,
`weight`, `lastDonationDate`, `medicalConditions`, `emergencyAvailable`, `preferredDonationDistance`,
`city`, `district`, `state`, `pincode`, `profileCompleted`.

### `BloodRequest` (`blood_requests`)

`@ManyToOne` (lazy) to `User` (`created_by_id`). Audited (`@CreatedDate createdAt`). Fields: `id`,
`createdBy`, `patientName`, `bloodGroup`, `unitsRequired`, `hospitalName`, `hospitalAddress`, `city`,
`district`, `state`, `contactPerson`, `contactNumber`, `urgency`, `requiredBefore`, `notes`, `status`,
`createdAt`.

Full column/constraint detail is in [`DATABASE.md`](./DATABASE.md).

## DTOs

### Request DTOs (`dto/request/`)

| DTO | Used by | Key validation |
| --- | --- | --- |
| `RegisterRequest` | `POST /api/auth/register` | `fullName` 2–120, valid `email` ≤160, `password` 8–72, phone regex `^[0-9+\-\s]{8,20}$`, `bloodGroup`/`gender`/`dateOfBirth` (past)/`city`/`state`/`address`/`available` required |
| `LoginRequest` | `POST /api/auth/login` | `email` required+valid, `password` required |
| `DonorProfileRequest` | `POST/PUT /api/profile` | `age` 18–65, `weight` ≥45, `preferredDonationDistance` 1–250, `pincode` `^[0-9]{5,10}$`, `lastDonationDate` past-or-present, etc. |
| `BloodRequestRequest` | `POST/PUT /api/requests` | `unitsRequired` 1–20, `requiredBefore` must be future, `contactNumber` regex, size limits, optional `notes` ≤500, optional `status` |

### Response DTOs (`dto/response/`)

- `ApiResponse<T>` — the universal envelope (see below).
- `UserResponse` — safe view of a `User` (**no password**).
- `LoginResponse` — `{ token, tokenType, user }`.
- `DonorProfileResponse` — donor profile + `profileCompleted` + `completionPercentage`.
- `BloodRequestResponse` — request fields + `createdById`, `createdByName`, `createdAt`.
- `DashboardResponse` — `userName`, `bloodGroup`, `profileCompletion`, `donationEligibility`,
  `lastDonationDate`, `emergencyAvailability`, `totalDonations`, `activeRequestsCount`,
  `pendingRequestsCount`.

### The `ApiResponse<T>` envelope

```java
@Getter @Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private Object errors;
    // success(message, data), success(message), error(message, errors)
}
```

Success:

```json
{ "success": true, "message": "Login successful", "data": { } }
```

Error:

```json
{ "success": false, "message": "Validation failed", "errors": { "email": "Email must be valid" } }
```

## Mappers

Plain `@Component` classes (no MapStruct). They also perform trimming/normalization.

- `UserMapper` — `RegisterRequest → User` (trims, lowercases email) and `User → UserResponse`.
- `DonorProfileMapper` — request ⇄ entity, plus `calculateCompletionPercentage(profile)`: counts 12
  fields and returns `round(completed * 100 / 12)`; sets `profileCompleted = (percentage == 100)`.
- `BloodRequestMapper` — request ⇄ entity; `toEntity` forces new requests to `RequestStatus.PENDING`;
  `updateEntity` only overwrites status when the request supplies one; `toResponse` includes the
  creator's id and name.

## Security Configuration

`config/SecurityConfig` (`@EnableWebSecurity`, `@EnableMethodSecurity`):

```java
http.csrf(csrf -> csrf.disable())
    .cors(cors -> cors.configurationSource(corsConfigurationSource))
    .exceptionHandling(e -> e.authenticationEntryPoint(jwtAuthenticationEntryPoint))
    .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .authorizeHttpRequests(auth -> auth
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .requestMatchers("/api/auth/**").permitAll()
        .requestMatchers(HttpMethod.GET, "/api/requests/feed", "/api/requests/active").permitAll()
        .requestMatchers("/api/admin/**").hasRole("ADMIN")
        .requestMatchers("/api/donor/**").hasRole("DONOR")
        .anyRequest().authenticated())
    .authenticationProvider(authenticationProvider())
    .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
```

Beans provided: `PasswordEncoder` (`BCryptPasswordEncoder`), `AuthenticationProvider`
(`DaoAuthenticationProvider` wired to `UserDetailsService` + encoder), `AuthenticationManager`, and a
`CorsConfigurationSource` built from `application.cors.allowed-origins`.

**Access matrix** (from the rules above):

| Path | Access |
| --- | --- |
| `OPTIONS /**` | Public (CORS preflight) |
| `/api/auth/**` | Public |
| `GET /api/requests/feed`, `GET /api/requests/active` | Public |
| `/api/admin/**` | `ADMIN` role |
| `/api/donor/**` | `DONOR` role |
| everything else (`/api/requests` CRUD, `/api/profile`, `/api/dashboard`) | Any authenticated user |

See [`AUTHENTICATION.md`](./AUTHENTICATION.md) and [`SECURITY.md`](./SECURITY.md) for the JWT internals.

## Exception Handling

`exception/GlobalExceptionHandler` (`@RestControllerAdvice`) maps exceptions to `ApiResponse` errors:

| Exception | HTTP status | Message |
| --- | --- | --- |
| `MethodArgumentNotValidException` | 400 | `"Validation failed"` + field→message map |
| `DuplicateEmailException`, `ConflictException` | 409 | exception message |
| `ResourceNotFoundException`, `EntityNotFoundException` | 404 | exception message |
| `BadCredentialsException` | 401 | `"Invalid email or password"` |
| `AuthenticationException` | 401 | exception message |
| `Exception` (fallback) | 500 | `"An unexpected error occurred"` (+ exception message in `errors`) |

Custom exceptions: `ConflictException`, `DuplicateEmailException`, `ResourceNotFoundException` (all extend
`RuntimeException`).

JWT-layer failures are handled outside the advice: `JwtAuthenticationEntryPoint` returns a `401` JSON body
for unauthenticated access, and `JwtAuthenticationFilter` writes a `401` JSON body directly when a token is
malformed/expired or the user no longer exists.

## Validation

Validation is declarative via Jakarta Bean Validation annotations on the request DTOs, triggered by
`@Valid` on controller parameters. Failures are collected by `GlobalExceptionHandler` into a
field-name → message map. Additional normalization (trimming, lowercasing email, `trimToNull` for optional
text) happens in the mappers/services.

## Configuration Classes & Utilities

- `SecurityConfig` — the only `@Configuration` class (covered above).
- `util/SecurityUtils.getCurrentUsername()` — static helper that reads the authenticated principal's name
  (the email) from `SecurityContextHolder`; throws `IllegalStateException` if unauthenticated. Services use
  it to resolve "the current user".
- `security/ApplicationUserDetailsService` — implements `UserDetailsService.loadUserByUsername`, looking up
  the user by normalized email.
