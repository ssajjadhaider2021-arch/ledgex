# SaaS folder structure, RBAC, and API design

This document describes a **scalable** layout for a TypeScript SaaS (React/Vite + Express/Prisma). Use it as a blueprint; align the existing `client/` and `server/` trees gradually.

---

## 1. Repository layout (monorepo)

```
ledgeX/
├── package.json                 # npm/pnpm workspaces, root scripts
├── client/                      # React SPA
├── server/                      # Express API
├── docs/                        # Architecture & runbooks (this file)
└── .github/                     # CI workflows (lint, test, deploy)
```

**Why monorepo:** shared types later (`packages/shared`), one version line, atomic PRs across UI + API.

---

## 2. Frontend (`client/`)

### 2.1 Target tree

```
client/
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── vite-env.d.ts
    │
    ├── app/                         # App wiring (providers, router shell)
    │   ├── providers.tsx            # QueryClient, Auth, theme
    │   └── router.tsx               # Route definitions, lazy routes
    │
    ├── pages/
    │   ├── landing/
    │   │   └── LandingPage.tsx
    │   ├── auth/
    │   │   ├── LoginPage.tsx
    │   │   ├── RegisterPage.tsx
    │   │   └── ForgotPasswordPage.tsx
    │   └── dashboard/
    │       ├── DashboardLayout.tsx       # Sidebar, header, outlet
    │       ├── admin/
    │       │   └── AdminHomePage.tsx
    │       ├── client/
    │       │   └── ClientHomePage.tsx
    │       ├── accountant/
    │       │   └── AccountantHomePage.tsx
    │       ├── companies/
    │       ├── documents/
    │       ├── chat/
    │       └── complaints/
    │
    ├── components/
    │   ├── ui/                    # Design system: Button, Input, Dialog…
    │   ├── layout/                # AppShell, Sidebar, TopNav, PageHeader
    │   └── dashboard/           # Domain widgets (KPI cards, tables, charts)
    │       ├── KpiCard.tsx
    │       ├── DataTable.tsx
    │       └── ...
    │
    ├── features/                  # Optional: slice by domain (co-locate hooks + API)
    │   ├── auth/
    │   │   ├── api.ts
    │   │   ├── hooks.ts
    │   │   └── components/
    │   ├── companies/
    │   ├── documents/
    │   ├── chat/
    │   └── complaints/
    │
    ├── hooks/                     # Cross-cutting hooks (useMediaQuery, useDebounce)
    ├── lib/                       # api client, formatters, cn(), env
    ├── contexts/                  # AuthContext, etc.
    ├── types/                     # Shared TS types (or import from packages/shared)
    └── assets/                    # Static images, fonts if not from CDN
```

### 2.2 Folder explanations (frontend)

| Path | Purpose |
|------|--------|
| `app/` | Bootstrapping: providers and **one place** for route tables; keeps `App.tsx` thin. |
| `pages/` | **Route-level** components only; minimal logic; load data via hooks or route loaders. |
| `pages/dashboard/*` | **Role-specific** areas mirror backend modules (admin vs client vs accountant). |
| `components/ui/` | Reusable primitives; no domain wording; stable for Storybook. |
| `components/layout/` | Shell chrome: nav, sidebar, responsive layout — not feature business rules. |
| `components/dashboard/` | Composed widgets used on dashboards (filters, charts, entity cards). |
| `features/` | Optional **vertical slices** when a domain grows (complaints + hooks + API together). |
| `lib/api.ts` | Central HTTP client: base URL, auth header, refresh, error normalization. |
| `types/` | DTOs aligned with API; later replace with generated types from OpenAPI. |

### 2.3 Frontend scaling practices

- **Lazy-load** route chunks: `React.lazy` + `Suspense` per dashboard area.
- **Colocate** tests: `Component.test.tsx` next to components or under `__tests__/`.
- **One API module per domain** (`features/*/api.ts`) to avoid a 3000-line `api.ts`.
- **RBAC in the router:** guard routes with `ProtectedRoute` + `RequireRole`; **hide** nav items by role — server still enforces truth.
- **Design tokens** in Tailwind (`theme.extend`) for colours, radii, spacing — one visual language.

---

## 3. Backend (`server/`)

### 3.1 Target tree (modular monolith)

```
server/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── index.ts                   # HTTP server + Socket.io attach + graceful shutdown
│   ├── config/
│   │   └── env.ts                 # Typed env (zod)
│   ├── lib/
│   │   └── prisma.ts              # Prisma singleton
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts     # JWT access verification
│   │   ├── rbac.middleware.ts     # requireRoles, requirePermission
│   │   ├── tenant.middleware.ts   # optional: org/company scope
│   │   ├── validate.middleware.ts # zod wrapper for body/query/params
│   │   └── error.middleware.ts
│   │
│   ├── modules/                   # One folder per business capability
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.repository.ts
│   │   │   └── auth.types.ts
│   │   ├── users/
│   │   ├── companies/
│   │   ├── documents/
│   │   ├── chat/
│   │   └── complaints/
│   │
│   ├── routes/
│   │   └── index.ts               # Mounts: /api/v1/auth, /api/v1/users, …
│   │
│   ├── socket/
│   │   └── chat.socket.ts
│   │
│   ├── jobs/                      # Optional: BullMQ / cron handlers
│   ├── integrations/              # External APIs (HMRC, email, storage)
│   ├── utils/
│   ├── errors/
│   └── types/
│
├── uploads/                       # Or use S3 only in prod
└── tsconfig.json
```

### 3.2 Folder explanations (backend)

| Path | Purpose |
|------|--------|
| `config/` | **Single source** for environment; fail fast at boot if invalid. |
| `middleware/` | Cross-cutting: auth, RBAC, validation, rate limit, request IDs, logging. |
| `modules/*` | **Vertical slice** per domain: routes → controller → service → repository. Keeps growth manageable without microservices prematurely. |
| `routes/index.ts` | **Composition root**: register versioned API prefixes and module routers. |
| `socket/` | Realtime (chat); same auth story as HTTP (JWT or signed handshake). |
| `jobs/` | Background work: OCR, emails, webhooks, retries — isolates long work from request thread. |
| `integrations/` | Third-party clients; swap providers without touching domain services. |
| `prisma/` | Schema + migrations; **only** repositories touch Prisma in a strict layering (optional: interfaces in domain, impl in infra). |

### 3.3 Backend scaling practices

- **API versioning:** `/api/v1/...` — breaking changes ship as v2 without killing mobile clients.
- **Idempotency** for writes that retry (payments, complaints): `Idempotency-Key` header.
- **Pagination** everywhere lists exist: `cursor` or `page` + `limit` + stable sort.
- **Observability:** structured logs (requestId, userId, companyId), metrics, tracing on hot paths.
- **Rate limiting** on auth and public endpoints; **helmet**, CORS allowlist.
- **Split when needed:** extract `chat` or `documents` to a service only when team/scale demands; modules map 1:1 to future services.

---

## 4. Role-based access control (RBAC)

### 4.1 Model

- **Roles (coarse):** `ADMIN`, `CLIENT`, `ACCOUNTANT` — stored on `User` (or a `UserRole` join if multiple roles per user later).
- **Permissions (fine, optional):** `documents:read`, `documents:write`, `complaints:manage`, `companies:admin` — map roles → permissions in code or DB (`RolePermission` table).

### 4.2 Rules

| Concern | Approach |
|---------|----------|
| **Authentication** | JWT access (short) + refresh (rotating); httpOnly cookie optional for refresh. |
| **Authorization** | Every protected route checks **role and/or permission**; **company scope** where data is tenant-bound (`companyId` on row + middleware). |
| **Admin** | Full platform; audit sensitive actions. |
| **Client** | CRUD on **own** company (if applicable), own documents, own complaints; chat with linked accountants. |
| **Accountant** | Access only **assigned** clients/companies; documents and chat within that scope. |

### 4.3 Implementation layers

1. **Prisma:** `companyId`, `userId`, relations; DB constraints and indexes for tenant isolation.
2. **Service layer:** `assertCanAccessCompany(user, companyId)` before returning data.
3. **Middleware:** `requireRoles(['ADMIN'])`, `requirePermission('complaints:read')`.
4. **Frontend:** UI hides actions; **never** rely on UI alone.

### 4.4 Evolving to multi-tenant

- Add `Organization` / `Company` and membership (`CompanyMember` with role).
- Resolve **active company** from header or path: `X-Company-Id` or `/api/v1/companies/:companyId/...`.

---

## 5. REST API structure

Base path: **`/api/v1`**. All JSON; errors: `{ "error": "message", "code": "OPTIONAL" }`.

### 5.1 Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register (restrict roles as policy allows). |
| POST | `/auth/login` | Returns access + refresh. |
| POST | `/auth/refresh` | Rotate refresh token. |
| POST | `/auth/logout` | Invalidate refresh. |
| GET | `/auth/me` | Current user + roles/permissions. |

### 5.2 Users

| Method | Path | Roles |
|--------|------|--------|
| GET | `/users` | Admin: list; optional filters. |
| GET | `/users/:id` | Self or Admin (or accountant if scoped). |
| PATCH | `/users/:id` | Self (profile) / Admin. |
| POST | `/users/:id/assign-accountant` | Admin — link accountant ↔ client. |

### 5.3 Companies

| Method | Path | Roles |
|--------|------|--------|
| GET | `/companies` | List companies current user can see. |
| POST | `/companies` | Client/Admin — create UK company profile. |
| GET | `/companies/:companyId` | Scoped read. |
| PATCH | `/companies/:companyId` | Scoped update. |
| GET | `/companies/:companyId/members` | Members of company. |
| POST | `/companies/:companyId/members` | Invite/add member (Admin or company admin). |

### 5.4 Documents

| Method | Path | Roles |
|--------|------|--------|
| GET | `/companies/:companyId/documents` | List with pagination. |
| POST | `/companies/:companyId/documents` | Upload metadata + presigned URL or multipart. |
| GET | `/companies/:companyId/documents/:documentId` | Metadata + download URL. |
| DELETE | `/companies/:companyId/documents/:documentId` | Soft delete optional. |
| POST | `/companies/:companyId/documents/:documentId/ocr` | Trigger or poll OCR job. |

*(Alternative flat shape: `/documents?companyId=` — pick one convention and keep it consistent.)*

### 5.5 Chat

| Method | Path | Description |
|--------|------|-------------|
| GET | `/chat/conversations` | List conversations for current user. |
| GET | `/chat/conversations/:id/messages` | Paginated messages. |
| POST | `/chat/conversations/:id/messages` | Send (if not only Socket.io). |

**WebSocket / Socket.io:** `chat:send`, `chat:message` events; align payloads with REST DTOs.

### 5.6 Complaints

| Method | Path | Roles |
|--------|------|--------|
| GET | `/complaints` | List (scoped: own for client; assigned for accountant; all for admin). |
| POST | `/complaints` | Create (client). |
| GET | `/complaints/:id` | Detail if scoped. |
| PATCH | `/complaints/:id` | Update status (admin/accountant); add notes. |
| POST | `/complaints/:id/comments` | Threaded discussion. |

### 5.7 Health & admin

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness. |
| GET | `/ready` | DB + dependencies. |

---

## 6. Mapping to current Ledgex codebase

The existing project uses a **flat** `server/src/controllers|services|repositories` layout and `client/src/pages|components`. That is valid. To migrate toward this doc:

1. Introduce **`/api/v1`** prefix in `server/src/routes/index.ts`.
2. Group new code under **`server/src/modules/*`**; move legacy files when touching them.
3. Split **`client/src/pages/dashboard`** into `admin/`, `client/`, `accountant/` subfolders and add **`companies/`**, **`complaints/`** pages when implemented.
4. Add **Complaints** and **Companies** Prisma models + module folders when you build those features.

---

## 7. Quick reference — scaling checklist

- [ ] Versioned API (`/api/v1`).
- [ ] RBAC at middleware + service + DB scope.
- [ ] Pagination + filters on all lists.
- [ ] Background jobs for slow work (OCR, email).
- [ ] Migrations as source of truth; seed for local/dev roles.
- [ ] Frontend route guards + feature-level API modules.
- [ ] CI: lint, typecheck, test, migrate check.

This structure stays **modular monolith**-friendly and supports later extraction of services (auth, chat, documents) without rewriting business rules.
