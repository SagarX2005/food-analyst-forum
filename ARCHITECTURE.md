# 📐 Architecture Principles & Standards — Food Analyst Forum

This document outlines the architectural blueprint, design patterns, and engineering standards for the **Food Analyst Forum** platform.

---

## 🎯 Architectural Goals

1. **Scalability**: Feature-based isolation allows multi-team contributions without domain coupling.
2. **Maintainability**: Clear separation between UI components, state hooks, and API data access layers.
3. **Type Safety**: End-to-end type safety from Supabase database schemas to client components.
4. **Performance**: Leveraging Next.js 15 App Router React Server Components (RSC) for zero-JS-bundle server rendering.

---

## 🏛 Layering & Separation of Concerns

```
┌─────────────────────────────────────────────────────────┐
│                     Presentation Layer                  │
│       App Router (RSC)  │  Client Components (UI)       │
└───────────────────────────┬─────────────────────────────┘
                            │ Calls Hooks / Services
┌───────────────────────────▼─────────────────────────────┐
│                       Domain Layer                      │
│     Features (Auth, Analytics, Forum, Food-Analysis)    │
│     Custom Hooks  │  Zod Schemas  │  Domain Types       │
└───────────────────────────┬─────────────────────────────┘
                            │ Uses Infrastructure Client
┌───────────────────────────▼─────────────────────────────┐
│                    Infrastructure Layer                 │
│      ApiClient  │  Supabase Client  │  Env Validation   │
└─────────────────────────────────────────────────────────┘
```

### 1. Presentation Layer (`app/`, `components/`)

- **Server Components (Default)**: Fetch data on the server without client bundle overhead.
- **Client Components (`"use client"`)**: Isolated to interactive components (forms, buttons, modals, interactive charts).

### 2. Domain Feature Layer (`features/`)

Each business domain is encapsulated in a dedicated directory containing:

- `components/`: UI specific to that feature domain.
- `hooks/`: Custom React Query hooks or state logic.
- `services/`: API client classes extending `BaseService`.
- `types.ts`: Zod validation schemas and TypeScript definitions.

### 3. Infrastructure Layer (`lib/`, `services/`)

- `ApiClient`: Standardized fetch wrapper handling request headers, error status code mapping, and JSON parsing.
- `Supabase`: Browser (`client.ts`), Server (`server.ts`), and Middleware (`middleware.ts`) instances via `@supabase/ssr`.

---

## 🛡 SOLID & Clean Code Rules

- **Single Responsibility Principle (SRP)**: Components render UI; services handle data requests; Zod handles validation.
- **Open/Closed Principle (OCP)**: UI primitives in `components/ui/` use variant props (`cva`) for extension without code modification.
- **Dependency Inversion**: Services inherit from `BaseService` and depend on the `ApiClient` abstraction rather than raw `fetch`.
- **DRY (Don't Repeat Yourself)**: Shared utilities in `lib/utils.ts` and shared custom hooks in `hooks/`.
