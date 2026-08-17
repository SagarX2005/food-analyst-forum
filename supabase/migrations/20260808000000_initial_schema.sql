-- Migration: 20260808000000_initial_schema.sql
-- Description: Initial schema for Food Analyst Forum (FAF) - 17 Tables, Extensions, Foreign Keys, Indexes.

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

--------------------------------------------------------------------------------
-- 1. ROLES
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT chk_roles_name CHECK (name IN ('Guest', 'User', 'Recruiter', 'Trainer', 'Moderator', 'Admin', 'Super Admin'))
);

--------------------------------------------------------------------------------
-- 2. ORGANIZATIONS
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    logo_url TEXT,
    website TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT chk_organizations_type CHECK (type IN ('Laboratories', 'Companies', 'Institutes', 'Training Centers'))
);

--------------------------------------------------------------------------------
-- 3. PROFILES
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    headline TEXT,
    bio TEXT,
    phone TEXT,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    deleted_at TIMESTAMPTZ
);

--------------------------------------------------------------------------------
-- 4. FORUM CATEGORIES
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.forum_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

--------------------------------------------------------------------------------
-- 5. FORUM POSTS
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.forum_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.forum_categories(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'published' NOT NULL,
    views_count INTEGER DEFAULT 0 NOT NULL,
    likes_count INTEGER DEFAULT 0 NOT NULL,
    comments_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT chk_forum_posts_status CHECK (status IN ('draft', 'published', 'archived'))
);

--------------------------------------------------------------------------------
-- 6. FORUM COMMENTS
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.forum_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.forum_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    deleted_at TIMESTAMPTZ
);

--------------------------------------------------------------------------------
-- 7. FORUM LIKES
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.forum_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT uq_forum_likes_post_user UNIQUE (post_id, user_id)
);

--------------------------------------------------------------------------------
-- 8. RESOURCE CATEGORIES
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resource_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

--------------------------------------------------------------------------------
-- 9. RESOURCES
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.resource_categories(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size_bytes BIGINT,
    access_level TEXT DEFAULT 'public' NOT NULL,
    downloads_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT chk_resources_access_level CHECK (access_level IN ('public', 'authenticated', 'restricted'))
);

--------------------------------------------------------------------------------
-- 10. JOBS
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    job_type TEXT DEFAULT 'full_time' NOT NULL,
    experience_level TEXT,
    salary_range TEXT,
    status TEXT DEFAULT 'active' NOT NULL,
    views_count INTEGER DEFAULT 0 NOT NULL,
    applications_count INTEGER DEFAULT 0 NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT chk_jobs_type CHECK (job_type IN ('full_time', 'part_time', 'contract', 'internship', 'remote')),
    CONSTRAINT chk_jobs_status CHECK (status IN ('draft', 'active', 'closed', 'expired'))
);

--------------------------------------------------------------------------------
-- 11. JOB APPLICATIONS
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resume_url TEXT NOT NULL,
    cover_letter TEXT,
    status TEXT DEFAULT 'submitted' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT uq_job_applications_job_applicant UNIQUE (job_id, applicant_id),
    CONSTRAINT chk_job_applications_status CHECK (status IN ('submitted', 'reviewing', 'shortlisted', 'rejected', 'hired'))
);

--------------------------------------------------------------------------------
-- 12. COURSES
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    trainer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    cover_image_url TEXT,
    level TEXT DEFAULT 'beginner' NOT NULL,
    duration_hours NUMERIC(6, 2) DEFAULT 0.00 NOT NULL,
    price NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    status TEXT DEFAULT 'published' NOT NULL,
    enrollments_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT chk_courses_level CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    CONSTRAINT chk_courses_status CHECK (status IN ('draft', 'published', 'archived'))
);

--------------------------------------------------------------------------------
-- 13. COURSE ENROLLMENTS
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' NOT NULL,
    progress_percent INTEGER DEFAULT 0 NOT NULL,
    enrolled_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    completed_at TIMESTAMPTZ,
    CONSTRAINT uq_course_enrollments_course_student UNIQUE (course_id, student_id),
    CONSTRAINT chk_course_enrollments_status CHECK (status IN ('active', 'completed', 'cancelled')),
    CONSTRAINT chk_course_enrollments_progress CHECK (progress_percent >= 0 AND progress_percent <= 100)
);

--------------------------------------------------------------------------------
-- 14. NEWS
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    status TEXT DEFAULT 'published' NOT NULL,
    views_count INTEGER DEFAULT 0 NOT NULL,
    published_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT chk_news_status CHECK (status IN ('draft', 'published', 'archived'))
);

--------------------------------------------------------------------------------
-- 15. CONTACT MESSAGES
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' NOT NULL,
    replied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT chk_contact_messages_status CHECK (status IN ('new', 'in_progress', 'resolved', 'archived'))
);

--------------------------------------------------------------------------------
-- 16. NOTIFICATIONS
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

--------------------------------------------------------------------------------
-- 17. AUDIT LOGS
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

--------------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE OPTIMIZATION
--------------------------------------------------------------------------------

-- Profiles Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_role_id ON public.profiles (role_id);
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON public.profiles (organization_id);

-- Organizations Indexes
CREATE INDEX IF NOT EXISTS idx_organizations_type ON public.organizations (type);
CREATE INDEX IF NOT EXISTS idx_organizations_verified ON public.organizations (verified);

-- Forum Posts & Comments Indexes
CREATE INDEX IF NOT EXISTS idx_forum_posts_author_id ON public.forum_posts (author_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category_id ON public.forum_posts (category_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_status ON public.forum_posts (status);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON public.forum_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_title_trgm ON public.forum_posts USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_forum_comments_post_id ON public.forum_comments (post_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_author_id ON public.forum_comments (author_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_parent_id ON public.forum_comments (parent_id);

CREATE INDEX IF NOT EXISTS idx_forum_likes_post_id ON public.forum_likes (post_id);
CREATE INDEX IF NOT EXISTS idx_forum_likes_user_id ON public.forum_likes (user_id);

-- Resources Indexes
CREATE INDEX IF NOT EXISTS idx_resources_uploader_id ON public.resources (uploader_id);
CREATE INDEX IF NOT EXISTS idx_resources_category_id ON public.resources (category_id);
CREATE INDEX IF NOT EXISTS idx_resources_access_level ON public.resources (access_level);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources (created_at DESC);

-- Jobs & Applications Indexes
CREATE INDEX IF NOT EXISTS idx_jobs_organization_id ON public.jobs (organization_id);
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter_id ON public.jobs (recruiter_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs (status);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON public.jobs (job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications (job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON public.job_applications (applicant_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications (status);

-- Courses & Enrollments Indexes
CREATE INDEX IF NOT EXISTS idx_courses_trainer_id ON public.courses (trainer_id);
CREATE INDEX IF NOT EXISTS idx_courses_organization_id ON public.courses (organization_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses (status);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON public.course_enrollments (course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_student_id ON public.course_enrollments (student_id);

-- News Indexes
CREATE INDEX IF NOT EXISTS idx_news_author_id ON public.news (author_id);
CREATE INDEX IF NOT EXISTS idx_news_status ON public.news (status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news (published_at DESC);

-- Notifications & Audit Logs Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON public.notifications (user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs (entity_type, entity_id);
