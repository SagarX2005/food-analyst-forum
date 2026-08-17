// app/api/invitations/approve/route.ts
// Phase 10A — Admin: Approve an access request and generate a secure invitation
// Security:
//   1. Server checks is_admin() before any action
//   2. Role is validated against ALLOWED_APPROVAL_ROLES (Admin/SuperAdmin excluded)
//   3. Raw crypto token generated server-side; only SHA-256 hash stored in DB
//   4. Token sent via email — never returned in API response

import { NextResponse } from "next/server";
import { createClient } from "@lib/supabase/server";
import { approveRequestSchema } from "@features/invitations/schemas";
import { ALLOWED_APPROVAL_ROLES, INVITATION_EXPIRY_DAYS } from "@features/invitations/config";
import { EmailService } from "@services/emailService";
import { createHash, randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Admin check via RPC
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Validate request body
    const body: unknown = await request.json();
    const parsed = approveRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { request_id, approved_role } = parsed.data;

    // 4. Double-check role is not Admin/SuperAdmin (defense in depth)
    if (!ALLOWED_APPROVAL_ROLES.includes(approved_role)) {
      return NextResponse.json(
        { error: "Invalid role. Admin and Super Admin cannot be assigned through this workflow." },
        { status: 400 }
      );
    }

    // 5. Generate cryptographically secure token
    const rawToken  = randomBytes(32).toString("hex"); // 256 bits of entropy
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

    // 6. Approve via SECURITY DEFINER RPC (stores hash, not raw token)
    const { data: result, error: rpcError } = await supabase.rpc("approve_access_request", {
      p_request_id:  request_id,
      p_reviewer_id: user.id,
      p_role:        approved_role,
      p_token_hash:  tokenHash,
      p_expires_at:  expiresAt.toISOString(),
    });

    if (rpcError) {
      console.error("[approve] RPC error:", rpcError.message);
      return NextResponse.json({ error: rpcError.message }, { status: 500 });
    }

    const rpcResult = result as { success: boolean; invitation_id?: string };

    if (!rpcResult.success) {
      return NextResponse.json({ error: "Approval failed" }, { status: 500 });
    }

    // 7. Fetch applicant info for email (only from server after approval)
    const { data: reqData } = await supabase
      .from("access_requests")
      .select("email, full_name")
      .eq("id", request_id)
      .single();

    if (reqData) {
      const appUrl    = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const acceptUrl = `${appUrl}/accept-invite?token=${encodeURIComponent(rawToken)}`;

      // Send invitation email with RAW token in link — only this one occurrence
      EmailService.sendInvitationEmail({
        to:           reqData.email as string,
        name:         reqData.full_name as string,
        rawToken,
        assignedRole: approved_role,
        expiresAt,
      }).catch((err: unknown) =>
        console.error("[approve] Email send failed:", err)
      );

      // Log the accept URL in dev for testing without email
      if (process.env.NODE_ENV === "development") {
        console.warn("[approve] Dev invitation URL:", acceptUrl);
      }
    }

    // 8. Return ONLY the invitation_id — raw token is NOT included in response
    return NextResponse.json({
      success:       true,
      invitation_id: rpcResult.invitation_id,
    });
  } catch (err: unknown) {
    console.error("[approve] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
