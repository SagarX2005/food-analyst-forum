// app/(auth)/register/page.tsx
// Phase 10A — FAF is now invitation-only. Open registration is disabled.
// Visitors are directed to /request-invite or /accept-invite.

import { Metadata } from "next";
import Link from "next/link";
import { Lock, ArrowRight, Mail } from "lucide-react";
import { AuthCard } from "@components/auth/auth-card";
import { AuthHeader } from "@components/auth/auth-header";
import { Button } from "@components/ui/button";
import { AuthFooter } from "@components/auth/auth-footer";

export const metadata: Metadata = {
  title: "Invitation Only — Food Analyst Forum",
  description:
    "Food Analyst Forum is an invitation-only professional community. Request an invitation or accept an existing one to join.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center py-10">
      <AuthCard>
        <div className="flex flex-col items-center space-y-5 text-center">
          {/* Icon */}
          <div className="dark:text-foreground flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0a2a4a]/8 text-[#0a2a4a] dark:bg-[#0a2a4a]/30">
            <Lock className="h-7 w-7" />
          </div>

          <AuthHeader
            title="Invitation Only"
            description="Food Analyst Forum is a curated, invitation-only professional community for food analysts, laboratory professionals, and industry experts."
          />

          {/* CTA Buttons */}
          <div className="w-full space-y-3 pt-2">
            <Link href="/request-invite" className="block w-full">
              <Button
                variant="green"
                size="lg"
                className="w-full justify-center gap-2"
                id="request-invite-btn"
              >
                <Mail className="h-4 w-4" />
                Request an Invitation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/accept-invite" className="block w-full">
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center gap-2"
                id="accept-invite-btn"
              >
                I Have an Invitation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Info notice */}
          <div className="bg-muted text-muted-foreground w-full rounded-xl px-4 py-3 text-left text-xs leading-relaxed">
            <strong className="text-foreground">About Membership:</strong> Applications are reviewed
            by our team. Once approved, you will receive a secure invitation link at your email
            address. Invitations are valid for 7 days.
          </div>
        </div>

        <div className="mt-4">
          <AuthFooter label="Already a member?" linkText="Sign In" linkHref="/login" />
        </div>
      </AuthCard>
    </div>
  );
}
