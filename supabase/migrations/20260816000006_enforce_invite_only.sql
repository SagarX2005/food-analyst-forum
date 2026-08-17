-- Migration: 20260816000006_enforce_invite_only.sql
-- Description: Enforce invite-only membership by blocking auth.users inserts without a valid invitation.

CREATE OR REPLACE FUNCTION public.enforce_invite_only()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_has_invite BOOLEAN;
BEGIN
    -- Check if the email exists in the invitations table with status 'sent' or 'accepted'
    SELECT EXISTS (
        SELECT 1 FROM public.invitations
        WHERE LOWER(email) = LOWER(NEW.email)
        AND status IN ('sent', 'accepted')
    ) INTO v_has_invite;

    IF NOT v_has_invite THEN
        RAISE EXCEPTION 'INVITE_REQUIRED: Registration requires a valid invitation for %', NEW.email;
    END IF;

    RETURN NEW;
END;
$$;

-- Drop trigger if exists to prevent errors on re-run
DROP TRIGGER IF EXISTS trg_enforce_invite_only ON auth.users;

-- Create the BEFORE INSERT trigger on auth.users
CREATE TRIGGER trg_enforce_invite_only
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_invite_only();
