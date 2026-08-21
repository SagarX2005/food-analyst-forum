import { NextResponse } from "next/server";
import { createClient } from "@lib/supabase/server";
import { getBaseUrl } from "@lib/utils";
import { cookies } from "next/headers";

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
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const appUrl = getBaseUrl();

  // Helper function to cleanly clear stale OAuth/PKCE cookies and redirect
  const createCookieClearingRedirect = async (url: string) => {
    const response = NextResponse.redirect(url);
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    // Iterate and explicitly delete all Supabase-related cookies (PKCE, session)
    allCookies.forEach((cookie) => {
      if (cookie.name.startsWith("sb-")) {
        // Delete from the incoming cookie store state
        cookieStore.delete(cookie.name);
        // Explicitly set deletion header on the outgoing HTTP response to guarantee removal in browser
        response.cookies.delete(cookie.name);
      }
    });
    return response;
  };

  // Handle OAuth errors from provider (e.g., user denied access) or GoTrue DB insert failures
  if (error) {
    console.error("[OAuth Callback] Provider error:", error, errorDescription);

    const errorMessage = errorDescription ?? error;
    const errorString = String(errorMessage || "");

    // Do NOT call `await supabase.auth.signOut()` here because there is no session to sign out from.
    // If the database trigger blocked user creation, calling signOut() could crash the handler.
    // Instead, we just explicitly clear the stale PKCE cookies.

    // If the database trigger blocked the user creation, GoTrue usually returns "Database error saving new user"
    if (
      errorString.includes("INVITE_REQUIRED") ||
      errorString.includes("Database error saving new user") ||
      errorString.includes("server_error")
    ) {
      return await createCookieClearingRedirect(`${appUrl}/invitation-required`);
    }

    return await createCookieClearingRedirect(`${appUrl}/login?error=${encodeURIComponent(errorMessage)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      // Successfully authenticated — redirect to intended page using deployment-aware getBaseUrl
      return NextResponse.redirect(`${appUrl}${next}`);
    }

    // Code exchange failed
    console.error("[OAuth Callback] Code exchange error:", exchangeError);

    const errorMessage = "An unexpected error occurred during authentication. Please try again.";

    // Check if the error is our custom Postgres trigger error
    const errorString = String(exchangeError.message || exchangeError.name || "");
    if (
      errorString.includes("INVITE_REQUIRED") ||
      errorString.includes("Database error saving new user") ||
      errorString.includes("server_error")
    ) {
      return await createCookieClearingRedirect(`${appUrl}/invitation-required`);
    }

    return await createCookieClearingRedirect(`${appUrl}/login?error=${encodeURIComponent(errorMessage)}`);
  }

  // No code present — bad request
  console.error("[OAuth Callback] No code parameter in callback URL.");
  return await createCookieClearingRedirect(
    `${appUrl}/login?error=${encodeURIComponent("Invalid authentication callback. Please try again.")}`,
  );
}
