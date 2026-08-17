-- Migration: 20260808000001_functions_and_triggers.sql
-- Description: Database Functions, Automated Triggers, Audit Logging, and Notifications.

--------------------------------------------------------------------------------
-- 1. ROLE HELPER FUNCTIONS
--------------------------------------------------------------------------------

-- Get User Role Name
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_role_name TEXT;
BEGIN
    IF p_user_id IS NULL THEN
        RETURN 'Guest';
    END IF;

    SELECT r.name INTO v_role_name
    FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = p_user_id AND p.deleted_at IS NULL;

    RETURN COALESCE(v_role_name, 'User');
END;
$$;

-- Check if User Has Specific Role
CREATE OR REPLACE FUNCTION public.has_role(p_user_id UUID, p_role_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_current_role TEXT;
BEGIN
    v_current_role := public.get_user_role(p_user_id);
    
    -- Super Admin has access to all roles
    IF v_current_role = 'Super Admin' THEN
        RETURN TRUE;
    END IF;

    RETURN v_current_role = p_role_name;
END;
$$;

-- Check if User is Admin or Super Admin
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_role TEXT;
BEGIN
    v_role := public.get_user_role(p_user_id);
    RETURN v_role IN ('Admin', 'Super Admin');
END;
$$;

-- Check if User is Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN public.get_user_role(p_user_id) = 'Super Admin';
END;
$$;

--------------------------------------------------------------------------------
-- 2. UTILITY & ANALYTICS FUNCTIONS
--------------------------------------------------------------------------------

-- Update Updated At Timestamp Trigger Function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Generic Soft Delete Function
CREATE OR REPLACE FUNCTION public.soft_delete(p_table_name TEXT, p_record_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT (public.is_admin(auth.uid()) OR auth.uid() IS NOT NULL) THEN
        RAISE EXCEPTION 'Unauthorized to soft delete record.';
    END IF;

    EXECUTE format('UPDATE public.%I SET deleted_at = now(), updated_at = now() WHERE id = %L', p_table_name, p_record_id);
END;
$$;

-- Increment Views Counter Function
CREATE OR REPLACE FUNCTION public.increment_views(p_table_name TEXT, p_record_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_table_name NOT IN ('forum_posts', 'jobs', 'news', 'courses') THEN
        RAISE EXCEPTION 'Invalid table for view counter increment.';
    END IF;

    EXECUTE format('UPDATE public.%I SET views_count = views_count + 1 WHERE id = %L', p_table_name, p_record_id);
END;
$$;

-- Increment Downloads Counter Function
CREATE OR REPLACE FUNCTION public.increment_downloads(p_record_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.resources
    SET downloads_count = downloads_count + 1
    WHERE id = p_record_id AND deleted_at IS NULL;
END;
$$;

-- Toggle Forum Like Function
CREATE OR REPLACE FUNCTION public.toggle_like(p_post_id UUID, p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'Must be authenticated to like a post.';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.forum_likes
        WHERE post_id = p_post_id AND user_id = p_user_id
    ) INTO v_exists;

    IF v_exists THEN
        DELETE FROM public.forum_likes
        WHERE post_id = p_post_id AND user_id = p_user_id;
        RETURN FALSE;
    ELSE
        INSERT INTO public.forum_likes (post_id, user_id)
        VALUES (p_post_id, p_user_id);
        RETURN TRUE;
    END IF;
END;
$$;

--------------------------------------------------------------------------------
-- 3. NOTIFICATION & AUDIT LOG FUNCTIONS
--------------------------------------------------------------------------------

-- Create Notification Helper Function
CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_link TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (p_user_id, p_type, p_title, p_message, p_link)
    RETURNING id INTO v_notification_id;

    RETURN v_notification_id;
END;
$$;

-- Log Audit Event Helper Function
CREATE OR REPLACE FUNCTION public.log_audit_event(
    p_user_id UUID,
    p_action TEXT,
    p_entity_type TEXT,
    p_entity_id UUID,
    p_details JSONB DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
    VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_details, p_ip_address)
    RETURNING id INTO v_log_id;

    RETURN v_log_id;
END;
$$;

--------------------------------------------------------------------------------
-- 4. AUTOMATED TRIGGERS
--------------------------------------------------------------------------------

-- Trigger: Provision profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_default_role_id UUID;
    v_full_name TEXT;
BEGIN
    SELECT id INTO v_default_role_id
    FROM public.roles
    WHERE name = 'User';

    v_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
    );

    INSERT INTO public.profiles (id, email, full_name, role_id)
    VALUES (NEW.id, NEW.email, v_full_name, v_default_role_id)
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        updated_at = now();

    PERFORM public.log_audit_event(
        NEW.id,
        'USER_REGISTERED',
        'profiles',
        NEW.id,
        jsonb_build_object('email', NEW.email)
    );

    RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Forum Likes Count Maintenance
CREATE OR REPLACE FUNCTION public.handle_forum_like_changed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.forum_posts
        SET likes_count = likes_count + 1
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.forum_posts
        SET likes_count = GREATEST(0, likes_count - 1)
        WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_forum_likes_changed ON public.forum_likes;
CREATE TRIGGER trg_forum_likes_changed
    AFTER INSERT OR DELETE ON public.forum_likes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_forum_like_changed();

-- Trigger: Forum Comments Count & Notification
CREATE OR REPLACE FUNCTION public.handle_forum_comment_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_post_author_id UUID;
    v_post_title TEXT;
BEGIN
    -- Update comments count
    UPDATE public.forum_posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id
    RETURNING author_id, title INTO v_post_author_id, v_post_title;

    -- Notify post author if commenter is not post author
    IF v_post_author_id IS NOT NULL AND v_post_author_id <> NEW.author_id THEN
        PERFORM public.create_notification(
            v_post_author_id,
            'FORUM_COMMENT',
            'New Comment on Your Post',
            format('Someone commented on your post "%s"', v_post_title),
            format('/forum/posts/%s', NEW.post_id)
        );
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_forum_comment_created ON public.forum_comments;
CREATE TRIGGER trg_forum_comment_created
    AFTER INSERT ON public.forum_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_forum_comment_created();

-- Trigger: Job Application Notification
CREATE OR REPLACE FUNCTION public.handle_job_application_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_recruiter_id UUID;
    v_job_title TEXT;
BEGIN
    UPDATE public.jobs
    SET applications_count = applications_count + 1
    WHERE id = NEW.job_id
    RETURNING recruiter_id, title INTO v_recruiter_id, v_job_title;

    IF v_recruiter_id IS NOT NULL THEN
        PERFORM public.create_notification(
            v_recruiter_id,
            'JOB_APPLICATION',
            'New Job Application',
            format('A candidate submitted an application for "%s"', v_job_title),
            format('/jobs/%s/applications', NEW.job_id)
        );
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_job_application_created ON public.job_applications;
CREATE TRIGGER trg_job_application_created
    AFTER INSERT ON public.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_job_application_created();

-- Trigger: Course Enrollment Notification
CREATE OR REPLACE FUNCTION public.handle_course_enrollment_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_trainer_id UUID;
    v_course_title TEXT;
BEGIN
    UPDATE public.courses
    SET enrollments_count = enrollments_count + 1
    WHERE id = NEW.course_id
    RETURNING trainer_id, title INTO v_trainer_id, v_course_title;

    IF v_trainer_id IS NOT NULL THEN
        PERFORM public.create_notification(
            v_trainer_id,
            'COURSE_ENROLLMENT',
            'New Course Enrollment',
            format('A student enrolled in your course "%s"', v_course_title),
            format('/courses/%s/students', NEW.course_id)
        );
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_course_enrollment_created ON public.course_enrollments;
CREATE TRIGGER trg_course_enrollment_created
    AFTER INSERT ON public.course_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_course_enrollment_created();

--------------------------------------------------------------------------------
-- 5. ATTACH UPDATED_AT TRIGGERS
--------------------------------------------------------------------------------
CREATE TRIGGER trg_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_forum_categories_updated_at BEFORE UPDATE ON public.forum_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_forum_posts_updated_at BEFORE UPDATE ON public.forum_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_forum_comments_updated_at BEFORE UPDATE ON public.forum_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_resource_categories_updated_at BEFORE UPDATE ON public.resource_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_course_enrollments_updated_at BEFORE UPDATE ON public.course_enrollments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_contact_messages_updated_at BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
