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
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
            <Clock className="h-8 w-8" />
          </div>

          <AuthHeader
            title="Verification Pending"
            description="Your organization or recruiter account is currently being reviewed by Food Analyst Forum administrators."
          />

          <div className="bg-muted text-muted-foreground w-full rounded-xl p-4 text-xs leading-relaxed">
            Verification usually takes 24-48 hours. Once approved, you will receive full posting
            privileges.
          </div>

          <div className="w-full pt-2">
            <Link href="/" className="block w-full">
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
