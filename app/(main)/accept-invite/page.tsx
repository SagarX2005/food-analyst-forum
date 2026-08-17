// app/accept-invite/page.tsx
// Phase 10A — Invitation acceptance page
// Server component: validates token via API, then renders appropriate UI.

import { Suspense } from "react";
import Link from "next/link";
import { XCircle, Clock, ShieldX, FlaskConical } from "lucide-react";
import { AuthCard } from "@components/auth/auth-card";
import { AuthHeader } from "@components/auth/auth-header";
import { Button } from "@components/ui/button";
import { InvitationAcceptanceForm } from "@components/invitations/invitation-acceptance-form";
import { createHash } from "crypto";
import { createClient } from "@lib/supabase/server";
import type { ValidateTokenResult } from "@features/invitations/types";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

async function validateToken(rawToken: string): Promise<ValidateTokenResult> {
  const tokenHash = createHash("sha256").update(rawToken.trim()).digest("hex");
  const supabase  = await createClient();

  const { data, error } = await supabase.rpc("validate_invitation_token", {
    p_token_hash: tokenHash,
  });

  if (error || !data) {
    return { valid: false, reason: "INVALID_TOKEN" };
  }

  return data as unknown as ValidateTokenResult;
}

function InvalidState({
  icon: Icon,
  title,
  description,
  cta,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[75vh] items-center justify-center py-10 px-4">
      <AuthCard>
        <div className="flex flex-col items-center text-center space-y-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Icon className="h-7 w-7" />
          </div>
          <AuthHeader title={title} description={description} />
          {cta ?? (
            <Link href="/request-invite" className="w-full">
              <Button variant="green" size="lg" className="w-full justify-center">
                Request a New Invitation
              </Button>
            </Link>
          )}
          <Link href="/login" className="text-xs text-muted-foreground hover:text-[#4a9d23]">
            Already have an account? Sign in
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}

async function AcceptInviteContent({ rawToken }: { rawToken: string }) {
  const result = await validateToken(rawToken);

  if (!result.valid) {
    const states: Record<string, { icon: React.ElementType; title: string; description: string }> = {
      INVALID_TOKEN: {
        icon:        ShieldX,
        title:       "Invalid Invitation",
        description: "This invitation link is not valid. It may have been modified or is malformed.",
      },
      ALREADY_USED: {
        icon:        XCircle,
        title:       "Invitation Already Used",
        description: "This invitation has already been accepted. If you have an account, please sign in.",
      },
      REVOKED: {
        icon:        XCircle,
        title:       "Invitation Revoked",
        description: "This invitation has been revoked by an administrator.",
      },
      EXPIRED: {
        icon:        Clock,
        title:       "Invitation Expired",
        description: "This invitation has expired. Invitations are valid for 7 days. Please request a new invitation.",
      },
    };

    const s = states[result.reason ?? "INVALID_TOKEN"] ?? states["INVALID_TOKEN"]!;

    if (result.reason === "ALREADY_USED") {
      return (
        <InvalidState
          icon={s.icon}
          title={s.title}
          description={s.description}
          cta={
            <Link href="/login" className="w-full">
              <Button variant="navy" size="lg" className="w-full justify-center">
                Sign In to Your Account
              </Button>
            </Link>
          }
        />
      );
    }

    return <InvalidState icon={s.icon} title={s.title} description={s.description} />;
  }

  return (
    <div className="flex min-h-[75vh] items-center justify-center py-10 px-4">
      <AuthCard className="max-w-lg">
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0a2a4a]">
              <FlaskConical className="h-4.5 w-4.5 text-[#4a9d23]" />
            </div>
            <span className="text-sm font-extrabold text-[#0a2a4a] dark:text-foreground">
              FOOD <span className="text-[#4a9d23]">ANALYST</span> FORUM
            </span>
          </div>
          <AuthHeader
            title="Accept Your Invitation"
            description="Set up your account to join the Food Analyst Forum professional community."
          />
        </div>

        <InvitationAcceptanceForm
          token={rawToken}
          email={result.email ?? ""}
          fullName={result.full_name ?? ""}
          assignedRole={result.assigned_role ?? "User"}
          expiresAt={result.expires_at ?? new Date().toISOString()}
        />
      </AuthCard>
    </div>
  );
}

export default async function AcceptInvitePage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <InvalidState
        icon={ShieldX}
        title="No Invitation Token"
        description="This page requires a valid invitation link. Please check your email for the invitation."
      />
    );
  }

  return (
    <Suspense fallback={
      <div className="flex min-h-[75vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Validating invitation...</p>
      </div>
    }>
      <AcceptInviteContent rawToken={token} />
    </Suspense>
  );
}
