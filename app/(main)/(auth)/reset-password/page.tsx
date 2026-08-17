import { Metadata } from "next";
import { AuthCard } from "@components/auth/auth-card";
import { AuthHeader } from "@components/auth/auth-header";
import { ResetPasswordForm } from "@components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Set New Password",
  description: "Set a new secure password for your Food Analyst Forum account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center py-10">
      <AuthCard>
        <AuthHeader
          title="Set New Password"
          description="Enter a new strong password below to secure your account."
        />
        <ResetPasswordForm />
      </AuthCard>
    </div>
  );
}
