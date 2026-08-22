
-- Remove Guest, Trainer, and Moderator roles from public.roles

-- First, drop constraints that enforce the old allowed roles
ALTER TABLE public.roles DROP CONSTRAINT IF EXISTS chk_roles_name;
ALTER TABLE public.access_requests DROP CONSTRAINT IF EXISTS chk_access_requests_approved_role;
ALTER TABLE public.invitations DROP CONSTRAINT IF EXISTS chk_invitations_assigned_role;

-- Delete the roles from the roles table
DELETE FROM public.roles WHERE name IN ('Guest', 'Trainer', 'Moderator');

-- Add new constraints strictly enforcing only User, Recruiter, Admin, Super Admin
ALTER TABLE public.roles ADD CONSTRAINT chk_roles_name CHECK (name IN ('User', 'Recruiter', 'Admin', 'Super Admin'));
ALTER TABLE public.access_requests ADD CONSTRAINT chk_access_requests_approved_role CHECK (approved_role IS NULL OR approved_role IN ('User', 'Recruiter'));
ALTER TABLE public.invitations ADD CONSTRAINT chk_invitations_assigned_role CHECK (assigned_role IN ('User', 'Recruiter'));

-- Re-create the approve_access_request function to update the role validation check
CREATE OR REPLACE FUNCTION public.approve_access_request(
    p_request_id   UUID,
    p_reviewer_id  UUID,
    p_role         TEXT,        -- must be one of User/Recruiter
    p_token_hash   TEXT,        -- SHA-256(raw_token) — raw token never reaches DB
    p_expires_at   TIMESTAMPTZ
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_email       TEXT;
    v_invitation_id UUID;
BEGIN
    -- Security checks
    IF NOT public.is_admin(p_reviewer_id) THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Only admins can approve access requests.';
    END IF;

    IF p_role NOT IN ('User','Recruiter') THEN
        RAISE EXCEPTION 'INVALID_ROLE: Approved role must be User or Recruiter.';
    END IF;

    -- Fetch email
    SELECT email INTO v_email
    FROM public.access_requests
    WHERE id = p_request_id
      AND status IN ('pending', 'under_review');

    IF NOT FOUND THEN
        RAISE EXCEPTION 'REQUEST_NOT_FOUND: Access request not found or not in reviewable state.';
    END IF;

    -- Update access request
    UPDATE public.access_requests
    SET    status        = 'approved',
           reviewed_by   = p_reviewer_id,
           reviewed_at   = now(),
           approved_role = p_role
    WHERE  id = p_request_id;

    -- Create invitation
    INSERT INTO public.invitations (access_request_id, email, token_hash, assigned_role, expires_at, created_by)
    VALUES (p_request_id, v_email, p_token_hash, p_role, p_expires_at, p_reviewer_id)
    RETURNING id INTO v_invitation_id;

    -- Link request to invitation
    UPDATE public.access_requests
    SET    invitation_id = v_invitation_id
    WHERE  id = p_request_id;

    PERFORM public.log_audit_event(
        p_reviewer_id,
        'ACCESS_REQUEST_APPROVED',
        'access_requests',
        p_request_id,
        jsonb_build_object('assigned_role', p_role, 'invitation_id', v_invitation_id)
    );

    RETURN jsonb_build_object(
        'success', true,
        'invitation_id', v_invitation_id,
        'email', v_email,
        'role', p_role
    );
END;
$$;

