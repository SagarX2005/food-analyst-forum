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

function StatCard({
  label,
  value,
  status,
}: {
  label: string;
  value: number;
  status?: AccessRequestStatus;
}) {
  return (
    <Card className="group flex items-start justify-between border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-[#4a9d23]/30">
      <div className="space-y-1">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{label}</p>
        <p className="text-2xl font-black tracking-tight text-[#0a2a4a]">{value}</p>
      </div>
      {status && (
        <div className="shrink-0 origin-top-right scale-90">
          <AccessRequestStatusBadge status={status} />
        </div>
      )}
    </Card>
  );
}

export default async function AdminInvitationsPage() {
  const requests = await getAccessRequests();

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    reviewing: requests.filter((r) => r.status === "under_review").length,
    approved: requests.filter((r) => r.status === "approved" || r.status === "invitation_sent")
      .length,
    accepted: requests.filter((r) => r.status === "accepted").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#0a2a4a]">
            Membership Operations
          </h1>
          <p className="mt-1 text-sm text-slate-500">Review professional membership requests.</p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
          <UserPlus className="h-4 w-4 text-amber-500" />
          <span>{stats.pending} pending review</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Apps" value={stats.total} />
        <StatCard label="Pending" value={stats.pending} status="pending" />
        <StatCard label="Under Review" value={stats.reviewing} status="under_review" />
        <StatCard label="Approved" value={stats.approved} status="approved" />
        <StatCard label="Accepted" value={stats.accepted} status="accepted" />
        <StatCard label="Rejected" value={stats.rejected} status="rejected" />
      </div>

      {/* Review Table */}
      <InvitationReviewTable requests={requests} />
    </div>
  );
}
