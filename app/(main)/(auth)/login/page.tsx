import { Metadata } from "next";
import { AuthCard } from "@components/auth/auth-card";
import { AuthHeader } from "@components/auth/auth-header";
import { AuthFooter } from "@components/auth/auth-footer";
import { LoginForm } from "@components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Log in to your Food Analyst Forum account to access SOP downloads, training webinars, and community discussions.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center py-10">
      <AuthCard>
        <AuthHeader
          title="Sign In to Your Account"
          description="Enter your registered laboratory or professional credentials to continue."
        />
        <LoginForm />
        <AuthFooter
          label="Not a member yet?"
          linkText="Request an Invitation"
          linkHref="/request-invite"
        />
      </AuthCard>
    </div>
  );
}
