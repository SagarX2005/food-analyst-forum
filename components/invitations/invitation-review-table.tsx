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
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "under_review", label: "Under Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "invitation_sent", label: "Invite Sent" },
  { value: "accepted", label: "Accepted" },
  { value: "expired", label: "Expired" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function InvitationReviewTable({
  requests,
  isLoading = false,
  onRefresh,
}: InvitationReviewTableProps) {
  const [search, setSearch] = React.useState("");
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
      <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
        <div className="flex w-full flex-1 items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applicants, emails..."
              className="h-9 border-slate-200 bg-slate-50 pl-9 text-sm focus-visible:ring-[#4a9d23] focus-visible:ring-offset-0"
            />
          </div>
          <div className="relative">
            <Select
              value={statusFilter}
              options={STATUS_FILTER_OPTIONS}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 w-40 border-slate-200 bg-slate-50 text-sm"
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <span className="text-xs font-medium whitespace-nowrap text-slate-500">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-9 gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-24">
            <RefreshCw className="h-6 w-6 animate-spin text-slate-300" />
            <p className="text-sm text-slate-500">Loading access requests...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-3 px-4 py-24 text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
              <SlidersHorizontal className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-base font-bold text-[#0a2a4a]">You&apos;re all caught up</p>
            <p className="max-w-sm text-sm text-slate-500">
              There are no membership requests matching your current filters.
            </p>
            {(search || statusFilter !== "all") && (
              <Button
                variant="link"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="text-[#4a9d23]"
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-widest text-slate-500 uppercase">
                <tr>
                  <th className="rounded-tl-lg px-6 py-4 font-bold">Applicant</th>
                  <th className="px-6 py-4 font-bold">Professional Identity</th>
                  <th className="px-6 py-4 font-bold">Experience</th>
                  <th className="px-6 py-4 font-bold">Submitted</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="rounded-tr-lg px-6 py-4 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((req) => (
                  <tr key={req.id} className="group transition-colors hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#0a2a4a]">{req.full_name}</span>
                        <span className="mt-0.5 max-w-[200px] truncate text-xs text-slate-500">
                          {req.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-700">
                          {req.professional_title}
                        </span>
                        <span className="mt-0.5 text-xs text-slate-500">{req.organization}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600">
                        {req.experience_years} years
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs text-slate-500">{formatDate(req.created_at)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <AccessRequestStatusBadge status={req.status as AccessRequestStatus} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/invitations/${req.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-xs font-semibold text-slate-600 group-hover:bg-[#4a9d23]/10 group-hover:text-[#4a9d23]"
                        >
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
