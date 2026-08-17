// app/admin/invitations/page.tsx
// Phase 10 — Admin: Invitation review queue

import { Metadata } from "next";
import { createClient } from "@lib/supabase/server";
import { UserPlus } from "lucide-react";
import { InvitationReviewTable } from "@components/invitations/invitation-review-table";
import { AccessRequestStatusBadge } from "@components/invitations/invitation-status-badge";
import { Card } from "@components/ui/card";
import type { AccessRequest, AccessRequestStatus } from "@features/invitations/types";

export const metadata: Metadata = {
  title: "Membership Operations — Admin",
  description: "Review and manage membership access requests for Food Analyst Forum.",
};

export const dynamic = "force-dynamic";

async function getAccessRequests(): Promise<AccessRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("access_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as AccessRequest[];
}

function StatCard({ label, value, status }: { label: string; value: number; status?: AccessRequestStatus }) {
  return (
    <Card className="p-4 flex items-start justify-between border-slate-200 shadow-sm bg-white group hover:border-[#4a9d23]/30 transition-all">
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-[#0a2a4a] tracking-tight">{value}</p>
      </div>
      {status && (
        <div className="shrink-0 scale-90 origin-top-right">
          <AccessRequestStatusBadge status={status} />
        </div>
      )}
    </Card>
  );
}

export default async function AdminInvitationsPage() {
  const requests = await getAccessRequests();

  const stats = {
    total:      requests.length,
    pending:    requests.filter((r) => r.status === "pending").length,
    reviewing:  requests.filter((r) => r.status === "under_review").length,
    approved:   requests.filter((r) => r.status === "approved" || r.status === "invitation_sent").length,
    accepted:   requests.filter((r) => r.status === "accepted").length,
    rejected:   requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-[#0a2a4a] tracking-tight flex items-center gap-2">
            Membership Operations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review professional membership requests.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
          <UserPlus className="h-4 w-4 text-amber-500" />
          <span>{stats.pending} pending review</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Apps" value={stats.total} />
        <StatCard label="Pending"     value={stats.pending}   status="pending" />
        <StatCard label="Under Review" value={stats.reviewing} status="under_review" />
        <StatCard label="Approved"    value={stats.approved}  status="approved" />
        <StatCard label="Accepted"    value={stats.accepted}  status="accepted" />
        <StatCard label="Rejected"    value={stats.rejected}  status="rejected" />
      </div>

      {/* Review Table */}
      <InvitationReviewTable requests={requests} />
    </div>
  );
}
