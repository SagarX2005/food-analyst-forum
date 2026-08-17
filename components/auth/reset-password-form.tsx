"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@lib/zod-resolver";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { FlaskLoader } from "@components/ui/flask-loader";
import { resetPasswordSchema, type ResetPasswordInput } from "@features/auth/schemas";
import { useAuth } from "@hooks/use-auth";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { PasswordStrength, PasswordRequirements } from "./password-strength";

export function ResetPasswordForm() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      setServerError(null);
      setSuccessMessage(null);
      await resetPassword(data.password);
      setSuccessMessage("Your password has been successfully updated!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Password reset failed. Link may be expired.";
      setServerError(msg);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormError message={serverError} />
        <FormSuccess message={successMessage} />

        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">
            New Password
          </label>
          <Input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
          />
          <PasswordStrength password={passwordValue} />
          <PasswordRequirements password={passwordValue} />
          {errors.password && (
            <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">
            Confirm New Password
          </label>
          <Input
            {...register("confirmPassword")}
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="green"
          size="lg"
          disabled={isSubmitting}
          className="w-full justify-center gap-2"
        >
          {isSubmitting ? (
            <><FlaskLoader size="sm" /><span>Updating Password...</span></>
          ) : (
            <><KeyRound className="h-4 w-4" />Update Password</>
          )}
        </Button>
      </form>
    </div>
  );
}
