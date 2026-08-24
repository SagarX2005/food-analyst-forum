"use server";

import { revalidatePath } from "next/cache";
import { RecruiterVerificationService, type SubmitRecruiterApplicationPayload } from "@services/recruiterVerificationService";
import { createClient } from "@lib/supabase/server";

export async function submitRecruiterApplicationAction(payload: SubmitRecruiterApplicationPayload) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Ensure user_id matches authenticated user
    if (payload.user_id !== user.id) {
      return { success: false, error: "Invalid user ID" };
    }

    await RecruiterVerificationService.submitApplication(payload, supabase);
    revalidatePath("/dashboard");
    revalidatePath("/apply-recruiter");
    return { success: true };
  } catch (error) {
    const err = error as Error;
    return { success: false, error: err.message || "Failed to submit application" };
  }
}

export async function resubmitRecruiterApplicationAction(id: string, newEvidence: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    await RecruiterVerificationService.resubmitApplication(id, newEvidence, supabase);
    revalidatePath("/dashboard");
    revalidatePath("/apply-recruiter");
    return { success: true };
  } catch (error) {
    const err = error as Error;
    return { success: false, error: err.message || "Failed to resubmit application" };
  }
}
