# 🌿 Food Analyst Forum (FAF)

An enterprise-grade SaaS platform built for food safety analysts, food scientists, regulatory specialists, and industry professionals.

[![Next.js 15](https://img.shields.io/badge/Next.js-15_App_Router-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript 5.7](https://img.shields.io/badge/TypeScript-5.7_Strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-SSR_&_Auth-3FCF8E?logo=supabase)](https://supabase.com/)

---

## 🏛 Architecture Overview

Food Analyst Forum uses a **Feature-First Clean Architecture** built on Next.js 15 App Router. The repository separates core framework infrastructure from modular domain features to achieve enterprise scalability, high test coverage, and strict maintainability.

```
food-analyst-forum/
├── app/                  # Next.js 15 App Router routes & layouts
├── components/           # Shared UI primitives & global layouts
│   ├── ui/               # Radix/shadcn design primitives
│   ├── shared/           # Cross-cutting UI (Header, Footer, EmptyState)
│   └── layouts/          # Top-level page layout templates
├── features/             # Domain feature modules (Auth, Analytics, Forum, Food Analysis)
│   ├── [feature_name]/
│   │   ├── components/   # Feature-specific components
│   │   ├── hooks/        # Feature custom hooks
│   │   ├── services/     # Feature API / data access services
│   │   └── types.ts      # Feature Zod schemas & TypeScript types
├── lib/                  # Infrastructure configurations & wrappers
│   ├── supabase/         # SSR-safe Supabase browser/server/middleware clients
│   ├── env.ts            # Zod-validated environment config
│   └── utils.ts          # Utility functions
├── services/             # Core HTTP & API client abstraction
├── providers/            # React context providers (QueryClient, Theme)
├── types/                # Global interfaces & generated Supabase DB schemas
├── constants/            # Application routes & constants
├── hooks/                # Shared application custom hooks
├── utils/                # Pure utility functions & formatters
├── styles/               # Tailwind CSS v4 globals & tokens
├── supabase/             # Supabase CLI configuration & migrations
└── middleware.ts         # Next.js middleware for auth session management
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: `^20.0.0` or `>=22.0.0`
- **Package Manager**: `pnpm ^11.0.0`

### 1. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm run dev` | Starts Next.js development server with hot-reloading |
| `pnpm run build` | Builds optimized production bundle |
| `pnpm run start` | Runs production server |
| `pnpm run type-check` | Runs strict TypeScript compiler check (`tsc --noEmit`) |
| `pnpm run lint` | Runs ESLint checks across all files |
| `pnpm run lint:fix` | Automatically fixes auto-fixable ESLint issues |
| `pnpm run format:check` | Verifies code formatting with Prettier |
| `pnpm run format` | Formats codebase with Prettier |
| `pnpm run test` | Runs unit & component tests via Vitest |
| `pnpm run test:watch` | Runs Vitest in interactive watch mode |
| `pnpm run test:coverage` | Generates Vitest code coverage reports |
| `pnpm run test:e2e` | Runs end-to-end tests via Playwright |

---

## 🔒 Security & Environment Variables

Environment variables are strictly parsed at runtime using **Zod** in [lib/env.ts](file:///d:/FAF/lib/env.ts).

Required public variables:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📜 Coding & Quality Standards

- **Strict TypeScript**: `noImplicitAny: true`, `strictNullChecks: true`, `noUncheckedIndexedAccess: true`.
- **Naming Conventions**:
  - `PascalCase` for Components, Interfaces, Types.
  - `camelCase` for variables, functions, hooks, service instances.
  - `kebab-case` for file basenames and route paths.
  - `UPPER_CASE` for global immutable constants.
- **Git Commits**: Conventional Commits standard (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
