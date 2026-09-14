# React/Laravel Template Architecture

## Frontend boundaries

Use React 19 with Vite. Ant Design owns reusable UI primitives. React Router owns navigation. TanStack React Query owns server data, cache, loading, mutation, and invalidation state. Zustand owns deliberately shared client/session state.

Keep the structure predictable:

```text
src/
  layouts/                 # authenticated and role-specific shells
  components/common/       # reusable presentation
  modules/<feature>/       # api/, hooks, views, feature-local types
  service/core/            # Axios client, auth/session, shared API behavior
  store/                   # Zustand stores
  utils/                   # pure helpers and guards
  assets/styles/           # shared styling
```

Each feature should expose a small API boundary, a React Query hook for server state, and a view. Do not place mock data in production modules. Keep auth headers, refresh, logout, and response normalization in shared service code rather than duplicating them in views.

## Laravel API mapping

The Axios base URL must end with `/api`. Therefore the relative endpoint paths below resolve beneath that base:

| Concern | Method | Path |
|---|---:|---|
| Login | POST | `/auth/login` |
| Refresh JWT | POST | `/auth/refresh` |
| Logout | POST | `/auth/logout` |
| Products | API resource | `/productos` |
| Categories | API resource | `/categorias` |
| Tags | API resource | `/etiquetas` |
| Orders | API resource | `/pedidos` |
| Users | API resource | `/usuarios` |

Authentication responses may place the usable JWT at `authorization.token`. Persist that token and the user through one consistent session path. Refresh with POST, not GET; logout remotely before clearing local state. Protect routes by authentication and, where applicable, roles `cliente`, `empleado`, or `admin`. Provide dashboards according to role.

Successful responses expose `estado` and `data`. Paginated resources commonly nest records at `data.data`; do not flatten blindly. Errors expose `error`, `message`, and optional `details`; preserve useful details for UI error handling. Never commit credentials or expose private environment values.
