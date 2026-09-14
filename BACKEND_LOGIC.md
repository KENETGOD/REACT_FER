# Laravel Backend Integration Contract

## Executive summary

The Laravel backend exposes a JSON API under the `/api` prefix. Its main integration contract is:

- **Base URL:** configure Laravel with `APP_URL`; the API root is `<APP_URL>/api`. The React client is configured independently through `VITE_API_URL`.
- **Authentication:** JWT bearer tokens are returned by registration, login, and refresh. Protected requests require `Authorization: Bearer <token>`.
- **Public catalog:** product listing and product detail are public.
- **Protected business API:** orders require authentication; category, tag, and product management requires `empleado` or `admin`; user administration and order-status changes require `admin`.
- **Current readiness:** the Laravel backend is stabilized and ready from an application-contract perspective, with environment verification still required for each deployment. The remaining blockers belong to the React structural template: its refresh implementation calls the wrong method/path and expects a response shape that Laravel does not return, and it still lacks real authentication and domain API modules. Track those frontend tasks in [`FRONTEND_TODO.md`](./FRONTEND_TODO.md); backend remediation and verification evidence are tracked in [`BACKEND_REMEDIATION_PLAN.md`](./BACKEND_REMEDIATION_PLAN.md).

This document records the current source code, not an assumed future contract. Backend source names and route names are preserved.

## 1. URLs and request conventions

| Item | Current contract |
|---|---|
| Laravel application URL | `APP_URL` → `config('app.url')`; the code default is `http://localhost` when unset. |
| API root | `/api`, supplied by Laravel's API route registration. Example shape: `<APP_URL>/api`. |
| React API variable | `VITE_API_URL`, consumed by `src/service/core/apiService.js`. Set it to the complete API root, including `/api`, because the client sends paths such as `/productos`. |
| Content type | JSON requests use `Content-Type: application/json`; the React Axios interceptor adds it unless the request is `FormData`. |
| Authentication header | `Authorization: Bearer <JWT>`. The current React Axios interceptor reads `localStorage.getItem("token")`. |
| HTTP client | React uses the shared Axios instance exported by `src/service/index.js`, or the `get`, `post`, `put`, `patch`, and `del` helpers. |

Do not copy private `.env` values into frontend code or documentation. The relevant variable names are `APP_URL`, `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, JWT configuration variables, mail configuration variables, and `VITE_API_URL`.

### 1.1 CORS

Laravel applies CORS to `api/*` through the published `config/cors.php` configuration. `CORS_ALLOWED_ORIGINS` is parsed as a comma-separated allowlist; when it is empty, the backend falls back to `FRONTEND_URL`, and then to `http://localhost:5173`. Wildcard origins are ignored. The configured API methods are `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, and `OPTIONS`; allowed headers are `Accept`, `Authorization`, `Content-Type`, `Origin`, and `X-Requested-With`. Credentials are disabled (`supports_credentials: false`).

An allowed-origin preflight is covered by the backend test suite. Deployment still must provide the intended origin through `CORS_ALLOWED_ORIGINS` or `FRONTEND_URL`; no environment-specific value belongs in this document.

## 2. Authentication and JWT

### 2.1 Authentication endpoints

| Method | Path | Auth / role | Request payload and validation | Success response |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | `{ name, email, password }`; `name` required string max 255, `email` required valid email max 255 and unique, `password` required string min 6. | `201`: `{ mensaje, user, authorization: { token, type: "bearer" } }`. `user` is `UserResource`. |
| `POST` | `/api/auth/login` | Public | `{ email, password }`; both required strings; `email` must be a valid email. | `200`: `{ mensaje, user, authorization: { token, type: "bearer" } }`. Invalid credentials: `401`. |
| `POST` | `/api/auth/logout` | `auth:api` | No body required. | `200`: `{ mensaje: "Sesión cerrada exitosamente" }`. |
| `POST` | `/api/auth/refresh` | Route is public, but the JWT guard parses the bearer token | No body. Send the current bearer token, including an expired token still inside the refresh window. | `200`: `{ mensaje, authorization: { token, type: "bearer" } }`. The previous token is blacklisted. Invalid/out-of-window token: `401`. |

JWT configuration currently uses the `api` guard with driver `jwt`. Defaults in `config/jwt.php` are a 60-minute token TTL and a 20,160-minute refresh window (14 days); these are configurable through `JWT_TTL` and `JWT_REFRESH_TTL`. Signing configuration must remain server-side (`JWT_SECRET` for the default `HS256` configuration, or the configured key variables).

### 2.3 Authentication rate limits

The six public authentication flows use named Laravel limiters. Exceeding any applicable limit returns HTTP `429` without changing the normal success contract:

| Limiter | Route | Limit |
|---|---|---|
| `auth-login` | `POST /api/auth/login` | 30/minute per IP and 5/minute per IP+email |
| `auth-register` | `POST /api/auth/register` | 10/minute per IP |
| `auth-forgot-password` | `POST /api/auth/forgot-password` | 20/minute per IP and 5/minute per IP+email |
| `auth-verify-reset-token` | `POST /api/auth/verify-reset-token` | 30/minute per IP and 10/minute per IP+email |
| `auth-reset-password` | `POST /api/auth/reset-password` | 20/minute per IP and 5/minute per IP+email |
| `auth-refresh` | `POST /api/auth/refresh` | 30/minute per IP |

`POST /api/auth/logout` is authenticated but has no named throttle; it remains limited by `auth:api`.

### 2.2 Token persistence expected by the current React client

The backend does not set a browser cookie. The frontend must persist the returned `authorization.token`, attach it as a bearer token, replace it after refresh, and remove it after logout or an unrecoverable `401`.

The existing React client already reads and writes the token under the `localStorage` key `token` in `apiService.js` and `renewTokenService.js`. It does not currently persist a complete authenticated user contract in a working backend adapter. A future auth store should keep the token and `user` response together, while treating the JWT as sensitive browser storage data.

## 3. Password recovery

All three recovery routes are public and use JSON bodies.

| Method | Path | Payload / validation | Success | Failure behavior |
|---|---|---|---|---|
| `POST` | `/api/auth/forgot-password` | `{ email }`; required valid email, max 255. | `200`: `{ mensaje: "Si el correo existe, recibirás un enlace para restablecer tu contraseña." }`. | Validation errors use `422`. The controller intentionally returns the same message whether the account exists or not. |
| `POST` | `/api/auth/verify-reset-token` | `{ email, token }`; both required, `email` valid max 255, `token` required string. | `200`: `{ mensaje: "El enlace de restablecimiento es válido." }`. | Unknown user: `404` `USER_NOT_FOUND`; invalid/expired token: `400` `INVALID_TOKEN`; invalid body: `422`. |
| `POST` | `/api/auth/reset-password` | `{ email, token, password, password_confirmation }`; email valid max 255, token required, password required string min 6 and `confirmed`. | `200`: `{ mensaje: "Contraseña restablecida con éxito." }`. | Unknown user: `404` `USER_NOT_FOUND`; invalid/expired token: `400` `INVALID_TOKEN`; invalid body: `422`. |

Reset tokens use Laravel's password broker. `config/auth.php` sets a 60-minute expiry and a 60-second throttle. Mail delivery depends on the server-side mail variables (`MAIL_*`); no mail secret belongs in the frontend. `FRONTEND_URL` is the configured frontend destination used by the application's password-reset link flow. The generated `/reset-password` URL encodes the `token` and `email` query parameters with RFC 3986 encoding, so special characters are preserved correctly.

## 4. Response and error formats

### 4.1 Resources

| Resource | JSON fields |
|---|---|
| `UserResource` | `id`, `name`, `email`, `created_at`, `updated_at` |
| `CategoriaResource` | `id`, `nombre`, `created_at`, `updated_at` |
| `EtiquetaResource` | `id`, `nombre`, `created_at`, `updated_at` |
| `ProductoResource` | `id`, `nombre`, `descripcion`, `precio_formateado` (number), `disponible` (boolean), optional loaded `categoria` name, optional loaded `etiquetas` array with `id` and `nombre` |
| `PedidoResource` | `id`, `user_id`, `total`, `estado`, optional loaded `usuario` name, optional loaded `productos` with `id`, `nombre`, `cantidad`, `precio`, `subtotal`, `created_at`, `updated_at` |

### 4.2 Errors

The standard API error body is:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Los datos enviados no son válidos",
  "details": {
    "field": ["The field is required."]
  }
}
```

`details` is included when validation details exist. The backend defines these error codes and statuses:

| Code | Status | Meaning |
|---|---:|---|
| `USER_NOT_FOUND` | 404 | User does not exist. |
| `NOT_FOUND` | 404 | Requested resource does not exist. |
| `VALIDATION_ERROR` | 422 | Request validation failed. |
| `METHOD_NOT_ALLOWED` | 405 | HTTP method is not supported by the route. |
| `UNAUTHORIZED` | 401 | Missing, invalid, or expired authentication. |
| `FORBIDDEN` | 403 | Authenticated user lacks the required role. |
| `INVALID_TOKEN` | 400 | Password-reset token is invalid or expired. |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected non-HTTP API exception; the response is generic and does not expose exception details, stack traces, or secrets. |

For an unexpected API exception, the backend returns the standard `INTERNAL_SERVER_ERROR` response with its generic message. HTTP exceptions such as throttling are preserved, so a rate-limit breach remains `429`.

### 4.3 Pagination

The list endpoints accept the optional query parameter `per_page`; the default is `15`. The response shape is:

```json
{
  "estado": "exito",
  "data": {
    "current_page": 1,
    "data": [],
    "first_page_url": "...",
    "from": 1,
    "last_page": 1,
    "last_page_url": "...",
    "links": [],
    "next_page_url": null,
    "path": "...",
    "per_page": 15,
    "prev_page_url": null,
    "to": 0,
    "total": 0
  }
}
```

The inner `data` array contains the relevant API Resource objects.

## 5. Domain endpoints

### 5.1 Products — `productos`

| Method | Path | Role | Payload / response |
|---|---|---|---|
| `GET` | `/api/productos` | Public | Paginated `ProductoResource`; optional `per_page`. |
| `GET` | `/api/productos/{id}` | Public | `200` `ProductoResource`; missing product: `404` `NOT_FOUND`. |
| `POST` | `/api/productos` | `empleado` or `admin` | Body: `categoria_id` required integer existing in `categorias`; `nombre` required string max 100; `descripcion` nullable string; `precio` required numeric min 0; `activo` nullable boolean; `etiquetas_ids` nullable array of existing tag IDs. `201`: `{ mensaje, producto }`. |
| `PUT` / `PATCH` | `/api/productos/{id}` | `empleado` or `admin` | Same fields; `categoria_id`, `nombre`, and `precio` become optional on update (`sometimes`). `200`: `{ mensaje, data: ProductoResource }`. |
| `DELETE` | `/api/productos/{id}` | `admin` | `200`: `{ mensaje: "Producto eliminado correctamente" }`. |

### 5.2 Categories — `categorias`

| Method | Path | Role | Payload / response |
|---|---|---|---|
| `GET` | `/api/categorias` | `empleado` or `admin` | Paginated `CategoriaResource`; optional `per_page`. |
| `POST` | `/api/categorias` | `empleado` or `admin` | `{ nombre }`; required string max 255. `201`: `{ mensaje, data: CategoriaResource }`. |
| `GET` | `/api/categorias/{id}` | `empleado` or `admin` | `200` `CategoriaResource`; missing category: `404`. |
| `PUT` / `PATCH` | `/api/categorias/{id}` | `empleado` or `admin` | `{ nombre }`; `nombre` is `sometimes`, string max 255. `200`: `{ mensaje, data: CategoriaResource }`. |
| `DELETE` | `/api/categorias/{id}` | `admin` | `200`: `{ mensaje: "Categoría eliminada" }`. |

### 5.3 Tags — `etiquetas`

| Method | Path | Role | Payload / response |
|---|---|---|---|
| `GET` | `/api/etiquetas` | `empleado` or `admin` | Paginated `EtiquetaResource`; optional `per_page`. |
| `POST` | `/api/etiquetas` | `empleado` or `admin` | `{ nombre }`; required string max 255. `201`: `{ mensaje, data: EtiquetaResource }`. |
| `GET` | `/api/etiquetas/{id}` | `empleado` or `admin` | `200` `EtiquetaResource`; missing tag: `404`. |
| `PUT` / `PATCH` | `/api/etiquetas/{id}` | `empleado` or `admin` | `{ nombre }`; `nombre` is `sometimes`, string max 255. `200`: `{ mensaje, data: EtiquetaResource }`. |
| `DELETE` | `/api/etiquetas/{id}` | `admin` | `200`: `{ mensaje: "Etiqueta eliminada" }`. |

### 5.4 Orders — `pedidos`

| Method | Path | Role | Payload / response |
|---|---|---|---|
| `GET` | `/api/pedidos` | `cliente`, `empleado`, or `admin` | Paginated orders; clients receive only their own orders, employees/admins receive all. Optional `per_page`. |
| `POST` | `/api/pedidos` | `cliente`, `empleado`, or `admin` | `{ items: [{ producto_id, cantidad }] }`; `items` required array min 1; each product ID must exist and quantity is required integer min 1. `201`: `{ mensaje, data: PedidoResource }`. |
| `GET` | `/api/pedidos/{id}` | `cliente`, `empleado`, or `admin` | Clients can retrieve only their own order; employees/admins can retrieve any. `200` `PedidoResource`; missing order: `404`. |
| `PUT` | `/api/pedidos/{id}/estado` | `admin` | `{ estado }`; required string and one of `pendiente`, `pagado`, `enviado`, `entregado`, `cancelado`. `200`: `{ mensaje, data: PedidoResource }`; invalid state transition: `422`. |

### 5.5 Users — `usuarios`

All user-management routes are inside `auth:api` and `role:admin`. Laravel's `Route::apiResource('usuarios', UserController::class)` exposes the following actual paths; the route parameter is named `{usuario}`.

| Method | Path | Payload / response |
|---|---|---|
| `GET` | `/api/usuarios` | Paginated `UserResource`; optional `per_page`. |
| `POST` | `/api/usuarios` | `{ name, email, password }`; name required string max 255, email required valid and unique, password required string min 8. `201`: `UserResource` directly. |
| `GET` | `/api/usuarios/{usuario}` | `200` `UserResource`; missing user: `404` `USER_NOT_FOUND`. |
| `PUT` / `PATCH` | `/api/usuarios/{usuario}` | `name`, `email`, and `password` are optional on update; provided values must be valid, and password min 8. `200`: `UserResource` directly. |
| `DELETE` | `/api/usuarios/{usuario}` | `204` with no response body on success; missing user: `404` `USER_NOT_FOUND`. |

## 6. Role dashboards

| Method | Path | Required role | Success |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | `admin` | `200`: `{ mensaje: "¡Bienvenido al panel de Administrador! Todo funciona perfecto." }`. |
| `GET` | `/api/empleado/pedidos` | `empleado` | `200`: `{ mensaje: "Área de gestión de pedidos para Empleados" }`. |
| `GET` | `/api/cliente/perfil` | `cliente` | `200`: `{ mensaje: "Bienvenido a tu perfil de Cliente" }`. |

## 7. React consumption plan

1. Set `VITE_API_URL` to the backend API root, including `/api`.
2. Reuse `src/service/core/apiService.js` or the helpers exported from `src/service/index.js`; do not create a second Axios client.
3. Store `authorization.token` as the current token key expected by the interceptor (`token`), and store the returned `user` separately if the UI needs it.
4. Send JSON payloads with the backend field names exactly as documented: `nombre`, `categoria_id`, `etiquetas_ids`, `items`, `producto_id`, `cantidad`, and `estado`.
5. With direct Axios responses, read list records from `response.data.data.data`; pagination metadata is in `response.data.data`. With the shared `get` helper, the Axios envelope is already removed, so read records from `result.data.data`.
6. Handle errors from `error`, `message`, and optional `details`; do not assume Laravel's default `{ errors: ... }` validation shape.
7. On refresh, call `POST /api/auth/refresh`, read `response.authorization.token`, replace `localStorage.token`, and retry the pending request only once.
8. Use role-aware route guards in React, but keep the backend middleware as the authority. A hidden menu is not authorization.

### Current frontend integration findings

| Finding | Evidence | Impact |
|---|---|---|
| Shared API base URL exists | `src/service/core/apiService.js` uses `import.meta.env.VITE_API_URL`. | Reusable foundation is present. |
| Bearer injection exists | The request interceptor reads `localStorage` key `token`. | Login/register adapters can integrate without changing the client convention. |
| Refresh implementation is incompatible | `src/service/renewTokenService.js` calls `GET` on `${VITE_API_URL}/refresh`, expects `data.token` and `data.usuario`; Laravel exposes `POST /api/auth/refresh` and returns `authorization.token`. | Refresh must be corrected before relying on session renewal. |
| Real auth flow is not implemented | `src/store/useAuthStore.js` only stores `showChangePassword`; `src/App.jsx` has no auth routes or guards. | Registration, login, logout, and recovery screens/adapters remain to be built. |
| CRUD example is simulated | `src/modules/crudExample/crudExampleApi.js` uses a local Axios adapter and `localStorage`, not Laravel endpoints. | It is a template reference, not evidence that domain integration is complete. |

## 8. Integration checklist

- [ ] Configure `APP_URL` on Laravel and `VITE_API_URL` on React with the correct `/api` boundary.
- [ ] Confirm server JWT signing and mail variables are configured without exposing their values to the browser.
- [ ] Implement register and login adapters using `authorization.token`, `authorization.type`, and `user`.
- [ ] Persist the token under the existing `token` key or update the interceptor and all callers consistently.
- [ ] Fix refresh to `POST /api/auth/refresh` and consume `authorization.token`.
- [ ] Implement logout and clear local auth state after a successful logout or terminal authentication failure.
- [ ] Implement forgot-password, verify-reset-token, and reset-password forms with the exact field names and `password_confirmation`.
- [ ] Add React role guards for `cliente`, `empleado`, and `admin`, while relying on backend middleware for enforcement.
- [ ] Replace simulated CRUD adapters with domain adapters for `productos`, `categorias`, `etiquetas`, `pedidos`, and `usuarios`.
- [ ] Map pagination from the nested `data.data` array and preserve pagination metadata.
- [ ] Map API errors from `error`, `message`, and `details`.
- [ ] Verify the password-reset email link points to a real React route using the configured `FRONTEND_URL`.
- [ ] Confirm deployment CORS behavior from the actual environment before release using `CORS_ALLOWED_ORIGINS` or `FRONTEND_URL`.

## 9. Readiness assessment

### Backend status: `ready_with_environment_verification`

**Evidence supporting readiness:** `php artisan route:list --path=api` reports 39 current routes, including the generated OpenAPI endpoints at `/api/documentation` and `/api/oauth2-callback`; the controllers, Form Requests, JWT guard, role middleware aliases, resources, pagination helper, standardized API error enum, named auth limiters, CORS configuration, and encoded reset links are present and covered by verification evidence. The OpenAPI document is generated at `storage/api-docs/api-docs.json` with `php artisan l5-swagger:generate` and reflects the current executable contract.

### Frontend-template blockers (not backend readiness blockers)

1. Correct `src/service/renewTokenService.js`: method must be `POST`, path must be `/auth/refresh` when `VITE_API_URL` already includes `/api`, and the new token is under `authorization.token`.
2. Build the missing React auth flow and route guards. The current auth store is not an authentication session store.
3. Replace the local CRUD adapter with real API adapters and map the backend's Spanish field names and nested pagination shape.
4. Validate deployment-specific mail delivery, the frontend reset-link route, CORS origin configuration, and other environment values in the target environment. This is deployment verification, not an unresolved backend code defect.

The complete frontend work queue is [`FRONTEND_TODO.md`](./FRONTEND_TODO.md). Backend implementation and verification history is [`BACKEND_REMEDIATION_PLAN.md`](./BACKEND_REMEDIATION_PLAN.md).

Only this documentation file is changed by this update; no backend or frontend source file is changed.
