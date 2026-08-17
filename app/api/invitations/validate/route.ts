// app/api/invitations/validate/route.ts
// Phase 10A — Public: Validate an invitation token
// Returns only non-sensitive metadata (email, name, role, expiry).
// The raw token from the URL is hashed server-side before DB lookup.

import { NextResponse } from "next/server";
import { createClient } from "@lib/supabase/server";
import { createHash } from "crypto";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawToken = searchParams.get("token");

    if (!rawToken || rawToken.trim() === "") {
      return NextResponse.json(
        { valid: false, reason: "INVALID_TOKEN" },
        { status: 400 }
      );
    }

    // Hash the raw token — raw token never touches DB queries
    const tokenHash = createHash("sha256").update(rawToken.trim()).digest("hex");

    const supabase = await createClient();

    const { data, error } = await supabase.rpc("validate_invitation_token", {
      p_token_hash: tokenHash,
    });

    if (error) {
      console.error("[validate-token] RPC error:", error.message);
      return NextResponse.json(
        { valid: false, reason: "SERVER_ERROR" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("[validate-token] Unexpected error:", err);
    return NextResponse.json(
      { valid: false, reason: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
