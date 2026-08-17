"use client";

// components/invitations/membership-gate.tsx
// Phase 10A — Reusable membership gate component
// Shown to unauthenticated visitors where member-only content exists.

import Link from "next/link";
import { Lock, UserPlus } from "lucide-react";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";

interface MembershipGateProps {
  title?: string;
  description?: string;
  className?: string;
  compact?: boolean;
}

export function MembershipGate({
  title       = "Members Only",
  description = "This content is available to FAF members.",
  className,
  compact = false,
}: MembershipGateProps) {
  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-4 rounded-xl border border-dashed border-[#4a9d23]/40 bg-[#4a9d23]/5 px-4 py-3",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#4a9d23] shrink-0" />
          <span className="text-xs font-semibold text-[#0a2a4a] dark:text-foreground">
            {title}
          </span>
        </div>
        <Link href="/request-invite">
          <Button variant="green" size="sm" className="shrink-0 gap-1.5 text-xs">
            <UserPlus className="h-3.5 w-3.5" />
            Request Invite
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-dashed border-[#4a9d23]/30 bg-gradient-to-br from-[#4a9d23]/5 to-[#0a2a4a]/5 p-8 text-center space-y-4",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4a9d23]/10 text-[#4a9d23] mx-auto">
        <Lock className="h-7 w-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-extrabold text-[#0a2a4a] dark:text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link href="/request-invite">
          <Button variant="green" size="lg" className="gap-2 shadow-md">
            <UserPlus className="h-4 w-4" />
            Request an Invitation
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="lg">
            Already a member? Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}
