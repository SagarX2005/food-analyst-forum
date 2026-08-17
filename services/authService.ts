import { createClient } from "@lib/supabase/client";

export type RoleName =
  | "Guest"
  | "User"
  | "Recruiter"
  | "Trainer"
  | "Moderator"
  | "Admin"
  | "Super Admin";

export interface RegisterParams {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface ProfileWithRoleAndOrg {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  headline: string | null;
  bio: string | null;
  phone: string | null;
  role_id: string | null;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  title?: string | null;
  location?: string | null;
  website?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  cover_url?: string | null;
  username?: string | null;
  skills?: string[] | null;
  roles?: {
    id: string;
    name: RoleName;
    description: string | null;
    created_at?: string;
    updated_at?: string;
  } | null;
  organizations?: {
    id: string;
    name: string;
    type: string;
    logo_url: string | null;
    verified: boolean;
  } | null;
}

export class AuthService {
  private static getClient() {
    return createClient();
  }

  /**
   * Register a new user with Email & Password.
   * Trigger will automatically provision profile in public.profiles.
   */
  static async registerWithEmail({ email, password, fullName }: RegisterParams) {
    const supabase = this.getClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    return data;
  }

  /**
   * Login user with Email & Password.
   */
  static async signInWithEmail({ email, password }: LoginParams) {
    const supabase = this.getClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Initiate Google OAuth sign-in flow.
   * Supabase will redirect to /auth/callback after authentication.
   */
  static async signInWithGoogle(next = "/dashboard") {
    const supabase = this.getClient();
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign out the currently authenticated user.
   */
  static async signOut() {
    const supabase = this.getClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  /**
   * Send password reset email to user.
   */
  static async resetPassword(email: string, redirectTo?: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Update password for current session user.
   */
  static async updatePassword(newPassword: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Refresh the active authentication session.
   */
  static async refreshSession() {
    const supabase = this.getClient();
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data;
  }

  /**
   * Retrieve the current authenticated Auth user.
   */
  static async getCurrentUser() {
    const supabase = this.getClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error && error.name !== "AuthSessionMissingError") throw error;
    return user;
  }

  /**
   * Retrieve the profile record for the authenticated user along with role and organization.
   */
  static async getCurrentProfile(): Promise<ProfileWithRoleAndOrg | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const supabase = this.getClient();
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        *,
        roles (
          id,
          name,
          description
        ),
        organizations (
          id,
          name,
          type,
          logo_url,
          verified
        )
      `)
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return data as unknown as ProfileWithRoleAndOrg;
  }

  /**
   * Check if current user has minimum specified role or admin privileges.
   */
  static async checkUserRole(requiredRole: RoleName): Promise<boolean> {
    const profile = await this.getCurrentProfile();
    if (!profile || !profile.roles) return false;

    const currentRoleName = profile.roles.name;
    if (currentRoleName === "Super Admin") return true;

    return currentRoleName === requiredRole;
  }
}
