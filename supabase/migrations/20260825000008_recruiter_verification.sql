-- Migration: 20260825000008_recruiter_verification.sql
-- Description: Phase 1 — Super Admin Recruiter Verification System

--------------------------------------------------------------------------------
-- 1. RECRUITER APPLICATIONS TABLE
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recruiter_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization_name TEXT NOT NULL,
    organization_website TEXT,
    organization_type TEXT,
    location TEXT,
    position TEXT NOT NULL,
    evidence TEXT,
    status TEXT NOT NULL DEFAULT 'pending' 
        CONSTRAINT chk_recruiter_applications_status 
        CHECK (status IN ('pending', 'approved', 'rejected', 'more_information_required')),
    rejection_reason TEXT,
    more_info_request TEXT,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

--------------------------------------------------------------------------------
-- 2. UNIQUE CONSTRAINT FOR ACTIVE APPLICATIONS
--------------------------------------------------------------------------------
-- Prevent users from having multiple active/pending applications
CREATE UNIQUE INDEX unique_active_recruiter_application 
ON public.recruiter_applications (user_id) 
WHERE status IN ('pending', 'more_information_required');

--------------------------------------------------------------------------------
-- 3. UPDATED AT TRIGGER
--------------------------------------------------------------------------------
CREATE TRIGGER trg_recruiter_applications_updated_at
    BEFORE UPDATE ON public.recruiter_applications
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

--------------------------------------------------------------------------------
-- 4. RLS POLICIES
--------------------------------------------------------------------------------
ALTER TABLE public.recruiter_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recruiter applications"
    ON public.recruiter_applications FOR SELECT
    USING (user_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Users can insert their own recruiter applications"
    ON public.recruiter_applications FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Super Admins can update recruiter applications"
    ON public.recruiter_applications FOR UPDATE
    USING (public.is_super_admin());

CREATE POLICY "Super Admins can delete recruiter applications"
    ON public.recruiter_applications FOR DELETE
    USING (public.is_super_admin());

--------------------------------------------------------------------------------
-- 5. RPC FUNCTIONS FOR ATOMIC OPERATIONS
--------------------------------------------------------------------------------

-- APPROVE
CREATE OR REPLACE FUNCTION public.approve_recruiter_application(p_app_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_recruiter_role_id UUID;
    v_status TEXT;
BEGIN
    -- Check authorization
    IF NOT public.is_super_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only Super Admins can approve recruiter applications.';
    END IF;

    -- Fetch application
    SELECT user_id, status INTO v_user_id, v_status
    FROM public.recruiter_applications
    WHERE id = p_app_id;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Application not found.';
    END IF;

    IF v_status NOT IN ('pending', 'more_information_required') THEN
        RAISE EXCEPTION 'Application is not in a reviewable state.';
    END IF;

    -- Get Recruiter role ID
    SELECT id INTO v_recruiter_role_id FROM public.roles WHERE name = 'Recruiter';
    IF v_recruiter_role_id IS NULL THEN
        RAISE EXCEPTION 'Recruiter role not found in database.';
    END IF;

    -- 1. Update application status
    UPDATE public.recruiter_applications
    SET status = 'approved',
        reviewed_by = auth.uid(),
        reviewed_at = now()
    WHERE id = p_app_id;

    -- 2. Update user role
    UPDATE public.profiles
    SET role_id = v_recruiter_role_id
    WHERE id = v_user_id;

    -- 3. Insert Audit Log
    INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, details)
    VALUES (auth.uid(), 'approve_recruiter_application', 'recruiter_applications', p_app_id, 
            jsonb_build_object('user_id', v_user_id, 'new_role', 'Recruiter'));

    -- 4. Insert Notification
    INSERT INTO public.notifications (user_id, type, title, message)
    VALUES (v_user_id, 'role_update', 'Recruiter Application Approved', 'Your application to become a Recruiter has been approved. You can now access the Recruiter Dashboard.');
END;
$$;


-- REJECT
CREATE OR REPLACE FUNCTION public.reject_recruiter_application(p_app_id UUID, p_reason TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_status TEXT;
BEGIN
    IF NOT public.is_super_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only Super Admins can reject recruiter applications.';
    END IF;

    SELECT user_id, status INTO v_user_id, v_status
    FROM public.recruiter_applications
    WHERE id = p_app_id;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Application not found.';
    END IF;

    IF v_status NOT IN ('pending', 'more_information_required') THEN
        RAISE EXCEPTION 'Application is not in a reviewable state.';
    END IF;

    UPDATE public.recruiter_applications
    SET status = 'rejected',
        rejection_reason = p_reason,
        reviewed_by = auth.uid(),
        reviewed_at = now()
    WHERE id = p_app_id;

    INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, details)
    VALUES (auth.uid(), 'reject_recruiter_application', 'recruiter_applications', p_app_id, 
            jsonb_build_object('user_id', v_user_id, 'reason', p_reason));

    INSERT INTO public.notifications (user_id, type, title, message)
    VALUES (v_user_id, 'role_update', 'Recruiter Application Rejected', 'Your application to become a Recruiter has been rejected. Reason: ' || p_reason);
END;
$$;


-- REQUEST MORE INFO
CREATE OR REPLACE FUNCTION public.request_more_info_recruiter_application(p_app_id UUID, p_request TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_status TEXT;
BEGIN
    IF NOT public.is_super_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only Super Admins can request more info for recruiter applications.';
    END IF;

    SELECT user_id, status INTO v_user_id, v_status
    FROM public.recruiter_applications
    WHERE id = p_app_id;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Application not found.';
    END IF;

    IF v_status NOT IN ('pending', 'more_information_required') THEN
        RAISE EXCEPTION 'Application is not in a reviewable state.';
    END IF;

    UPDATE public.recruiter_applications
    SET status = 'more_information_required',
        more_info_request = p_request,
        reviewed_by = auth.uid(),
        reviewed_at = now()
    WHERE id = p_app_id;

    INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, details)
    VALUES (auth.uid(), 'request_more_info_recruiter_application', 'recruiter_applications', p_app_id, 
            jsonb_build_object('user_id', v_user_id, 'request', p_request));

    INSERT INTO public.notifications (user_id, type, title, message)
    VALUES (v_user_id, 'role_update', 'Recruiter Application - More Information Required', 'More information is required for your Recruiter application: ' || p_request);
END;
$$;
