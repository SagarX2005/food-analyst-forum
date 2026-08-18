// app/api/invitations/submit/route.ts
// Phase 10A — Public: Submit access request
// Security: Zod-validates input; calls submit_access_request() SECURITY DEFINER RPC
// which strips all privileged fields server-side.

import { NextResponse } from "next/server";
import { createClient } from "@lib/supabase/server";
import { accessRequestSchema } from "@features/invitations/schemas";
import { EmailService } from "@services/emailService";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    // Server-side Zod validation
    const parsed = accessRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const supabase = await createClient();

    // Call SECURITY DEFINER RPC — privileged fields cannot be set by caller
    const { data: result, error } = await supabase.rpc("submit_access_request", {
      p_email: data.email,
      p_full_name: data.full_name,
      p_professional_title: data.professional_title,
      p_organization: data.organization,
      p_profession: data.profession,
      p_experience_years: data.experience_years,
      p_region: data.region,
      p_reason: data.reason,
      p_linkedin_url: data.linkedin_url ?? null,
      p_website_url: data.website_url ?? null,
    });

    if (error) {
      console.error("[submit-access-request] RPC error:", error.message);
      return NextResponse.json(
        { success: false, code: "SERVER_ERROR", message: "Submission failed. Please try again." },
        { status: 500 },
      );
    }

    const rpcResult = result as { success: boolean; code?: string; message?: string; id?: string };

    if (!rpcResult.success) {
      return NextResponse.json(rpcResult, { status: 409 });
    }

    // Send confirmation email (non-blocking — failures don't fail the request)
    EmailService.sendRequestReceivedEmail({
      to: data.email,
      name: data.full_name,
    }).catch((err: unknown) => console.error("[submit-access-request] Email send failed:", err));

    return NextResponse.json({ success: true, id: rpcResult.id }, { status: 201 });
  } catch (err: unknown) {
    console.error("[submit-access-request] Unexpected error:", err);
    return NextResponse.json(
      { success: false, code: "SERVER_ERROR", message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
