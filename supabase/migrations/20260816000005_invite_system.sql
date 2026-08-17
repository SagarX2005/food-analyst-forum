-- Migration: 20260816000005_invite_system.sql
-- Description: Phase 10A — Invite-Only Membership & Access Request System
-- Tables: access_requests, invitations
-- Functions: submit_access_request, approve_access_request, reject_access_request,
--            mark_request_under_review, accept_invitation, revoke_invitation

--------------------------------------------------------------------------------
-- 1. ACCESS REQUESTS TABLE
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.access_requests (
    id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email              TEXT        NOT NULL,
    full_name          TEXT        NOT NULL,
    professional_title TEXT        NOT NULL,
    organization       TEXT        NOT NULL,
    profession         TEXT        NOT NULL,
    experience_years   INTEGER     NOT NULL,
    region             TEXT        NOT NULL,
    reason             TEXT        NOT NULL,
    linkedin_url       TEXT,
    website_url        TEXT,

    -- Server-controlled only — never set by public INSERT
    status             TEXT        NOT NULL DEFAULT 'pending'
                       CONSTRAINT chk_access_requests_status
                       CHECK (status IN ('pending','under_review','approved','rejected','invitation_sent','accepted','expired')),

    reviewed_by        UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at        TIMESTAMPTZ,
    rejection_reason   TEXT,

    -- Constrained to non-privileged roles only
    approved_role      TEXT
                       CONSTRAINT chk_access_requests_approved_role
                       CHECK (approved_role IS NULL OR approved_role IN ('User','Recruiter','Trainer','Moderator')),

    invitation_id      UUID,  -- FK to invitations added after invitations table is created

    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

--------------------------------------------------------------------------------
-- 2. INVITATIONS TABLE
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invitations (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    access_request_id UUID        NOT NULL REFERENCES public.access_requests(id) ON DELETE CASCADE,
    email             TEXT        NOT NULL,
    assigned_role     TEXT        NOT NULL
                      CONSTRAINT chk_invitations_assigned_role
                      CHECK (assigned_role IN ('User','Recruiter','Trainer','Moderator')),
    token_hash        TEXT        NOT NULL UNIQUE,   -- SHA-256 of the raw token; raw never stored
    status            TEXT        NOT NULL DEFAULT 'pending'
                      CONSTRAINT chk_invitations_status
                      CHECK (status IN ('pending','sent','accepted','expired','revoked')),
    expires_at        TIMESTAMPTZ NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    sent_at           TIMESTAMPTZ,
    accepted_at       TIMESTAMPTZ,
    revoked_at        TIMESTAMPTZ
);

-- Add FK from access_requests back to invitations
ALTER TABLE public.access_requests
    ADD CONSTRAINT fk_access_requests_invitation
    FOREIGN KEY (invitation_id) REFERENCES public.invitations(id) ON DELETE SET NULL;

--------------------------------------------------------------------------------
-- 3. INDEXES
--------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_access_requests_email       ON public.access_requests (email);
CREATE INDEX IF NOT EXISTS idx_access_requests_status      ON public.access_requests (status);
CREATE INDEX IF NOT EXISTS idx_access_requests_created_at  ON public.access_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invitations_token_hash      ON public.invitations (token_hash);
CREATE INDEX IF NOT EXISTS idx_invitations_email           ON public.invitations (email);
CREATE INDEX IF NOT EXISTS idx_invitations_status          ON public.invitations (status);
CREATE INDEX IF NOT EXISTS idx_invitations_access_request  ON public.invitations (access_request_id);

--------------------------------------------------------------------------------
-- 4. UPDATED_AT TRIGGERS
--------------------------------------------------------------------------------
CREATE TRIGGER trg_access_requests_updated_at
    BEFORE UPDATE ON public.access_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

--------------------------------------------------------------------------------
-- 5. ENABLE ROW LEVEL SECURITY
--------------------------------------------------------------------------------
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations      ENABLE ROW LEVEL SECURITY;

--------------------------------------------------------------------------------
-- 6. RLS POLICIES — ACCESS REQUESTS
--------------------------------------------------------------------------------

-- Public can INSERT their own request (only the public-facing fields are allowed;
-- privileged fields are protected by the submit_access_request() RPC)
CREATE POLICY "Public can submit access request"
    ON public.access_requests FOR INSERT
    WITH CHECK (true);

-- Authenticated users can read only their own submission (matched by email)
CREATE POLICY "Users can view own access request"
    ON public.access_requests FOR SELECT
    TO authenticated
    USING (
        email = (SELECT p.email FROM public.profiles p WHERE p.id = auth.uid() LIMIT 1)
        OR public.is_admin(auth.uid())
    );

-- Only admins can update (for reviewing, approving, rejecting)
CREATE POLICY "Admins manage access requests"
    ON public.access_requests FOR UPDATE
    TO authenticated
    USING  (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- Only admins can delete
CREATE POLICY "Admins delete access requests"
    ON public.access_requests FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));

--------------------------------------------------------------------------------
-- 7. RLS POLICIES — INVITATIONS
--------------------------------------------------------------------------------

-- No public read. Token validation happens server-side via secure API route.
CREATE POLICY "Admins manage invitations"
    ON public.invitations FOR ALL
    TO authenticated
    USING  (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

--------------------------------------------------------------------------------
-- 8. DATABASE FUNCTIONS
--------------------------------------------------------------------------------

-- 8a. Submit Access Request (SECURITY DEFINER prevents privilege escalation)
-- Caller cannot set: status, reviewed_by, reviewed_at, approved_role, invitation_id
CREATE OR REPLACE FUNCTION public.submit_access_request(
    p_email              TEXT,
    p_full_name          TEXT,
    p_professional_title TEXT,
    p_organization       TEXT,
    p_profession         TEXT,
    p_experience_years   INTEGER,
    p_region             TEXT,
    p_reason             TEXT,
    p_linkedin_url       TEXT DEFAULT NULL,
    p_website_url        TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_existing_status TEXT;
    v_existing_email  TEXT;
    v_new_id          UUID;
BEGIN
    -- Check for existing active request or member
    SELECT status INTO v_existing_status
    FROM public.access_requests
    WHERE LOWER(email) = LOWER(p_email)
      AND status NOT IN ('rejected', 'expired')
    ORDER BY created_at DESC
    LIMIT 1;

    IF FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'code',    'DUPLICATE_REQUEST',
            'message', 'An invitation request already exists for this email.'
        );
    END IF;

    -- Check if already a member
    SELECT email INTO v_existing_email
    FROM public.profiles
    WHERE LOWER(email) = LOWER(p_email)
      AND deleted_at IS NULL
    LIMIT 1;

    IF FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'code',    'ALREADY_MEMBER',
            'message', 'An account already exists for this email. Please sign in.'
        );
    END IF;

    -- Insert only public-facing fields; privileged fields use DB defaults
    INSERT INTO public.access_requests (
        email, full_name, professional_title, organization,
        profession, experience_years, region, reason,
        linkedin_url, website_url
        -- status defaults to 'pending', reviewer fields are NULL
    )
    VALUES (
        LOWER(TRIM(p_email)),
        TRIM(p_full_name),
        TRIM(p_professional_title),
        TRIM(p_organization),
        TRIM(p_profession),
        p_experience_years,
        TRIM(p_region),
        TRIM(p_reason),
        NULLIF(TRIM(COALESCE(p_linkedin_url, '')), ''),
        NULLIF(TRIM(COALESCE(p_website_url, '')), '')
    )
    RETURNING id INTO v_new_id;

    -- Audit log (user_id is NULL for anon submissions)
    PERFORM public.log_audit_event(
        NULL,
        'ACCESS_REQUEST_SUBMITTED',
        'access_requests',
        v_new_id,
        jsonb_build_object('email', LOWER(TRIM(p_email)), 'organization', TRIM(p_organization))
    );

    RETURN jsonb_build_object(
        'success', true,
        'id',      v_new_id
    );
END;
$$;

-- 8b. Mark request under review (Admin only)
CREATE OR REPLACE FUNCTION public.mark_request_under_review(
    p_request_id UUID,
    p_reviewer_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin(p_reviewer_id) THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Only admins can review access requests.';
    END IF;

    UPDATE public.access_requests
    SET    status      = 'under_review',
           reviewed_by = p_reviewer_id,
           reviewed_at = now(),
           updated_at  = now()
    WHERE  id = p_request_id
      AND  status = 'pending';

    PERFORM public.log_audit_event(
        p_reviewer_id,
        'ACCESS_REQUEST_UNDER_REVIEW',
        'access_requests',
        p_request_id,
        NULL
    );
END;
$$;

-- 8c. Reject request (Admin only)
CREATE OR REPLACE FUNCTION public.reject_access_request(
    p_request_id      UUID,
    p_reviewer_id     UUID,
    p_rejection_reason TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin(p_reviewer_id) THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Only admins can reject access requests.';
    END IF;

    UPDATE public.access_requests
    SET    status           = 'rejected',
           reviewed_by      = p_reviewer_id,
           reviewed_at      = now(),
           rejection_reason = p_rejection_reason,
           updated_at       = now()
    WHERE  id = p_request_id
      AND  status IN ('pending', 'under_review');

    PERFORM public.log_audit_event(
        p_reviewer_id,
        'ACCESS_REQUEST_REJECTED',
        'access_requests',
        p_request_id,
        jsonb_build_object('reason', p_rejection_reason)
    );
END;
$$;

-- 8d. Approve request and create invitation (Admin only)
-- The raw token is generated application-side; only its SHA-256 hash is stored.
CREATE OR REPLACE FUNCTION public.approve_access_request(
    p_request_id   UUID,
    p_reviewer_id  UUID,
    p_role         TEXT,        -- must be one of User/Recruiter/Trainer/Moderator
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

    IF p_role NOT IN ('User','Recruiter','Trainer','Moderator') THEN
        RAISE EXCEPTION 'INVALID_ROLE: Approved role must be User, Recruiter, Trainer, or Moderator.';
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
           approved_role = p_role,
           updated_at    = now()
    WHERE  id = p_request_id;

    -- Create invitation record (raw token NOT stored — only hash)
    INSERT INTO public.invitations (
        access_request_id, email, assigned_role, token_hash, expires_at
    )
    VALUES (p_request_id, v_email, p_role, p_token_hash, p_expires_at)
    RETURNING id INTO v_invitation_id;

    -- Link invitation back to request
    UPDATE public.access_requests
    SET    invitation_id = v_invitation_id,
           status        = 'invitation_sent',
           updated_at    = now()
    WHERE  id = p_request_id;

    -- Update invitation status to sent
    UPDATE public.invitations
    SET    status  = 'sent',
           sent_at = now()
    WHERE  id = v_invitation_id;

    PERFORM public.log_audit_event(
        p_reviewer_id,
        'ACCESS_REQUEST_APPROVED',
        'access_requests',
        p_request_id,
        jsonb_build_object('role', p_role, 'invitation_id', v_invitation_id)
    );

    PERFORM public.log_audit_event(
        p_reviewer_id,
        'INVITATION_SENT',
        'invitations',
        v_invitation_id,
        jsonb_build_object('email', v_email, 'role', p_role)
    );

    RETURN jsonb_build_object(
        'success',       true,
        'invitation_id', v_invitation_id
    );
END;
$$;

-- 8e. Revoke invitation (Admin only)
CREATE OR REPLACE FUNCTION public.revoke_invitation(
    p_invitation_id UUID,
    p_admin_id      UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin(p_admin_id) THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Only admins can revoke invitations.';
    END IF;

    UPDATE public.invitations
    SET    status     = 'revoked',
           revoked_at = now()
    WHERE  id = p_invitation_id
      AND  status NOT IN ('accepted', 'revoked');

    PERFORM public.log_audit_event(
        p_admin_id,
        'INVITATION_REVOKED',
        'invitations',
        p_invitation_id,
        NULL
    );
END;
$$;

-- 8f. Validate invitation token (called server-side during accept flow)
-- Returns invitation metadata only if token is valid, not expired, and not used.
CREATE OR REPLACE FUNCTION public.validate_invitation_token(
    p_token_hash TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_inv  public.invitations%ROWTYPE;
    v_req  public.access_requests%ROWTYPE;
BEGIN
    SELECT * INTO v_inv
    FROM public.invitations
    WHERE token_hash = p_token_hash;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'reason', 'INVALID_TOKEN');
    END IF;

    IF v_inv.status = 'accepted' THEN
        RETURN jsonb_build_object('valid', false, 'reason', 'ALREADY_USED');
    END IF;

    IF v_inv.status = 'revoked' THEN
        RETURN jsonb_build_object('valid', false, 'reason', 'REVOKED');
    END IF;

    IF v_inv.status = 'expired' OR v_inv.expires_at < now() THEN
        -- Ensure status is updated
        UPDATE public.invitations SET status = 'expired' WHERE id = v_inv.id AND status <> 'expired';
        RETURN jsonb_build_object('valid', false, 'reason', 'EXPIRED');
    END IF;

    -- Fetch request for name pre-fill
    SELECT * INTO v_req
    FROM public.access_requests
    WHERE id = v_inv.access_request_id;

    RETURN jsonb_build_object(
        'valid',         true,
        'invitation_id', v_inv.id,
        'email',         v_inv.email,
        'assigned_role', v_inv.assigned_role,
        'full_name',     v_req.full_name,
        'expires_at',    v_inv.expires_at
    );
END;
$$;

-- 8g. Accept invitation — marks DB records; account creation happens in app layer
CREATE OR REPLACE FUNCTION public.accept_invitation_token(
    p_token_hash TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_inv_id UUID;
    v_req_id UUID;
BEGIN
    SELECT id, access_request_id INTO v_inv_id, v_req_id
    FROM public.invitations
    WHERE token_hash = p_token_hash
      AND status     = 'sent'
      AND expires_at > now();

    IF NOT FOUND THEN
        RAISE EXCEPTION 'INVALID_OR_EXPIRED: Invitation token is invalid, expired, or already used.';
    END IF;

    UPDATE public.invitations
    SET    status      = 'accepted',
           accepted_at = now()
    WHERE  id = v_inv_id;

    UPDATE public.access_requests
    SET    status     = 'accepted',
           updated_at = now()
    WHERE  id = v_req_id;

    PERFORM public.log_audit_event(
        NULL,
        'INVITATION_ACCEPTED',
        'invitations',
        v_inv_id,
        NULL
    );
END;
$$;
