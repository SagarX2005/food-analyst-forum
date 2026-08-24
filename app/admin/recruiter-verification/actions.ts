"use server";

import { revalidatePath } from "next/cache";
import { RecruiterVerificationService } from "@services/recruiterVerificationService";

export async function approveApplicationAction(id: string) {
  try {
    await RecruiterVerificationService.approveApplication(id);
    revalidatePath("/admin/recruiter-verification");
    revalidatePath(`/admin/recruiter-verification/${id}`);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    const err = error as Error;
    return { success: false, error: err.message || "Failed to approve application" };
  }
}

export async function rejectApplicationAction(id: string, reason: string) {
  try {
    if (!reason || reason.trim() === "") {
      return { success: false, error: "Rejection reason is required" };
    }
    await RecruiterVerificationService.rejectApplication(id, reason);
    revalidatePath("/admin/recruiter-verification");
    revalidatePath(`/admin/recruiter-verification/${id}`);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    const err = error as Error;
    return { success: false, error: err.message || "Failed to reject application" };
  }
}

export async function requestMoreInfoAction(id: string, requestMsg: string) {
  try {
    if (!requestMsg || requestMsg.trim() === "") {
      return { success: false, error: "More info request message is required" };
    }
    await RecruiterVerificationService.requestMoreInfo(id, requestMsg);
    revalidatePath("/admin/recruiter-verification");
    revalidatePath(`/admin/recruiter-verification/${id}`);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    const err = error as Error;
    return { success: false, error: err.message || "Failed to request more info" };
  }
}
