// app/api/invitations/mark-under-review/route.ts
// Phase 10A — Admin: Mark an access request as under review

import { NextResponse } from "next/server";
import { createClient } from "@lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  request_id: z.string().uuid("Invalid request ID"),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body: unknown = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request ID" }, { status: 400 });
    }

    const { error: rpcError } = await supabase.rpc("mark_request_under_review", {
      p_request_id:  parsed.data.request_id,
      p_reviewer_id: user.id,
    });

    if (rpcError) {
      console.error("[mark-under-review] RPC error:", rpcError.message);
      return NextResponse.json({ error: rpcError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[mark-under-review] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
