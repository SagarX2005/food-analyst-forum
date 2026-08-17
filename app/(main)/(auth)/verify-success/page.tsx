import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { AuthCard } from "@components/auth/auth-card";
import { AuthHeader } from "@components/auth/auth-header";
import { Button } from "@components/ui/button";

export const metadata: Metadata = {
  title: "Email Verified",
  description: "Your email has been successfully verified.",
};

export default function VerifySuccessPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center py-10">
      <AuthCard>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4a9d23]/10 text-[#4a9d23]">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <AuthHeader
            title="Email Successfully Verified!"
            description="Your Food Analyst Forum account is now active and ready for use."
          />

          <div className="pt-2 w-full">
            <Link href="/login" className="w-full block">
              <Button variant="green" size="lg" className="w-full justify-center gap-2">
                Continue to Sign In <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </AuthCard>
    </div>
  );
}
