import { Metadata } from "next";
import Link from "next/link";
import { Clock, Home } from "lucide-react";
import { AuthCard } from "@components/auth/auth-card";
import { AuthHeader } from "@components/auth/auth-header";
import { Button } from "@components/ui/button";

export const metadata: Metadata = {
  title: "Account Verification Pending",
  description: "Your organization account is currently under review by administrators.",
};

export default function AccountPendingPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center py-10">
      <AuthCard>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
            <Clock className="h-8 w-8" />
          </div>

          <AuthHeader
            title="Verification Pending"
            description="Your organization or recruiter account is currently being reviewed by Food Analyst Forum administrators."
          />

          <div className="rounded-xl bg-muted p-4 text-xs text-muted-foreground leading-relaxed w-full">
            Verification usually takes 24-48 hours. Once approved, you will receive full posting privileges.
          </div>

          <div className="pt-2 w-full">
            <Link href="/" className="w-full block">
              <Button variant="navy" size="lg" className="w-full justify-center gap-2">
                <Home className="h-4 w-4" /> Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </AuthCard>
    </div>
  );
}
