"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthService, type RoleName } from "@services/authService";
import { createClient } from "@lib/supabase/client";
import type { AuthContextValue, AuthState } from "@features/auth/types";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    role: "Guest",
    organization: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const loadUserAndProfile = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const user = await AuthService.getCurrentUser();

      if (!user) {
        setState({
          user: null,
          profile: null,
          role: "Guest",
          organization: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        return;
      }

      const profile = await AuthService.getCurrentProfile();
      const roleName = (profile?.roles?.name as RoleName) || "User";
      const org = profile?.organizations || null;

      setState({
        user,
        profile,
        role: roleName,
        organization: org,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load auth state";
      setState({
        user: null,
        profile: null,
        role: "Guest",
        organization: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
    }
  }, []);

  useEffect(() => {
    loadUserAndProfile();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        await loadUserAndProfile();
      } else if (event === "SIGNED_OUT") {
        setState({
          user: null,
          profile: null,
          role: "Guest",
          organization: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserAndProfile]);

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await AuthService.signInWithEmail({ email, password });
      await loadUserAndProfile();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid login credentials";
      setState((prev) => ({ ...prev, isLoading: false, error: msg }));
      throw err;
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await AuthService.registerWithEmail({ email, password, fullName });
      await loadUserAndProfile();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setState((prev) => ({ ...prev, isLoading: false, error: msg }));
      throw err;
    }
  };

  const signOut = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await AuthService.signOut();
      setState({
        user: null,
        profile: null,
        role: "Guest",
        organization: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign out failed";
      setState((prev) => ({ ...prev, isLoading: false, error: msg }));
      throw err;
    }
  };

  const signInWithGoogle = async (next = "/dashboard") => {
    try {
      await AuthService.signInWithGoogle(next);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      setState((prev) => ({ ...prev, error: msg }));
      throw err;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await AuthService.resetPassword(email);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Forgot password request failed";
      setState((prev) => ({ ...prev, error: msg }));
      throw err;
    }
  };

  const resetPassword = async (password: string) => {
    try {
      await AuthService.updatePassword(password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Password update failed";
      setState((prev) => ({ ...prev, error: msg }));
      throw err;
    }
  };

  const refreshSession = async () => {
    try {
      await AuthService.refreshSession();
      await loadUserAndProfile();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Session refresh failed";
      setState((prev) => ({ ...prev, error: msg }));
      throw err;
    }
  };

  const hasRole = (requiredRole: RoleName): boolean => {
    if (state.role === "Super Admin") return true;
    return state.role === requiredRole;
  };

  const isAdmin = (): boolean => {
    return state.role === "Admin" || state.role === "Super Admin";
  };

  const isSuperAdmin = (): boolean => {
    return state.role === "Super Admin";
  };

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    signOut,
    signInWithGoogle,
    forgotPassword,
    resetPassword,
    refreshSession,
    hasRole,
    isAdmin,
    isSuperAdmin,
    reloadProfile: loadUserAndProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
