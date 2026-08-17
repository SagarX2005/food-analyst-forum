# Supabase Auth & Backend Developer Guide — Food Analyst Forum (FAF)

This guide provides technical instructions for working with the Supabase backend foundation, authentication, SSR integration, custom database functions, triggers, and local development migrations.

---

## 🔐 Authentication Architecture

### Overview
Food Analyst Forum leverages **Supabase Auth** integrated with Next.js 15 App Router using `@supabase/ssr`.

### Supported Authentication Methods
1. **Email & Password Registration**: Trigger `on_auth_user_created` provisions user profile in `public.profiles`.
2. **Email Sign-In**: Authenticates session and sets HTTP-only cookies via `@supabase/ssr`.
3. **Google OAuth**: Social login with automatic profile provisioning.
4. **Email Verification**: Required email verification flow.
5. **Password Reset & Session Refresh**: Managed via `AuthService.resetPassword()` and `AuthService.refreshSession()`.

---

## 🛠 Client & Server Supabase Helpers

### 1. Browser Client (`lib/supabase/client.ts`)
Used in Client Components (`"use client"`):
```typescript
import { createClient } from "@lib/supabase/client";

const supabase = createClient();
```

### 2. Server Client (`lib/supabase/server.ts`)
Used in Server Components, Server Actions, and Route Handlers:
```typescript
import { createClient } from "@lib/supabase/server";

const supabase = await createClient();
```

### 3. Server Admin Client (`lib/supabase/admin.ts`)
Bypasses RLS using `SUPABASE_SERVICE_ROLE_KEY` for secure server-side administrative tasks:
```typescript
import { createAdminClient } from "@lib/supabase/admin";

const adminSupabase = createAdminClient();
```

### 4. Auth Service (`services/authService.ts`)
High-level authentication and authorization helper methods:
```typescript
import { AuthService } from "@services/authService";

// Register user
await AuthService.registerWithEmail({ email, password, fullName });

// Get current profile with role & org
const profile = await AuthService.getCurrentProfile();

// Role check
const isRecruiter = await AuthService.checkUserRole("Recruiter");
```

---

## ⚡ Database Functions & Triggers

### Core Functions
- `has_role(p_user_id, p_role_name)`: Evaluates if a user has a specific role (Super Admin returns true for all).
- `is_admin(p_user_id)`: Checks if a user is an `Admin` or `Super Admin`.
- `increment_views(p_table_name, p_record_id)`: Increments view counter on `forum_posts`, `jobs`, `news`, or `courses`.
- `increment_downloads(p_record_id)`: Increments resource download counter.
- `toggle_like(p_post_id, p_user_id)`: Toggles post likes safely.
- `create_notification(p_user_id, p_type, p_title, p_message, p_link)`: Generates in-app notifications.
- `log_audit_event(p_user_id, p_action, p_entity_type, p_entity_id, p_details)`: Inserts immutable audit records.

### Automated Triggers
- `on_auth_user_created`: Auto-creates profile on user signup.
- `trg_forum_likes_changed`: Keeps `forum_posts.likes_count` synchronized.
- `trg_forum_comment_created`: Increments post comment count and sends notification to post author.
- `trg_job_application_created`: Increments job applications count and notifies recruiter.
- `trg_course_enrollment_created`: Increments course enrollments count and notifies trainer.

---

## 🚀 Local Developer Setup & Migrations

### Prerequisites
- Node.js >= 20
- Docker (for local Supabase CLI execution)
- Supabase CLI installed (`npx supabase` or `supabase`)

### Step-by-Step Setup

1. **Environment Variables**:
   Copy `.env.example` to `.env.local` and populate:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME="Food Analyst Forum"
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key
   ```

2. **Start Local Supabase**:
   ```bash
   npx supabase start
   ```

3. **Apply Database Migrations**:
   ```bash
   npx supabase db reset
   ```
   *This executes all migration scripts in `supabase/migrations/` and seeds data from `supabase/seed.sql`.*

4. **Regenerate TypeScript Types**:
   ```bash
   npm run supabase:generate-types
   ```
