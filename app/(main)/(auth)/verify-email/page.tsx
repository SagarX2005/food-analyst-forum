import { Metadata } from "next";
import Link from "next/link";
import { MailCheck, ArrowRight } from "lucide-react";
import { AuthCard } from "@components/auth/auth-card";
import { AuthHeader } from "@components/auth/auth-header";
import { Button } from "@components/ui/button";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Please verify your email address to activate your Food Analyst Forum account.",
};

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center py-10">
      <AuthCard>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4a9d23]/10 text-[#4a9d23]">
            <MailCheck className="h-8 w-8" />
          </div>

          <AuthHeader
            title="Check Your Inbox"
            description="We have sent a verification link to your email address. Please click the link to activate your analyst profile."
          />

          <div className="rounded-xl bg-muted p-4 text-xs text-muted-foreground leading-relaxed w-full">
            If you don&apos;t see the email within a few minutes, check your spam or junk folder.
          </div>

          <div className="pt-2 w-full space-y-2">
            <Link href="/login" className="w-full block">
              <Button variant="navy" size="lg" className="w-full justify-center gap-2">
                Proceed to Sign In <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </AuthCard>
    </div>
  );
}
