---
name: react-laravel-template
description: "Trigger: React frontend, Laravel API, JWT, template project, feature module. Build features that follow this project's frontend architecture and API contract."
license: Apache-2.0
metadata:
  author: "Ferna"
  version: "1.0"
---

## Activation Contract

Load for React frontend work in this template, Laravel API integration, JWT authentication, new feature modules, or template-project scaffolding. Read `references/template-architecture.md` before changing structure or API behavior.

## Hard Rules

- Use React 19, Vite, Ant Design, Axios, React Router, TanStack React Query, and Zustand already selected by the template.
- Put feature code under `modules/<feature>/` with API, hook, and view boundaries; reuse `service/core`, `store`, `utils`, layouts, common components, and shared styles.
- Never use mocks in real modules, expose `.env` values, or invent API responses.
- Configure the API base URL to end in `/api`; use JWT and persist `authorization.token` consistently with the authenticated user.
- Refresh and logout are POST requests. Perform real logout before clearing session state.
- Enforce authentication and role guards for `cliente`, `empleado`, and `admin`.
- Handle Laravel pagination as `data.data`; preserve `estado`, `data`, `error`, `message`, and `details` response fields.

## Decision Gates

| Need | Choose |
|---|---|
| Server state | React Query, not duplicated Zustand state |
| UI/session state | Zustand only when shared across routes |
| New feature | `modules/<feature>/api`, hook, view; no cross-module shortcuts |
| Protected screen | Auth guard plus role guard when required |

## Execution Steps

1. Inspect the existing template boundaries and the API reference.
2. Reuse shared services, query conventions, guards, and components.
3. Implement the smallest complete module, including loading, errors, pagination, and authorization.
4. Verify endpoint methods, response nesting, session transitions, and exposed configuration.

## Output Contract

Return changed paths, API endpoints used, auth/role implications, and verification performed. Do not create backend changes or unrelated application scaffolding.

## References

- `references/template-architecture.md`
