import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@lib/env";
import type { Database } from "@app-types/database.types";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>,
        ) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(
              name,
              value,
              options as Parameters<typeof supabaseResponse.cookies.set>[2],
            ),
          );
        },
      },
    },
  );

  const path = request.nextUrl.pathname;

  // Phase 10A: Public routes that are always accessible (never redirected)
  const isPublicInvitePath =
    path.startsWith("/request-invite") || path.startsWith("/accept-invite");

  if (isPublicInvitePath) {
    return supabaseResponse;
  }

  // Catch Supabase OAuth errors that fall back to the root SITE_URL in production.
  // When a database trigger fails during OAuth, Supabase often strips the redirectTo path
  // and redirects to the base domain with the error in the query string.
  const errorParam = request.nextUrl.searchParams.get("error");
  const errorDesc = request.nextUrl.searchParams.get("error_description") || "";
  
  if (
    errorParam === "server_error" &&
    (errorDesc.includes("Database error saving new user") || errorDesc.includes("INVITE_REQUIRED"))
  ) {
    const redirectUrl = new URL("/invitation-required", request.url);
    const response = NextResponse.redirect(redirectUrl);
    
    // Explicitly clear all Supabase auth cookies to prevent stale sessions
    const allCookies = request.cookies.getAll();
    allCookies.forEach((cookie) => {
      if (cookie.name.startsWith("sb-")) {
        response.cookies.delete(cookie.name);
      }
    });
    
    return response;
  }


  // Skip session refresh on the OAuth callback route — the callback route
  // handles its own Supabase client, session exchange, and cookie cleanup.
  if (path.startsWith("/auth/callback")) {
    return supabaseResponse;
  }

  // Refresh user session token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Unauthenticated user trying to access login/register
  const isAuthPage =
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password");

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Protected routes requiring authentication
  const isProtectedRoute =
    path.startsWith("/forum/create") ||
    path.startsWith("/jobs/apply") ||
    path.startsWith("/profile") ||
    path.startsWith("/settings") ||
    path.startsWith("/admin/invitations");

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
