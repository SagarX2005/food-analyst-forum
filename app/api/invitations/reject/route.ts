// app/api/invitations/reject/route.ts
// Phase 10A — Admin: Reject an access request

import { NextResponse } from "next/server";
import { createClient } from "@lib/supabase/server";
import { rejectRequestSchema } from "@features/invitations/schemas";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body: unknown = await request.json();
    const parsed = rejectRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { request_id, rejection_reason } = parsed.data;

    const { error: rpcError } = await supabase.rpc("reject_access_request", {
      p_request_id: request_id,
      p_reviewer_id: user.id,
      p_rejection_reason: rejection_reason,
    });

    if (rpcError) {
      console.error("[reject] RPC error:", rpcError.message);
      return NextResponse.json({ error: rpcError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[reject] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
