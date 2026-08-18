"use client";

// components/invitations/invitation-acceptance-form.tsx
// Phase 10A — Account setup form shown after valid invitation token validation

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@lib/zod-resolver";
import { Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import { acceptInviteSchema, type AcceptInviteInput } from "@features/invitations/schemas";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";
import { PasswordStrength, PasswordRequirements } from "@components/auth/password-strength";
import Link from "next/link";

interface InvitationAcceptanceFormProps {
  token: string;
  email: string;
  fullName: string;
  assignedRole: string;
  expiresAt: string;
}

export function InvitationAcceptanceForm({
  token,
  email,
  fullName,
  assignedRole,
  expiresAt,
}: InvitationAcceptanceFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [accepted, setAccepted] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AcceptInviteInput>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      token,
      full_name: fullName,
      password: "",
      confirm_password: "",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: AcceptInviteInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !json.success) {
        setServerError(json.error ?? "Account creation failed. Please try again.");
        return;
      }

      setAccepted(true);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  };

  if (accepted) {
    return (
      <div className="flex flex-col items-center space-y-5 py-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4a9d23]/10 text-[#4a9d23]">
          <CheckCircle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="dark:text-foreground text-xl font-extrabold text-[#0a2a4a]">
            Welcome to FAF!
          </h3>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            Your account has been created. You can now sign in with your email and password.
          </p>
        </div>
        <Link href="/login">
          <Button variant="green" size="lg" className="gap-2">
            Sign In to Your Account
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Invitation summary */}
      <div className="space-y-2 rounded-xl border border-[#4a9d23]/30 bg-[#4a9d23]/5 px-4 py-3">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Your Invitation
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <span className="text-muted-foreground">Email:</span>
          <span className="text-foreground font-medium">{email}</span>
          <span className="text-muted-foreground">Assigned Role:</span>
          <span>
            <Badge variant="green" className="text-[10px]">
              {assignedRole}
            </Badge>
          </span>
          <span className="text-muted-foreground">Expires:</span>
          <span className="text-foreground font-medium">
            {new Date(expiresAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="border-destructive/40 bg-destructive/8 text-destructive rounded-xl border px-4 py-3 text-xs font-medium">
            {serverError}
          </div>
        )}

        {/* Hidden token */}
        <input type="hidden" {...register("token")} />

        {/* Full Name */}
        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            Full Name<span className="text-destructive ml-0.5">*</span>
          </label>
          <Input
            {...register("full_name")}
            placeholder="Your full name"
            autoComplete="name"
            aria-invalid={!!errors.full_name}
          />
          {errors.full_name && (
            <p className="text-destructive mt-1 text-xs">{errors.full_name.message}</p>
          )}
        </div>

        {/* Email (read-only — set by server from invitation) */}
        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">Email Address</label>
          <Input value={email} readOnly disabled className="cursor-not-allowed opacity-70" />
          <p className="text-muted-foreground mt-1 text-xs">
            Your email is pre-set from the invitation and cannot be changed.
          </p>
        </div>

        {/* Password */}
        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            Create Password<span className="text-destructive ml-0.5">*</span>
          </label>
          <div className="relative">
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground absolute top-3 right-3"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrength password={passwordValue} />
          <PasswordRequirements password={passwordValue} />
          {errors.password && (
            <p className="text-destructive mt-1 text-xs">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            Confirm Password<span className="text-destructive ml-0.5">*</span>
          </label>
          <Input
            {...register("confirm_password")}
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={!!errors.confirm_password}
          />
          {errors.confirm_password && (
            <p className="text-destructive mt-1 text-xs">{errors.confirm_password.message}</p>
          )}
        </div>

        <p className="text-muted-foreground text-xs">
          Your assigned role (<strong>{assignedRole}</strong>) is pre-set from the invitation and
          cannot be changed during account setup.
        </p>

        <Button
          type="submit"
          variant="green"
          size="lg"
          disabled={isSubmitting}
          className="mt-2 w-full justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Creating Account...
            </>
          ) : (
            <>Create My Account</>
          )}
        </Button>
      </form>
    </div>
  );
}
