import { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, Home } from "lucide-react";
import { AuthCard } from "@components/auth/auth-card";
import { AuthHeader } from "@components/auth/auth-header";
import { Button } from "@components/ui/button";

export const metadata: Metadata = {
  title: "403 — Unauthorized Access",
  description: "You do not have permission to access this page or resource.",
};

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center py-10">
      <AuthCard>
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="bg-destructive/10 text-destructive flex h-16 w-16 items-center justify-center rounded-2xl">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <AuthHeader
            title="403 — Access Denied"
            description="You do not have the required role or permissions (Recruiter, Admin) to view this resource."
          />

          <div className="w-full space-y-2 pt-2">
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
