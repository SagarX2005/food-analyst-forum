"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@lib/zod-resolver";
import { Mail, ArrowLeft } from "lucide-react";
import { FlaskLoader } from "@components/ui/flask-loader";
import Link from "next/link";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@features/auth/schemas";
import { useAuth } from "@hooks/use-auth";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      setServerError(null);
      setSuccessMessage(null);
      await forgotPassword(data.email);
      setSuccessMessage("Password reset instructions have been sent to your email address.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Request failed. Please try again.";
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
            Email Address
          </label>
          <Input
            {...register("email")}
            type="email"
            placeholder="analyst@foodlab.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="navy"
          size="lg"
          disabled={isSubmitting}
          className="w-full justify-center gap-2"
        >
          {isSubmitting ? (
            <><FlaskLoader size="sm" /><span>Sending Link...</span></>
          ) : (
            <><Mail className="h-4 w-4" />Send Reset Link</>
          )}
        </Button>
      </form>

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4a9d23] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
}
