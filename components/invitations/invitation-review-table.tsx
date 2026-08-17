"use client";

// components/invitations/invitation-review-table.tsx
// Phase 10 — Admin invitation review queue table

import * as React from "react";
import Link from "next/link";
import { ChevronRight, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Select } from "@components/ui/select";
import { AccessRequestStatusBadge } from "./invitation-status-badge";
import type { AccessRequest, AccessRequestStatus } from "@features/invitations/types";

interface InvitationReviewTableProps {
  requests: AccessRequest[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const STATUS_FILTER_OPTIONS = [
  { value: "all",             label: "All Statuses" },
  { value: "pending",         label: "Pending" },
  { value: "under_review",    label: "Under Review" },
  { value: "approved",        label: "Approved" },
  { value: "rejected",        label: "Rejected" },
  { value: "invitation_sent", label: "Invite Sent" },
  { value: "accepted",        label: "Accepted" },
  { value: "expired",         label: "Expired" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}

export function InvitationReviewTable({
  requests,
  isLoading = false,
  onRefresh,
}: InvitationReviewTableProps) {
  const [search,       setSearch]       = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filtered = requests.filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.full_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.organization.toLowerCase().includes(q) ||
      r.profession.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex flex-1 w-full items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applicants, emails..."
              className="pl-9 h-9 text-sm bg-slate-50 border-slate-200 focus-visible:ring-[#4a9d23] focus-visible:ring-offset-0"
            />
          </div>
          <div className="relative">
            <Select
              value={statusFilter}
              options={STATUS_FILTER_OPTIONS}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40 h-9 text-sm bg-slate-50 border-slate-200"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-9 gap-1.5 text-slate-600 border-slate-200 hover:bg-slate-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <RefreshCw className="h-6 w-6 text-slate-300 animate-spin" />
            <p className="text-sm text-slate-500">Loading access requests...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-3 px-4">
            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-2">
              <SlidersHorizontal className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-base font-bold text-[#0a2a4a]">You&apos;re all caught up</p>
            <p className="text-sm text-slate-500 max-w-sm">There are no membership requests matching your current filters.</p>
            {(search || statusFilter !== 'all') && (
              <Button variant="link" onClick={() => { setSearch(""); setStatusFilter("all"); }} className="text-[#4a9d23]">
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-widest font-semibold sticky top-0">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg font-bold">Applicant</th>
                  <th className="px-6 py-4 font-bold">Professional Identity</th>
                  <th className="px-6 py-4 font-bold">Experience</th>
                  <th className="px-6 py-4 font-bold">Submitted</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 rounded-tr-lg font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0a2a4a] text-sm">{req.full_name}</span>
                        <span className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">{req.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700 text-xs">{req.professional_title}</span>
                        <span className="text-xs text-slate-500 mt-0.5">{req.organization}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600">{req.experience_years} years</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs text-slate-500">{formatDate(req.created_at)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <AccessRequestStatusBadge status={req.status as AccessRequestStatus} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/invitations/${req.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs font-semibold text-slate-600 group-hover:text-[#4a9d23] group-hover:bg-[#4a9d23]/10">
                          Review <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
