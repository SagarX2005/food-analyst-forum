-- Create RPC for users to resubmit applications that require more information

CREATE OR REPLACE FUNCTION public.resubmit_recruiter_application(
    p_app_id UUID,
    p_new_evidence TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_current_status TEXT;
BEGIN
    -- Verify authentication
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Get current application state, ensuring it belongs to the authenticated user
    SELECT status INTO v_current_status
    FROM public.recruiter_applications
    WHERE id = p_app_id AND user_id = v_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Application not found or access denied';
    END IF;

    -- Ensure the application is in the correct state
    IF v_current_status != 'more_information_required' THEN
        RAISE EXCEPTION 'Only applications requiring more information can be resubmitted';
    END IF;

    -- Perform the update securely
    UPDATE public.recruiter_applications
    SET 
        evidence = CONCAT_WS(E'\n\n--- Resubmitted Evidence ---\n', evidence, p_new_evidence),
        status = 'pending',
        updated_at = NOW()
    WHERE id = p_app_id AND user_id = v_user_id;

    -- Log the audit event
    PERFORM public.log_audit_event(
        v_user_id,
        'resubmit_recruiter_application',
        'recruiter_applications',
        p_app_id::text,
        '{"previous_status": "more_information_required", "new_status": "pending"}'::jsonb
    );

END;
$$;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION public.resubmit_recruiter_application(UUID, TEXT) TO authenticated;
