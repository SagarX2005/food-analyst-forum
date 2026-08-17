// app/api/invitations/accept/route.ts
// Phase 10A — Public: Accept invitation and create Supabase Auth account
// Security:
//   1. Raw token hashed server-side — never stored as-is in DB
//   2. Token validated before account creation
//   3. Account created via Supabase Auth (no manual password storage)
//   4. Approved role assigned server-side only (not from request body)
//   5. Token marked used atomically — cannot be reused

import { NextResponse } from "next/server";
import { createClient } from "@lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { type SupabaseClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { z } from "zod";
import { ALLOWED_APPROVAL_ROLES } from "@features/invitations/config";
import type { ApprovalRole } from "@features/invitations/types";
import type { Database, RoleName } from "@app-types/database.types";

const acceptSchema = z.object({
  token:     z.string().min(1, "Invalid invitation token"),
  full_name: z.string().trim().min(2).max(120),
  password:  z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

/** Creates a Supabase client using the Service Role key (server-only) */
function createAdminClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase URL or service role key is not configured.");
  }

  return createServerClient<Database>(supabaseUrl, serviceKey, {
    cookies: {
      getAll() { return []; },
      setAll() { /* no-op for admin client */ },
    },
    auth: {
      autoRefreshToken: false,
      persistSession:   false,
    },
  }) as unknown as SupabaseClient<Database>;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const parsed = acceptSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { token: rawToken, full_name, password } = parsed.data;

    // 1. Hash the raw token — DB query uses hash only
    const tokenHash = createHash("sha256").update(rawToken.trim()).digest("hex");

    const supabase = await createClient();

    // 2. Validate the token via SECURITY DEFINER function
    const { data: validation, error: valError } = await supabase.rpc(
      "validate_invitation_token",
      { p_token_hash: tokenHash }
    );

    if (valError) {
      return NextResponse.json({ error: "Token validation failed." }, { status: 500 });
    }

    const v = validation as {
      valid: boolean;
      reason?: string;
      email?: string;
      assigned_role?: string;
      invitation_id?: string;
    };

    if (!v.valid) {
      const messages: Record<string, string> = {
        INVALID_TOKEN: "This invitation link is invalid.",
        ALREADY_USED:  "This invitation has already been used.",
        REVOKED:       "This invitation has been revoked.",
        EXPIRED:       "This invitation has expired.",
      };
      return NextResponse.json(
        { error: messages[v.reason ?? ""] ?? "Invalid invitation." },
        { status: 400 }
      );
    }

    const { email, assigned_role } = v;

    // 3. Confirm assigned_role is non-privileged (defense in depth)
    if (!email || !assigned_role || !ALLOWED_APPROVAL_ROLES.includes(assigned_role as ApprovalRole)) {
      return NextResponse.json(
        { error: "Invalid invitation data." },
        { status: 400 }
      );
    }

    // 4. Create the Supabase Auth user (admin client)
    const adminClient = createAdminClient();

    const { data: authData, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,    // auto-confirm since they have a valid invitation
      user_metadata: { full_name },
    });

    if (createError || !authData.user) {
      // Handle duplicate account gracefully
      if (createError?.message?.includes("already registered")) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please sign in." },
          { status: 409 }
        );
      }
      console.error("[accept-invite] createUser error:", createError?.message);
      return NextResponse.json({ error: "Account creation failed." }, { status: 500 });
    }

    const newUserId = authData.user.id;

    // 5. Assign the approved role to the profile
    //    handle_new_user trigger creates the profile with default 'User' role.
    //    We now update it to the approved_role from the invitation.
    const { data: roleData } = await adminClient
      .from("roles")
      .select("id")
      .eq("name", assigned_role as RoleName)
      .single();

    if (roleData?.id) {
      await adminClient
        .from("profiles")
        .update({ role_id: roleData.id, full_name })
        .eq("id", newUserId);
    }

    // 6. Mark invitation as accepted (atomic) — cannot be reused
    const { error: acceptError } = await adminClient.rpc("accept_invitation_token", {
      p_token_hash: tokenHash,
    });

    if (acceptError) {
      // The user was created but token marking failed. Log and continue.
      console.error("[accept-invite] accept_invitation_token error:", acceptError.message);
    }

    // 7. Log Audit Event (best effort)
    adminClient.rpc("log_audit_event", {
      p_user_id:     newUserId,
      p_action:      "INVITATION_ACCEPTED",
      p_entity_type: "invitations",
      p_entity_id:   v.invitation_id ?? "",
      p_details:     { email, role: assigned_role },
      p_ip_address:  request.headers.get("x-forwarded-for") ?? null,
    }).then(({ error }) => {
      if (error) console.error("[accept-invite] audit log error:", error.message);
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully. You can now sign in.",
    });
  } catch (err: unknown) {
    console.error("[accept-invite] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
