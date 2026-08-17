// features/invitations/types.ts
// Phase 10A — Domain types for the Invite-Only Membership system

import type { ApprovalRole, AccessRequestStatus, InvitationStatus } from "./config";
import type { AccessRequestInput, ApproveRequestInput, RejectRequestInput } from "./schemas";

export type { ApprovalRole, AccessRequestStatus, InvitationStatus };
export type { AccessRequestInput, ApproveRequestInput, RejectRequestInput };

// ---------------------------------------------------------------------------
// Access Request
// ---------------------------------------------------------------------------

export interface AccessRequest {
  id: string;
  email: string;
  full_name: string;
  professional_title: string;
  organization: string;
  profession: string;
  experience_years: number;
  region: string;
  reason: string;
  linkedin_url: string | null;
  website_url: string | null;
  status: AccessRequestStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  approved_role: ApprovalRole | null;
  invitation_id: string | null;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Invitation
// ---------------------------------------------------------------------------

export interface Invitation {
  id: string;
  access_request_id: string;
  email: string;
  assigned_role: ApprovalRole;
  /** token_hash is stored in DB — raw token only sent in email link, never persisted */
  token_hash: string;
  status: InvitationStatus;
  expires_at: string;
  created_at: string;
  sent_at: string | null;
  accepted_at: string | null;
  revoked_at: string | null;
}

// ---------------------------------------------------------------------------
// API Response shapes
// ---------------------------------------------------------------------------

export interface SubmitAccessRequestResult {
  success: boolean;
  id?: string;
  code?: "DUPLICATE_REQUEST" | "ALREADY_MEMBER" | "VALIDATION_ERROR" | "SERVER_ERROR";
  message?: string;
}

export interface ValidateTokenResult {
  valid: boolean;
  reason?: "INVALID_TOKEN" | "ALREADY_USED" | "REVOKED" | "EXPIRED";
  invitation_id?: string;
  email?: string;
  assigned_role?: ApprovalRole;
  full_name?: string;
  expires_at?: string;
}

export interface ApproveRequestResult {
  success: boolean;
  invitation_id?: string;
  error?: string;
}
