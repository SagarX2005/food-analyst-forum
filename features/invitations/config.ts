// features/invitations/config.ts
// Phase 10A — Invite-Only Membership Configuration
// Centralised constants for the invitation system.
// To make these Super Admin-configurable in future, replace with DB-sourced values.

/** Default invitation lifetime in days */
export const INVITATION_EXPIRY_DAYS = 7;

/** Roles that can be assigned through the normal invitation approval workflow.
 *  Admin and Super Admin are intentionally excluded — those are Phase 10C. */
export const ALLOWED_APPROVAL_ROLES = [
  "User",
  "Recruiter",
  "Trainer",
  "Moderator",
] as const;

export type ApprovalRole = (typeof ALLOWED_APPROVAL_ROLES)[number];

/** Access request statuses */
export const ACCESS_REQUEST_STATUSES = [
  "pending",
  "under_review",
  "approved",
  "rejected",
  "invitation_sent",
  "accepted",
  "expired",
] as const;

export type AccessRequestStatus = (typeof ACCESS_REQUEST_STATUSES)[number];

/** Invitation statuses */
export const INVITATION_STATUSES = [
  "pending",
  "sent",
  "accepted",
  "expired",
  "revoked",
] as const;

export type InvitationStatus = (typeof INVITATION_STATUSES)[number];
