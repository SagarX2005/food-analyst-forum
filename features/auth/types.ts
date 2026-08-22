import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { ProfileWithRoleAndOrg, RoleName } from "@services/authService";
import type { LoginInput, ForgotPasswordInput, ResetPasswordInput } from "./schemas";

export type {
  RoleName,
  ProfileWithRoleAndOrg,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
};

export interface AuthState {
  user: SupabaseUser | null;
  profile: ProfileWithRoleAndOrg | null;
  role: RoleName;
  organization: ProfileWithRoleAndOrg["organizations"] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: (next?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  hasRole: (requiredRole: RoleName) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  reloadProfile: () => Promise<void>;
}
