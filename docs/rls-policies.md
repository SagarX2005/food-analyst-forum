# Row Level Security (RLS) Documentation — Food Analyst Forum (FAF)

This document details the Row Level Security (RLS) policies implemented across all 17 database tables in **Food Analyst Forum (FAF)**.

---

## 🛡 Security Architecture & Best Practices

1. **Mandatory RLS**: RLS is explicitly enabled on every table (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).
2. **Least Privilege Principle**: Default state for all queries is access denied unless an explicit policy yields `TRUE`.
3. **Role Hierarchy**:
   - `Guest`: Anonymous unauthenticated user. Read-only access to published/public data.
   - `User`: Authenticated community member. Can create forum posts, comments, likes, apply for jobs, enroll in courses.
   - `Recruiter`: Corporate partner. Can post and manage jobs for their organization, review applicants.
   - `Trainer`: Certified instructor. Can create and manage courses for their organization.
   - `Moderator`: Community administrator. Can edit, archive, or remove inappropriate posts, comments, and news.
   - `Admin`: Platform manager. Can manage user accounts, organizations, categories, and review audit logs.
   - `Super Admin`: System superuser. Evaluated by `is_super_admin()` to bypass non-system restrictions.
4. **Defensive SQL Functions**: All security helper functions use `SECURITY DEFINER` with fixed `search_path = public` to prevent search-path high-jacking.

---

## 📊 RLS Policy Matrix

| Table                 | Guest (Anon) |       User        |     Recruiter     |        Trainer        |  Moderator   | Admin  | Super Admin |
| :-------------------- | :----------: | :---------------: | :---------------: | :-------------------: | :----------: | :----: | :---------: |
| `roles`               |     Read     |       Read        |       Read        |         Read          |     Read     |  Read  |     ALL     |
| `organizations`       |     Read     |   Read / Create   |    Manage Org     |         Read          |     Read     |  ALL   |     ALL     |
| `profiles`            |     Read     |    Update Own     |    Update Own     |      Update Own       |  Update Own  |  ALL   |     ALL     |
| `forum_categories`    |     Read     |       Read        |       Read        |         Read          |     Read     |  ALL   |     ALL     |
| `forum_posts`         |     Read     | Create / Edit Own | Create / Edit Own |   Create / Edit Own   | Moderate All |  ALL   |     ALL     |
| `forum_comments`      |     Read     | Create / Edit Own | Create / Edit Own |   Create / Edit Own   | Moderate All |  ALL   |     ALL     |
| `forum_likes`         |     Read     |    Manage Own     |    Manage Own     |      Manage Own       |  Manage Own  |  ALL   |     ALL     |
| `resource_categories` |     Read     |       Read        |       Read        |         Read          |     Read     |  ALL   |     ALL     |
| `resources`           | Public Read  | Upload / Edit Own | Upload / Edit Own |   Upload / Edit Own   |     Read     |  ALL   |     ALL     |
| `jobs`                | Public Read  |    Public Read    |  Manage Org Jobs  |      Public Read      | Public Read  |  ALL   |     ALL     |
| `job_applications`    |     None     | Create / View Own |  Review Org Apps  |         None          |     None     |  ALL   |     ALL     |
| `courses`             | Public Read  |    Public Read    |    Public Read    |  Manage Own Courses   | Public Read  |  ALL   |     ALL     |
| `course_enrollments`  |     None     | Enroll / View Own |       None        | View Course Enrollees |     None     |  ALL   |     ALL     |
| `news`                | Public Read  |    Public Read    |    Public Read    |      Public Read      | Manage News  |  ALL   |     ALL     |
| `contact_messages`    |    Create    |      Create       |      Create       |        Create         |    Create    | Manage |     ALL     |
| `notifications`       |     None     |    Manage Own     |    Manage Own     |      Manage Own       |  Manage Own  |  ALL   |     ALL     |
| `audit_logs`          |     None     |       None        |       None        |         None          |     None     |  Read  |     ALL     |

---

## 🔍 Detailed Policy Definitions

### `profiles`

- `Public profiles are viewable by everyone`: `USING (deleted_at IS NULL)`
- `Users can update their own profile`: `USING (id = auth.uid()) WITH CHECK (id = auth.uid())`
- `Admins can manage all profiles`: `USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()))`

### `forum_posts`

- `Public view published posts`: `USING ((status = 'published' AND deleted_at IS NULL) OR author_id = auth.uid() OR public.is_admin(auth.uid()))`
- `Authenticated users create posts`: `WITH CHECK (author_id = auth.uid())`
- `Authors and moderators update posts`: `USING (author_id = auth.uid() OR public.has_role(auth.uid(), 'Moderator') OR public.is_admin(auth.uid()))`
- `Authors and moderators delete posts`: `USING (author_id = auth.uid() OR public.has_role(auth.uid(), 'Moderator') OR public.is_admin(auth.uid()))`

### `jobs`

- `Public view active jobs`: `USING ((status = 'active' AND deleted_at IS NULL) OR recruiter_id = auth.uid() OR public.is_admin(auth.uid()))`
- `Recruiters and Admins create jobs`: `WITH CHECK (recruiter_id = auth.uid() AND (public.has_role(auth.uid(), 'Recruiter') OR public.is_admin(auth.uid())))`
- `Recruiters manage own jobs`: `USING (recruiter_id = auth.uid() OR public.is_admin(auth.uid()))`

### `courses`

- `Public view published courses`: `USING ((status = 'published' AND deleted_at IS NULL) OR trainer_id = auth.uid() OR public.is_admin(auth.uid()))`
- `Trainers and Admins create courses`: `WITH CHECK (trainer_id = auth.uid() AND (public.has_role(auth.uid(), 'Trainer') OR public.is_admin(auth.uid())))`
- `Trainers manage own courses`: `USING (trainer_id = auth.uid() OR public.is_admin(auth.uid()))`
