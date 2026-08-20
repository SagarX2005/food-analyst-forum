import { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@components/auth/auth-card";
import { AuthHeader } from "@components/auth/auth-header";
import { Button } from "@components/ui/button";
import { ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Invitation Required",
  description: "Food Analyst Forum is an invitation-only professional community.",
};

export default function InvitationRequiredPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center py-10">
      <AuthCard>
        <AuthHeader title="Invitation Required" />

        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100/50 dark:bg-amber-900/20">
            <ShieldAlert className="h-8 w-8 text-amber-600 dark:text-amber-500" />
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            Your Google account is not currently invited to the Food Analyst Forum. FAF is an
            invitation-only professional community.
          </p>

          <div className="flex w-full flex-col gap-3 pt-4">
            <Button className="w-full">
              <Link href="/request-invite" className="flex w-full items-center justify-center">
                Request an Invitation
              </Link>
            </Button>

            <Button variant="outline" className="w-full">
              <Link href="/login" className="flex w-full items-center justify-center">
                Back to Sign In
              </Link>
            </Button>
          </div>
        </div>
      </AuthCard>
    </div>
  );
}
