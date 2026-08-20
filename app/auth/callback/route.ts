import { NextResponse } from "next/server";
import { createClient } from "@lib/supabase/server";

/**
 * OAuth Callback Route Handler
 *
 * Supabase redirects here after Google (or any OAuth provider) authentication.
 * It exchanges the "code" query param for a valid session, then redirects the user
 * to the intended destination.
 *
 * Required: Enable this URL as an allowed Redirect URL in:
 *   Supabase Dashboard → Authentication → URL Configuration → Redirect URLs
 *   Add: http://localhost:3000/auth/callback (for local dev)
 *       https://yourdomain.com/auth/callback  (for production)
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth errors from provider (e.g., user denied access) or GoTrue DB insert failures
  if (error) {
    console.error("[OAuth Callback] Provider error:", error, errorDescription);

    const errorMessage = errorDescription ?? error;
    const errorString = String(errorMessage || "");

    // If the database trigger blocked the user creation, GoTrue usually returns "Database error saving new user"
    if (
      errorString.includes("INVITE_REQUIRED") ||
      errorString.includes("Database error saving new user") ||
      errorString.includes("server_error")
    ) {
      return NextResponse.redirect(`${origin}/invitation-required`);
    }

    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMessage)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      // Successfully authenticated — redirect to intended page
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        // In local dev, trust the origin directly
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        // In production behind a proxy/CDN
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }

    // Code exchange failed
    console.error("[OAuth Callback] Code exchange error:", exchangeError);

    const errorMessage =
      "An unexpected error occurred during authentication. Please try again.";

    // Check if the error is our custom Postgres trigger error
    const errorString = String(exchangeError.message || exchangeError.name || "");
    if (
      errorString.includes("INVITE_REQUIRED") ||
      errorString.includes("Database error saving new user")
    ) {
      return NextResponse.redirect(`${origin}/invitation-required`);
    }

    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMessage)}`);
  }

  // No code present — bad request
  console.error("[OAuth Callback] No code parameter in callback URL.");
  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Invalid authentication callback. Please try again.")}`,
  );
}
