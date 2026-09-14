# Backend Remediation Plan

**Status:** Living document — update this file after each implementation or verification step.
**Scope:** Laravel backend at `C:\Users\Ferna\Documents\SFA TEMPLATES\BACK FER\LARAVEL_FER`.
**Reference contract:** [`BACKEND_LOGIC.md`](./BACKEND_LOGIC.md).
**Last reviewed:** 2026-09-14

## Objective and delivery order

The objective is to make the Laravel backend reliable, secure, testable, and explicit about its API contract **before** adapting the React template. The React project is a structural template, not a finished product. Its mocks, local CRUD adapter, and incomplete auth state must not drive backend business rules.

Delivery order:

1. Correct confirmed backend defects and close backend security gaps.
2. Verify the backend contract with automated tests and a real local environment.
3. Configure deployment values without copying secrets into source control or frontend code.
4. Adapt the React template to the verified backend contract.

## Current assessment

The backend already contains the main API flows: JWT authentication, password recovery, public products, role-protected catalog management, orders, users, dashboards, resources, Form Requests, repository/service contracts, and standardized error responses. `BACKEND_LOGIC.md` records the current API contract and identifies the React template as `ready_with_blockers`.

### Confirmed backend blocker

- **User update validation uses the wrong route parameter.** `routes/api.php:69` registers `Route::apiResource('usuarios', UserController::class)`, whose update parameter is `{usuario}`. `app/Http/Requests/UserRequest.php:23` reads `$this->route('user')`. The update uniqueness rule therefore does not exclude the current user's ID as intended. This is a backend defect independent of React.

### Confirmed frontend-template incompatibilities, not backend defects

- `src/service/renewTokenService.js` uses `GET`, `/refresh`, and `data.token` / `data.usuario`; Laravel exposes `POST /api/auth/refresh` and returns `authorization.token` (`BACKEND_LOGIC.md:197-205, 229-234`).
- `src/store/useAuthStore.js`, `src/App.jsx`, and the local CRUD example do not implement the real auth and domain flows. They are template gaps, not reasons to change Laravel routes or response names.
- The React template must consume the backend field names (`nombre`, `categoria_id`, `etiquetas_ids`, `items`, `producto_id`, `cantidad`, `estado`) rather than forcing Spanish backend fields into mock-shaped objects.

## Backend changes

Implement these in priority order. Every item remains unchecked until code and its acceptance evidence are complete.

### P0 — Correct the confirmed update-validation defect

- [x] **Change:** Fix the `UserRequest` update uniqueness rule to use the actual `usuarios` route parameter (`usuario`) or an equivalent route-model-safe exclusion.
  - **Priority:** P0 — correctness and data integrity.
  - **Affected files:** `app/Http/Requests/UserRequest.php`, `routes/api.php`; add/update the relevant feature test under `tests/Feature/`.
  - **Reason:** `UserRequest.php:23` references `route('user')`, while `apiResource` creates `{usuario}` at `routes/api.php:69`.
  - **Acceptance:** Updating a user while keeping its own email succeeds; changing to another existing user's email returns the standard `422` `VALIDATION_ERROR`; the test proves both cases.
   - **Evidence (2026-09-14):** `php artisan test --filter=UserApiErrorTest` passed with 8 tests and 31 assertions. The regression coverage proves that a user can retain its own email and that an email used by another user returns HTTP `422` with `VALIDATION_ERROR` and `details.email`.
   - **Status:** `[x]`

### P1 — Add abuse controls to public authentication flows

- [ ] **Change:** Apply explicit, environment-appropriate throttling to `login`, `register`, `forgot-password`, `verify-reset-token`, `reset-password`, and `refresh`, without changing their documented payloads or success responses.
  - **Priority:** P1 — security hardening before exposure.
  - **Affected files:** `routes/api.php`, `app/Providers/AppServiceProvider.php`, `tests/Feature/AuthRateLimitTest.php`.
  - **Reason:** Password reset has Laravel's broker throttle (`config/auth.php:100-106`), but the public auth routes themselves do not show endpoint-level abuse controls in `routes/api.php:16-31`.
  - **Acceptance:** Repeated requests exceed the configured limit with a documented `429` response; normal requests remain unchanged; account-enumeration behavior for `forgot-password` remains the same generic `200` message.
  - **Limits:** `auth-login`: 30/minute per IP plus 5/minute per IP+email; `auth-register`: 10/minute per IP; `auth-forgot-password`: 20/minute per IP plus 5/minute per IP+email; `auth-verify-reset-token`: 30/minute per IP plus 10/minute per IP+email; `auth-reset-password`: 20/minute per IP plus 5/minute per IP+email; `auth-refresh`: 30/minute per IP. `logout` remains limited only by `auth:api`.
  - **Evidence (2026-09-14):** Named limiters are registered with `RateLimiter::for` and applied explicitly through `throttle:<name>` middleware. `php artisan test --filter=PasswordRecoveryTest` passed (13 tests, 31 assertions); `php artisan test --filter=AuthRateLimitTest` passed (2 tests, 5 assertions), including normal `200`, generic forgot-password messaging, and `429`; `php artisan test` passed (56 tests, 142 assertions); Pint and `git diff --check` passed. `php artisan route:list --path=api/auth -v` confirmed all six target throttles and no throttle on logout.
  - **Status:** `[x]`

### P1 — Make API error translation complete and observable

- [x] **Change:** Verify and, only where evidence requires it, complete centralized handling for authentication failures, unsupported methods, authorization failures, and unexpected exceptions so API requests consistently use `ErrorCode`-compatible JSON.
  - **Priority:** P1 — frontend reliability and production diagnostics.
  - **Affected files:** `bootstrap/app.php`, `app/Enums/ErrorCode.php`, middleware/exception configuration, and `tests/Feature/UserApiErrorTest.php`.
  - **Reason:** Controllers and Form Requests use `ErrorCode`, but the contract also promises `UNAUTHORIZED`, `FORBIDDEN`, `METHOD_NOT_ALLOWED`, and `INTERNAL_SERVER_ERROR` for framework-level failures (`BACKEND_LOGIC.md:71-96`).
  - **Acceptance:** Representative missing-token, forbidden-role, unsupported-method, validation, not-found, and unexpected-error requests return the documented status/code/body; production responses do not leak stack traces or secrets.
   - **Evidence (2026-09-14):** Existing centralized handlers in `bootstrap/app.php` were verified for `NOT_FOUND` (404), `METHOD_NOT_ALLOWED` (405), `VALIDATION_ERROR` (422), `UNAUTHORIZED` (401), and `FORBIDDEN` (403). Added only the missing API fallback for non-HTTP unexpected exceptions, returning `ErrorCode::INTERNAL_SERVER_ERROR` (500) with the generic message; framework HTTP errors such as existing `429` throttling responses pass through unchanged. Added a temporary test route in `tests/Feature/UserApiErrorTest.php` proving the 500 code/message and absence of exception text. `php artisan test --filter=UserApiErrorTest` passed (9 tests, 36 assertions); `php artisan test --filter=AuthRateLimitTest` passed (2 tests, 5 assertions); `php artisan test` passed (57 tests, 147 assertions); Pint and `git diff --check` passed.
   - **Files:** `bootstrap/app.php`, `tests/Feature/UserApiErrorTest.php`.
   - **Commands:** `php artisan test --filter=UserApiErrorTest`; `php artisan test --filter=AuthRateLimitTest`; `php artisan test`; `vendor/bin/pint --test bootstrap/app.php tests/Feature/UserApiErrorTest.php`; `git diff --check`.
   - **Status:** `[x]`

### P1 — Verify transactional order behavior and authorization boundaries

- [ ] **Change:** Add or complete feature coverage for order creation, ownership filtering, role access, invalid state transitions, and product deletion constraints. Change implementation only if a test demonstrates a backend defect.
  - **Priority:** P1 — business-data integrity.
  - **Affected files:** `app/Services/PedidoService.php`, `app/Repositories/PedidoRepository.php`, `app/Http/Controllers/Api/PedidoController.php`, `routes/api.php`, `tests/Feature/PedidoApiTest.php`, `tests/Unit/PedidoServiceTest.php`.
  - **Reason:** Orders combine authorization, user scoping, inventory/product reads, totals, and state transitions; route declarations alone do not prove those rules.
   - **Acceptance:** A `cliente` cannot read another user's order; `empleado` and `admin` can read the permitted set; invalid `estado` transitions return `422`; unauthorized roles return `401/403`; order creation and deletion constraints are covered.
   - **Evidence (2026-09-14):** Existing `PedidoApiTest` coverage proves unauthenticated order access returns `401`, customer ownership filtering for list/detail, employee and admin access to all orders, employee rejection of state changes with `403`, valid admin transitions, invalid admin transitions with `422`, and inactive/nonexistent product rejection. Added only the missing multiple-product/multiple-quantity creation assertion and explicit admin order-list coverage in `tests/Feature/PedidoApiTest.php`. Existing `CatalogoPublicoTest` and `ProductoServiceTest` coverage proves products belonging to orders cannot be deleted; `PedidoServiceTest` covers repository-scoped customer pagination, ownership authorization, invalid transitions, and inactive-product rejection without writes. No backend defect was demonstrated, so no application code was changed for this unit.
   - **Commands:** `php artisan test --filter=PedidoApiTest`; `php artisan test --filter=PedidoServiceTest`; `php artisan test --filter=ProductoServiceTest`; `php artisan test`; `php artisan route:list --path=api/pedidos -v`; `vendor/bin/pint --test tests/Feature/PedidoApiTest.php`; `git diff --check`.
   - **Results:** Focused suites passed (12 tests/34 assertions, 4 tests/10 assertions, and 3 tests/9 assertions); full suite passed (59 tests/155 assertions); route output confirmed `auth:api`, customer/employee/admin read routes, and `role:admin` for state changes; Pint and diff checks passed.
   - **Status:** `[x]`

### P1 — Complete API contract coverage for authentication and CRUD

- [x] **Change:** Add missing endpoint-level tests for register, login, logout, refresh, category/tag CRUD, product CRUD, and user CRUD, including role checks and response shapes.
  - **Priority:** P1 — prevents contract regressions before frontend integration.
  - **Affected files:** `tests/Feature/ApiContractCoverageTest.php`, `tests/Feature/CatalogoPublicoTest.php`, `tests/Feature/PasswordRecoveryTest.php`; no application code changed.
  - **Reason:** Existing coverage is meaningful but concentrated in password recovery, public catalog, order behavior, user errors, and selected service units. Codegraph found no nearby tests for several controllers.
  - **Acceptance:** Tests assert exact methods, paths, role boundaries, status codes, resource/envelope shapes, nested pagination, and `details` validation errors for all documented endpoint families.
  - **Evidence (2026-09-14):** Added focused feature coverage for auth register/login/logout/refresh, validation and credential errors, category and tag CRUD, employee/admin/client role boundaries, product pagination and validation plus existing product CRUD assertions, and admin-only user CRUD with pagination/resources/password protection. `php artisan test --filter='ApiContractCoverageTest|CatalogoPublicoTest|PasswordRecoveryTest|UserApiErrorTest'` passed (40 tests, 240 assertions). Full `php artisan test` passed (66 tests, 307 assertions). `php artisan route:list` confirmed POST auth methods, PUT/PATCH category/tag/product updates, admin-only deletes and user CRUD `{usuario}` routes. `vendor/bin/pint --test tests/Feature/ApiContractCoverageTest.php tests/Feature/CatalogoPublicoTest.php` and `git diff --check` passed. No failing test demonstrated an application defect, so no application code was changed.
  - **Status:** `[x]`

### P2 — Align generated API documentation with executable routes

- [x] **Change:** Reconcile OpenAPI annotations for the remaining API controllers with executable routes, Form Requests, Resources, middleware, and current response envelopes. No runtime logic, authorization, field names, or frontend files were changed.
  - **Priority:** P2 — contract clarity, not a runtime blocker.
  - **Affected files:** `app/Http/Controllers/Api/AuthController.php`, `CategoriaController.php`, `EtiquetaController.php`, `PedidoController.php`, `DashboardController.php`, plus regenerated `storage/api-docs/api-docs.json`.
  - **Audited:** All five requested controllers were compared against `routes/api.php`, their Form Requests, Resources, middleware, and implemented response bodies. The prior `UserController` and `ProductoController` alignment remains included in this generated contract.
  - **Corrections:** Added throttling `429` responses and reset-password `404` documentation in `AuthController`; added category/tag `PATCH` operations, optional update payloads, role `403` responses, and deletion-constraint `422` responses; aligned order item constraints and state-update envelope in `PedidoController`; documented dashboard `mensaje` response bodies.
  - **Pending:** No verified discrepancy remains in the five audited controllers. Broader parity for API files outside `UserController`, `ProductoController`, and these five controllers remains outside this bounded audit.
  - **Evidence (2026-09-14):** `php artisan route:list --path=api` confirmed the executable methods, paths, role middleware, and auth throttles. `php artisan l5-swagger:generate` completed successfully; `storage/api-docs/api-docs.json` parsed as valid JSON/OpenAPI JSON. Full `php artisan test` passed with 68 tests and 314 assertions. `vendor/bin/pint --test` passed for all five touched controllers, and `git diff --check` passed.
    - **Status:** `[x]`

### P1 — Harden API CORS and password-recovery links

- [x] **Change:** Publish the minimal Laravel CORS configuration for `/api/*` and encode password-reset query parameters without changing routes, payloads, or normal responses.
  - **Priority:** P1 — cross-origin security and recovery-link correctness.
  - **Affected files:** `config/cors.php`, `bootstrap/app.php` (global `HandleCors` integration verification), `app/Notifications/ResetPasswordNotification.php`, `tests/Feature/CorsTest.php`, `tests/Feature/PasswordRecoveryTest.php`.
  - **Reason:** The API had no published CORS configuration, and reset links concatenated `token` and `email` without URL encoding.
  - **Acceptance:** `CORS_ALLOWED_ORIGINS` is parsed as a comma-separated allowlist with `FRONTEND_URL` and explicit `http://localhost:5173` fallback; only API paths, required methods/headers, and non-wildcard credentials settings are enabled. An actual OPTIONS request to an API route returns CORS headers for an allowed origin. Reset links preserve `FRONTEND_URL/reset-password` and encode only `token` and `email`.
  - **Evidence (2026-09-14):** `CorsTest` passed against the real Laravel HTTP middleware stack, including a `204` preflight with `Access-Control-Allow-Origin`, methods, and headers. `PasswordRecoveryTest` passed with special characters in both query values; full suite, Pint, and `git diff --check` also passed.
  - **Status:** `[x]`

## Frontend implementation later

Frontend adaptation remains intentionally deferred and is tracked only in [`FRONTEND_TODO.md`](./FRONTEND_TODO.md); this backend plan does not duplicate frontend tasks.

## Environment/deployment

Do not copy local `.env` values, JWT secrets, mail credentials, or private keys into this document, React source, or commits. Record variable names and verification outcomes only.

- [ ] Create a deployment-specific backend configuration checklist for `APP_ENV`, `APP_DEBUG=false`, `APP_URL`, `FRONTEND_URL`, database settings, `JWT_SECRET`/configured JWT key variables, `JWT_TTL`, `JWT_REFRESH_TTL`, and `MAIL_*`.
- [ ] Configure the frontend deployment with `VITE_API_URL` pointing to the backend API root, including `/api`.
- [x] Verify CORS for the configured frontend origin and required HTTP methods/headers with a real API preflight (`tests/Feature/CorsTest.php`). Deployment still must provide the intended origin through `CORS_ALLOWED_ORIGINS` or `FRONTEND_URL`.
- [x] Verify password-reset link construction and encoding for `token` and `email` (`app/Notifications/ResetPasswordNotification.php`, `tests/Feature/PasswordRecoveryTest.php`).
- [ ] Run migrations, seed the required roles (`cliente`, `empleado`, `admin`), clear/cache configuration as appropriate, and verify queues/mail processing according to the selected deployment architecture.
- [ ] Confirm observability and failure behavior without exposing JWTs, reset tokens, passwords, or stack traces in logs/responses.

## Testing

### Initial safe verification phase

Run this phase before changing application code:

1. Confirm the working tree and identify the exact files intended for the change; do not edit `.env` or copy secrets.
2. Run `php artisan route:list --path=api` and compare the result with `BACKEND_LOGIC.md`.
3. Run the existing suite with `php artisan test` (or `composer test`) and record the result here.
4. Add the smallest failing regression test for the P0 `UserRequest` parameter defect.
5. Implement only that correction, rerun the focused test, then rerun the full suite.
6. Proceed to P1 security and contract work one bounded item at a time.

### Verification checklist

- [ ] `php artisan route:list --path=api` matches the documented methods, paths, and middleware.
- [ ] `php artisan test` passes after every backend work unit.
- [ ] Feature tests cover `401`, `403`, `404`, `405`, `422`, `429`, and `500` behavior where applicable.
- [ ] Unit tests mock service/repository interfaces without requiring a real database for business-rule tests.
- [ ] Integration tests use the test database and cover JWT, roles, resources, pagination, and password recovery.
- [ ] A local browser/API smoke test confirms CORS, refresh, logout, and reset-link navigation only after backend tests pass.
- [ ] Deployment smoke tests use non-production test accounts and never print or store secrets in this document.

## Completed work

- [x] Existing `BACKEND_LOGIC.md` documents the current routes, JWT contract, password recovery, resources, errors, pagination, roles, frontend-template findings, and integration checklist.
- [x] Backend architecture remediation already routed password-reset persistence through `UserRepositoryInterface`, consolidated duplicate API exception renderers, and added mock-based unit coverage for `PedidoService`, `ProductoService`, and `UserService` (recorded in project history; verify against the current tree before relying on it).
- [x] Password recovery feature coverage exists in `tests/Feature/PasswordRecoveryTest.php`, including generic unknown-email behavior, token validation, reset, refresh, and blacklist checks.
- [x] No Laravel source file or existing frontend file was modified while creating this plan.

## Update log

| Date | Change | Evidence / verification |
|---|---|---|
| 2026-09-14 | Audited and aligned the remaining requested API controllers. | Audited `AuthController`, `CategoriaController`, `EtiquetaController`, `PedidoController`, and `DashboardController` against routes, middleware, Form Requests, Resources, and response bodies. Corrected only verified OpenAPI discrepancies; regenerated `storage/api-docs/api-docs.json`; route-list, Pint, and diff checks passed. |
| 2026-09-14 | Completed P2 OpenAPI alignment for users and products. | Regenerated `storage/api-docs/api-docs.json`; user paths now use `{usuario}`, reviewed `PATCH` routes are generated, and public product listing/detail no longer document `401`. OpenAPI generation and JSON parsing passed; full tests passed with 66 tests and 307 assertions; Pint and `git diff --check` passed. Broader controller parity remains pending. |
| 2026-09-14 | Created the initial living remediation plan. | Read-only inspection of Laravel source, tests, configuration, and `BACKEND_LOGIC.md`; no code changes. |
| 2026-09-14 | Completed P0 user email update validation. | `UserRequest` now reads the `{usuario}` route parameter; `php artisan test --filter=UserApiErrorTest` passed (8 tests, 31 assertions). |
| 2026-09-14 | Completed P1 public authentication abuse controls. | Named IP and IP+email limiters registered in `AppServiceProvider`, applied to the six target routes, and covered by `AuthRateLimitTest`; focused recovery, new, full suite, Pint, route-list, and diff checks passed. |
| 2026-09-14 | Completed P1 API error translation and observability. | Preserved existing 401/403/404/405/422 handlers and added the generic API-only 500 fallback for unexpected non-HTTP exceptions; focused and full test suites, Pint, and diff checks passed. |
| 2026-09-14 | Verified P1 transactional order behavior and authorization boundaries. | Added only missing feature assertions for multi-product quantities and admin order visibility; existing ownership, role, transition, and product-deletion tests passed. Focused suites passed; full suite passed with 59 tests and 155 assertions; route, Pint, and diff checks passed. No backend defect was found. |
| 2026-09-14 | Completed P1 authentication and CRUD API contract coverage. | Added `ApiContractCoverageTest` and strengthened product response assertions. Focused contract families passed with 40 tests and 240 assertions; full suite passed with 66 tests and 307 assertions. Route-list, Pint, and diff checks passed. No application defect was found. |
| 2026-09-14 | Completed P1 API CORS and password-recovery link hardening. | Published `config/cors.php`, verified a real allowed-origin OPTIONS preflight, encoded only reset-link `token` and `email`, and removed duplicated frontend tasks from this plan. |
