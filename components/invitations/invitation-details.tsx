"use client";

// components/invitations/invitation-details.tsx
// Phase 10 — Full application detail view with admin actions

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, User, Briefcase, Globe, Linkedin,
  Clock, CheckCircle, XCircle, AlertTriangle, Eye, ShieldAlert
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
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm text-[#0a2a4a] font-medium leading-tight">{String(value)}</span>
    </div>
  );
}

export function InvitationDetails({ request }: InvitationDetailsProps) {
  const router = useRouter();

  const [approveRole,      setApproveRole]      = React.useState(ALLOWED_APPROVAL_ROLES[0]);
  const [rejectReason,     setRejectReason]      = React.useState("");
  const [showRejectForm,   setShowRejectForm]    = React.useState(false);
  const [isActing,         setIsActing]          = React.useState(false);
  const [actionError,      setActionError]       = React.useState<string | null>(null);
  const [actionSuccess,    setActionSuccess]     = React.useState<string | null>(null);

  const canAct = !["rejected", "accepted", "invitation_sent"].includes(request.status);

  async function callAction(url: string, body: Record<string, unknown>) {
    setIsActing(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res  = await fetch(url, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const json = await res.json() as { success?: boolean; error?: string };

      if (!res.ok || !json.success) {
        setActionError(json.error ?? "Action failed. Please try again.");
      } else {
        setActionSuccess(
          url.includes("approve") ? "Application approved and invitation sent." :
          url.includes("reject")  ? "Application rejected." :
          "Status updated."
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
    callAction("/api/invitations/reject", { request_id: request.id, rejection_reason: rejectReason });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Back */}
      <Link
        href="/admin/invitations"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0a2a4a] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Review Queue
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-[#0a2a4a] tracking-tight">
            {request.full_name}
          </h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Application Details */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-[#4a9d23]" /> Professional Details
            </h2>
            <Card className="p-6 border-slate-200 shadow-sm bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <InfoRow label="Full Name"         value={request.full_name} />
                <InfoRow label="Email"             value={request.email} />
                <InfoRow label="Professional Title" value={request.professional_title} />
                <InfoRow label="Organization"       value={request.organization} />
                <InfoRow label="Profession"         value={request.profession} />
                <InfoRow label="Experience"         value={`${request.experience_years} year${request.experience_years !== 1 ? "s" : ""}`} />
                <InfoRow label="Region"             value={request.region} />
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Briefcase className="h-4 w-4 text-[#4a9d23]" /> Reason for Joining
            </h2>
            <Card className="p-6 border-slate-200 shadow-sm bg-white">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {request.reason}
              </p>
            </Card>
          </section>

          {(request.linkedin_url || request.website_url) && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Globe className="h-4 w-4 text-[#4a9d23]" /> Professional Links
              </h2>
              <Card className="p-6 border-slate-200 shadow-sm bg-white">
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
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <CheckCircle className="h-4 w-4 text-[#4a9d23]" /> Decision
            </h2>
            <Card className="p-6 border-slate-200 shadow-sm bg-white space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Submitted</span>
                  <span className="font-bold text-[#0a2a4a]">
                    {new Date(request.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                {request.reviewed_at && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Reviewed</span>
                    <span className="font-bold text-[#0a2a4a]">
                      {new Date(request.reviewed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                )}
                {request.approved_role && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Approved Role</span>
                    <span className="font-bold text-[#4a9d23] bg-[#4a9d23]/10 px-2 py-0.5 rounded-sm">
                      {request.approved_role}
                    </span>
                  </div>
                )}
              </div>

              {request.rejection_reason && (
                <div className="rounded-md bg-rose-50 border border-rose-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-1.5">Rejection Reason</p>
                  <p className="text-sm font-medium text-rose-700 leading-relaxed">{request.rejection_reason}</p>
                </div>
              )}

              {canAct ? (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  {/* Mark Under Review */}
                  {request.status === "pending" && (
                    <Button
                      variant="outline"
                      className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 font-semibold"
                      onClick={handleMarkUnderReview}
                      disabled={isActing}
                    >
                      <Eye className="mr-2 h-4 w-4" /> Mark Under Review
                    </Button>
                  )}

                  {/* Approve */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-md border border-slate-100">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
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
                      className="w-full justify-start border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-semibold"
                      onClick={() => setShowRejectForm(true)}
                      disabled={isActing}
                    >
                      <XCircle className="mr-2 h-4 w-4" /> Reject Application
                    </Button>
                  ) : (
                    <div className="space-y-3 p-4 border border-rose-200 rounded-md bg-rose-50/50">
                      <div>
                        <label className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block mb-1.5">
                          Rejection Reason
                        </label>
                        <Textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Provide a reason... (min 10 chars)"
                          className="bg-white border-rose-200 min-h-[80px] text-sm focus-visible:ring-rose-500"
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
                          onClick={() => { setShowRejectForm(false); setRejectReason(""); }}
                          disabled={isActing}
                          className="bg-white hover:bg-slate-100 font-semibold text-slate-600"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-md bg-slate-50 border border-slate-200 p-4">
                  <AlertTriangle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-slate-600">
                    This application has been finalized. Actions are no longer available.
                  </p>
                </div>
              )}
            </Card>
          </section>

          {/* Timeline info */}
          <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-[#4a9d23]" /> Timeline
            </h2>
            <Card className="p-5 border-slate-200 shadow-sm bg-white">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Submitted</span>
                  <span className="font-semibold text-slate-700">{new Date(request.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Last Updated</span>
                  <span className="font-semibold text-slate-700">{new Date(request.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
