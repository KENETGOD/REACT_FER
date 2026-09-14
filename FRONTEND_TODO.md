# Frontend Implementation TODO

**Status:** Living implementation checklist.
**Scope:** React template at `C:\Users\Ferna\Documents\SFA TEMPLATES\FRONT FER\REACT_FER`.
**Backend contract:** [`BACKEND_LOGIC.md`](./BACKEND_LOGIC.md).
**Backend remediation context:** [`BACKEND_REMEDIATION_PLAN.md`](./BACKEND_REMEDIATION_PLAN.md).

## Non-negotiable boundary

React is currently a **structural template**, not the source of business rules or API contracts. Adapt the template to the verified Laravel backend contract; do not reshape Laravel routes, payloads, response names, roles, or business rules to fit mocks, local adapters, or existing UI assumptions.

The backend contract is authoritative for:

- HTTP methods and `/api` paths.
- Request field names and validation rules.
- Response envelopes, resources, pagination, and error codes.
- JWT behavior and the roles `cliente`, `empleado`, and `admin`.

Do not modify backend code as part of these frontend tasks unless a separate, evidence-based backend defect is identified and recorded in the backend remediation plan.

## Delivery order

Complete the tasks in priority order. Each task stays unchecked until its acceptance criteria and dependency checks are satisfied.

### P0 — Make the shared API boundary and refresh flow reliable

#### 1. Configure the API root and shared client

- [ ] **Task:** Configure `VITE_API_URL` as the complete backend API root, including `/api`; reuse the existing shared Axios client instead of creating another client.
- **Affected frontend files/routes:**
  - `src/service/core/apiService.js`
  - `src/service/index.js`
  - Frontend environment configuration containing `VITE_API_URL` (variable name only; never commit its secret or environment-specific value)
  - All API calls that use paths such as `/productos`, `/auth/login`, and `/auth/refresh`
- **Backend references:** `BACKEND_LOGIC.md:15-26`, `BACKEND_LOGIC.md:186-195`.
- **Dependencies:** None. This is the base for every adapter and the refresh flow.
- **Acceptance criteria:**
  - [ ] The shared client resolves `${VITE_API_URL}/productos` to the backend `/api/productos` endpoint without producing `/api/api/...` or omitting `/api`.
  - [ ] Existing bearer-token injection continues to read the `localStorage` key `token`.
  - [ ] No second Axios client is introduced.
  - [ ] No private `.env` values, JWT secrets, mail credentials, or private keys are committed.

#### 2. Correct JWT refresh and one-time request retry

- [ ] **Task:** Replace the incompatible refresh implementation with `POST /api/auth/refresh` (or `/auth/refresh` when `VITE_API_URL` already includes `/api`), read `authorization.token`, replace `localStorage.token`, and retry a pending request at most once.
- **Affected frontend files/routes:**
  - `src/service/renewTokenService.js`
  - `src/service/core/apiService.js` and its response interceptor flow
  - Backend route consumed: `POST /api/auth/refresh`
- **Backend references:** `BACKEND_LOGIC.md:34-45`, `BACKEND_LOGIC.md:186-195`, `BACKEND_LOGIC.md:201-203`, `BACKEND_LOGIC.md:229-234`.
- **Dependencies:** Task 1; the shared client must have the correct API root and bearer header behavior.
- **Acceptance criteria:**
  - [ ] Refresh uses `POST` with no request body and sends the current bearer token.
  - [ ] The response token is read from `authorization.token`, not `data.token` or `data.usuario`.
  - [ ] A successful refresh replaces `localStorage.token` before retrying the original request.
  - [ ] Each failed request is retried at most once; refresh failure does not create an infinite loop.
  - [ ] A terminal `401` clears the token/session and routes the user to the unauthenticated experience.
  - [ ] Logout or token invalidation does not leave the previous token available for subsequent requests.

### P1 — Implement real authentication and recovery

#### 3. Build authentication and password-recovery adapters

- [ ] **Task:** Build real adapters for registration, login, logout, forgot-password, verify-reset-token, and reset-password using the exact backend fields and response envelopes.
- **Affected frontend files/routes:**
  - New or existing auth API module under `src/service/` or `src/modules/auth/`
  - `src/store/useAuthStore.js`
  - Auth pages/components and their React routes, including the reset link route `/reset-password?token=...&email=...`
  - Backend routes consumed:
    - `POST /api/auth/register`
    - `POST /api/auth/login`
    - `POST /api/auth/logout`
    - `POST /api/auth/forgot-password`
    - `POST /api/auth/verify-reset-token`
    - `POST /api/auth/reset-password`
- **Backend references:** `BACKEND_LOGIC.md:28-57`, `BACKEND_LOGIC.md:207-220`.
- **Dependencies:** Tasks 1 and 2; the auth state in Task 4 should consume these results.
- **Acceptance criteria:**
  - [ ] Registration sends `{ name, email, password }` and stores `authorization.token` plus `user` from the `201` response.
  - [ ] Login sends `{ email, password }` and stores the returned token under `localStorage.token` plus the returned `user`.
  - [ ] Logout calls the backend route when possible and clears local auth state after success or terminal authentication failure.
  - [ ] Forgot-password sends `{ email }` and preserves the same generic success message for known and unknown accounts.
  - [ ] Verify-reset-token sends `{ email, token }`.
  - [ ] Reset-password sends `{ email, token, password, password_confirmation }`.
  - [ ] The reset form is reachable from the configured `FRONTEND_URL` link and does not expose mail or JWT secrets.

#### 4. Replace simulated CRUD with real domain adapters

- [ ] **Task:** Replace the local `crudExample` simulation with real adapters for products, categories, tags, orders, and users. Use backend field names and response envelopes rather than mock-shaped records.
- **Affected frontend files/routes:**
  - `src/modules/crudExample/crudExampleApi.js` (remove local `localStorage`/delay behavior from the production flow)
  - Existing domain modules under `src/modules/`
  - Backend route families: `/api/productos`, `/api/categorias`, `/api/etiquetas`, `/api/pedidos`, `/api/usuarios`
- **Backend references:** `BACKEND_LOGIC.md:61-69`, `BACKEND_LOGIC.md:125-176`, `BACKEND_LOGIC.md:186-195`, `BACKEND_LOGIC.md:204-205`.
- **Dependencies:** Tasks 1, 3, and 5; role guards from Task 6 must control the UI, while backend middleware remains authoritative.
- **Acceptance criteria:**
  - [ ] Products use `nombre`, `categoria_id`, `descripcion`, `precio`, `activo`, and `etiquetas_ids` as required by each operation.
  - [ ] Orders send `{ items: [{ producto_id, cantidad }] }` and consume `PedidoResource` fields such as `estado`, `total`, and nested products.
  - [ ] User update URLs use `/api/usuarios/{usuario}` and not an assumed `{id}` route parameter.
  - [ ] CRUD calls use the documented methods, roles, status codes, and response envelopes.
  - [ ] No production domain request reads from or writes to the `tanstack-crud-example` local-storage adapter.

### P1 — Make session state and authorization-aware navigation explicit

#### 5. Build auth state and route guards

- [ ] **Task:** Build authenticated session state around `authorization.token` and the returned `user`; add guards for `cliente`, `empleado`, and `admin` without treating frontend visibility as authorization.
- **Affected frontend files/routes:**
  - `src/store/useAuthStore.js`
  - `src/App.jsx`
  - Existing route definitions and protected layouts/components
  - Backend middleware-protected route families: `/api/pedidos`, `/api/usuarios`, `/api/admin/dashboard`, `/api/empleado/pedidos`, `/api/cliente/perfil`
- **Backend references:** `BACKEND_LOGIC.md:8-11`, `BACKEND_LOGIC.md:41-45`, `BACKEND_LOGIC.md:157-184`, `BACKEND_LOGIC.md:194-195`, `BACKEND_LOGIC.md:203-204`.
- **Dependencies:** Tasks 1–3. Domain adapter access rules also depend on Task 4.
- **Acceptance criteria:**
  - [ ] A session can be restored from the persisted token and user state without inventing a different backend contract.
  - [ ] Unauthenticated users cannot enter protected React routes.
  - [ ] `cliente`, `empleado`, and `admin` receive only the UI routes appropriate to their role.
  - [ ] Guards handle loading and terminal `401` states without redirect loops.
  - [ ] Guards are explicitly documented as UX/navigation controls; Laravel `auth:api` and role middleware remain the security boundary.

### P2 — Normalize API results for screens

#### 6. Map pagination and standardized API errors

- [ ] **Task:** Map Laravel's nested pagination shape and normalize errors from `error`, `message`, and optional `details` for forms, tables, and notifications.
- **Affected frontend files/routes:**
  - Shared request/error utilities under `src/service/` and `src/utils/`
  - `src/utils/generateErrorHtml.js`
  - Table/list screens and `src/components/common/SearchBar.jsx`
  - All paginated list routes, especially `/api/productos`, `/api/categorias`, `/api/etiquetas`, `/api/pedidos`, and `/api/usuarios`
- **Backend references:** `BACKEND_LOGIC.md:59-96`, `BACKEND_LOGIC.md:98-123`, `BACKEND_LOGIC.md:186-195`, `BACKEND_LOGIC.md:217-219`.
- **Dependencies:** Tasks 1 and 4; auth adapters and guards should already establish the request/session error path.
- **Acceptance criteria:**
  - [ ] With direct Axios responses, records are read from `response.data.data.data`; with shared helpers, records are read from `result.data.data`.
  - [ ] `current_page`, `last_page`, `per_page`, `total`, and link metadata remain available to pagination controls.
  - [ ] Validation errors render field-level `details` without assuming Laravel's default `{ errors: ... }` shape.
  - [ ] `401`, `403`, `404`, `405`, `422`, and `500` API codes produce stable user-facing behavior without exposing stack traces or secrets.
  - [ ] Empty pages, missing `details`, network failures, and non-array error values do not crash the UI.

## Definition of done

- [ ] Every item above has passing acceptance evidence and no unresolved mock-only path in the production flow.
- [ ] The frontend consumes the exact current contract in `BACKEND_LOGIC.md`; any contract change is first verified against Laravel routes/tests and then reflected here.
- [ ] No backend route, role, response field, or business rule was changed merely to preserve the structural React template.
- [ ] `VITE_API_URL` is configured per environment, includes `/api`, and no secret values are committed.
- [ ] Frontend tests or focused smoke checks cover refresh, login/logout, password recovery, guards, one domain adapter, pagination, and standardized errors.
