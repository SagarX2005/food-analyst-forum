import { Metadata } from "next";
import { AuthCard } from "@components/auth/auth-card";
import { AuthHeader } from "@components/auth/auth-header";
import { ForgotPasswordForm } from "@components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a password reset link for your Food Analyst Forum account.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center py-10">
      <AuthCard>
        <AuthHeader
          title="Reset Your Password"
          description="Enter your registered email address and we'll send you instructions to reset your password."
        />
        <ForgotPasswordForm />
      </AuthCard>
    </div>
  );
}
