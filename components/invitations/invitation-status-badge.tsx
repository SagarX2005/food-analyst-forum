"use client";

// components/invitations/invitation-status-badge.tsx
// Phase 10A — Status badge for access requests and invitations

import { Badge } from "@components/ui/badge";
import { cn } from "@lib/utils";
import type { AccessRequestStatus, InvitationStatus } from "@features/invitations/types";

const ACCESS_REQUEST_CONFIG: Record<AccessRequestStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  under_review: {
    label: "Under Review",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  approved: { label: "Approved", className: "bg-[#4a9d23]/15 text-[#4a9d23] dark:text-[#6bc93a]" },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  invitation_sent: {
    label: "Invite Sent",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
  accepted: {
    label: "Accepted",
    className: "bg-[#0a2a4a]/10 text-[#0a2a4a] dark:bg-[#0a2a4a]/40 dark:text-blue-200",
  },
  expired: {
    label: "Expired",
    className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
};

const INVITATION_CONFIG: Record<InvitationStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-800" },
  sent: { label: "Sent", className: "bg-blue-100 text-blue-800" },
  accepted: { label: "Accepted", className: "bg-[#4a9d23]/15 text-[#4a9d23]" },
  expired: { label: "Expired", className: "bg-gray-100 text-gray-600" },
  revoked: { label: "Revoked", className: "bg-red-100 text-red-700" },
};

interface AccessRequestStatusBadgeProps {
  status: AccessRequestStatus;
  className?: string;
}

export function AccessRequestStatusBadge({ status, className }: AccessRequestStatusBadgeProps) {
  const cfg = ACCESS_REQUEST_CONFIG[status] ?? { label: status, className: "" };
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent text-xs font-semibold tracking-wide uppercase",
        cfg.className,
        className,
      )}
    >
      {cfg.label}
    </Badge>
  );
}

interface InvitationStatusBadgeProps {
  status: InvitationStatus;
  className?: string;
}

export function InvitationStatusBadge({ status, className }: InvitationStatusBadgeProps) {
  const cfg = INVITATION_CONFIG[status] ?? { label: status, className: "" };
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent text-xs font-semibold tracking-wide uppercase",
        cfg.className,
        className,
      )}
    >
      {cfg.label}
    </Badge>
  );
}
