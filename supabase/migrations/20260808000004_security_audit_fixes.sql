-- Migration: 20260808000004_security_audit_fixes.sql
-- Description: Security fixes from Phase 10 Step 1 Audit.

--------------------------------------------------------------------------------
-- 1. PREVENT PRIVILEGE ESCALATION ON PROFILES
--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- If role_id is being changed
    IF NEW.role_id IS DISTINCT FROM OLD.role_id THEN
        -- Allow if user is service_role (auth.uid() is null)
        IF auth.uid() IS NULL THEN
            RETURN NEW;
        END IF;

        -- Allow if user is a Super Admin
        IF public.is_super_admin(auth.uid()) THEN
            RETURN NEW;
        END IF;

        -- Otherwise, reject the update
        RAISE EXCEPTION 'Unauthorized: Only Super Admins can modify role assignments.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_role_escalation();
