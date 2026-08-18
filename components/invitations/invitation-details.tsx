"use client";

// components/invitations/invitation-details.tsx
// Phase 10 — Full application detail view with admin actions

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Briefcase,
  Globe,
  Linkedin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { Select } from "@components/ui/select";
import { Textarea } from "@components/ui/textarea";
import { AccessRequestStatusBadge } from "./invitation-status-badge";
import { ALLOWED_APPROVAL_ROLES } from "@features/invitations/config";
import type { AccessRequest, AccessRequestStatus } from "@features/invitations/types";

interface InvitationDetailsProps {
  request: AccessRequest;
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
        {label}
      </span>
      <span className="text-sm leading-tight font-medium text-[#0a2a4a]">{String(value)}</span>
    </div>
  );
}

export function InvitationDetails({ request }: InvitationDetailsProps) {
  const router = useRouter();

  const [approveRole, setApproveRole] = React.useState(ALLOWED_APPROVAL_ROLES[0]);
  const [rejectReason, setRejectReason] = React.useState("");
  const [showRejectForm, setShowRejectForm] = React.useState(false);
  const [isActing, setIsActing] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);

  const canAct = !["rejected", "accepted", "invitation_sent"].includes(request.status);

  async function callAction(url: string, body: Record<string, unknown>) {
    setIsActing(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !json.success) {
        setActionError(json.error ?? "Action failed. Please try again.");
      } else {
        setActionSuccess(
          url.includes("approve")
            ? "Application approved and invitation sent."
            : url.includes("reject")
              ? "Application rejected."
              : "Status updated.",
        );
        setTimeout(() => router.refresh(), 1500);
      }
    } catch {
      setActionError("Network error. Please try again.");
    } finally {
      setIsActing(false);
    }
  }

  const handleMarkUnderReview = () =>
    callAction("/api/invitations/mark-under-review", { request_id: request.id });

  const handleApprove = () =>
    callAction("/api/invitations/approve", { request_id: request.id, approved_role: approveRole });

  const handleReject = () => {
    if (!rejectReason.trim() || rejectReason.trim().length < 10) {
      setActionError("Please provide a rejection reason of at least 10 characters.");
      return;
    }
    callAction("/api/invitations/reject", {
      request_id: request.id,
      rejection_reason: rejectReason,
    });
  };

  return (
    <div className="animate-in fade-in mx-auto max-w-5xl space-y-6 duration-500">
      {/* Back */}
      <Link
        href="/admin/invitations"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-[#0a2a4a]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Review Queue
      </Link>

      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0a2a4a]">{request.full_name}</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            {request.email}
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="font-semibold text-slate-700">{request.organization}</span>
          </p>
        </div>
        <div className="shrink-0">
          <AccessRequestStatusBadge status={request.status as AccessRequestStatus} />
        </div>
      </div>

      {/* Feedback banners */}
      {actionError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 shadow-sm">
          <ShieldAlert className="h-5 w-5 text-red-500" />
          {actionError}
        </div>
      )}
      {actionSuccess && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800 shadow-sm">
          <CheckCircle className="h-5 w-5 text-emerald-500" />
          {actionSuccess}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Application Details */}
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
              <User className="h-4 w-4 text-[#4a9d23]" /> Professional Details
            </h2>
            <Card className="border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <InfoRow label="Full Name" value={request.full_name} />
                <InfoRow label="Email" value={request.email} />
                <InfoRow label="Professional Title" value={request.professional_title} />
                <InfoRow label="Organization" value={request.organization} />
                <InfoRow label="Profession" value={request.profession} />
                <InfoRow
                  label="Experience"
                  value={`${request.experience_years} year${request.experience_years !== 1 ? "s" : ""}`}
                />
                <InfoRow label="Region" value={request.region} />
              </div>
            </Card>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
              <Briefcase className="h-4 w-4 text-[#4a9d23]" /> Reason for Joining
            </h2>
            <Card className="border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm leading-relaxed whitespace-pre-line text-slate-700">
                {request.reason}
              </p>
            </Card>
          </section>

          {(request.linkedin_url || request.website_url) && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
                <Globe className="h-4 w-4 text-[#4a9d23]" /> Professional Links
              </h2>
              <Card className="border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3">
                  {request.linkedin_url && (
                    <a
                      href={request.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <Linkedin className="h-4 w-4" /> View LinkedIn Profile
                    </a>
                  )}
                  {request.website_url && (
                    <a
                      href={request.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:underline"
                    >
                      <Globe className="h-4 w-4" /> View Professional Website
                    </a>
                  )}
                </div>
              </Card>
            </section>
          )}
        </div>

        {/* Right: Review Actions */}
        <div className="space-y-6">
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
              <CheckCircle className="h-4 w-4 text-[#4a9d23]" /> Decision
            </h2>
            <Card className="space-y-6 border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Submitted</span>
                  <span className="font-bold text-[#0a2a4a]">
                    {new Date(request.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {request.reviewed_at && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500">Reviewed</span>
                    <span className="font-bold text-[#0a2a4a]">
                      {new Date(request.reviewed_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {request.approved_role && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500">Approved Role</span>
                    <span className="rounded-sm bg-[#4a9d23]/10 px-2 py-0.5 font-bold text-[#4a9d23]">
                      {request.approved_role}
                    </span>
                  </div>
                )}
              </div>

              {request.rejection_reason && (
                <div className="rounded-md border border-rose-100 bg-rose-50 p-4">
                  <p className="mb-1.5 text-[10px] font-bold tracking-widest text-rose-500 uppercase">
                    Rejection Reason
                  </p>
                  <p className="text-sm leading-relaxed font-medium text-rose-700">
                    {request.rejection_reason}
                  </p>
                </div>
              )}

              {canAct ? (
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  {/* Mark Under Review */}
                  {request.status === "pending" && (
                    <Button
                      variant="outline"
                      className="w-full justify-start border-blue-200 font-semibold text-blue-700 hover:border-blue-300 hover:bg-blue-50"
                      onClick={handleMarkUnderReview}
                      disabled={isActing}
                    >
                      <Eye className="mr-2 h-4 w-4" /> Mark Under Review
                    </Button>
                  )}

                  {/* Approve */}
                  <div className="space-y-3 rounded-md border border-slate-100 bg-slate-50 p-4">
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                        Assign Member Role
                      </label>
                      <Select
                        value={approveRole}
                        options={ALLOWED_APPROVAL_ROLES.map((r) => ({ value: r, label: r }))}
                        onChange={(e) => setApproveRole(e.target.value as typeof approveRole)}
                        className="bg-white"
                      />
                    </div>
                    <Button
                      variant="green"
                      className="w-full font-bold shadow-sm"
                      onClick={handleApprove}
                      disabled={isActing}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {isActing ? "Approving..." : "Approve & Invite"}
                    </Button>
                  </div>

                  {/* Reject */}
                  {!showRejectForm ? (
                    <Button
                      variant="outline"
                      className="w-full justify-start border-rose-200 font-semibold text-rose-600 hover:border-rose-300 hover:bg-rose-50"
                      onClick={() => setShowRejectForm(true)}
                      disabled={isActing}
                    >
                      <XCircle className="mr-2 h-4 w-4" /> Reject Application
                    </Button>
                  ) : (
                    <div className="space-y-3 rounded-md border border-rose-200 bg-rose-50/50 p-4">
                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-rose-500 uppercase">
                          Rejection Reason
                        </label>
                        <Textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Provide a reason... (min 10 chars)"
                          className="min-h-[80px] border-rose-200 bg-white text-sm focus-visible:ring-rose-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          className="flex-1 font-bold shadow-sm"
                          onClick={handleReject}
                          disabled={isActing}
                        >
                          {isActing ? "Rejecting..." : "Confirm Reject"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowRejectForm(false);
                            setRejectReason("");
                          }}
                          disabled={isActing}
                          className="bg-white font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                  <p className="text-sm font-medium text-slate-600">
                    This application has been finalized. Actions are no longer available.
                  </p>
                </div>
              )}
            </Card>
          </section>

          {/* Timeline info */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
              <Clock className="h-4 w-4 text-[#4a9d23]" /> Timeline
            </h2>
            <Card className="border-slate-200 bg-white p-5 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Submitted</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(request.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Last Updated</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(request.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
