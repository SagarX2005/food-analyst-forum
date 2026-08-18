"use client";

import * as React from "react";
import Link from "next/link";
import { UserCheck, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@components/ui/button";

export default function AdminsManagementPage() {
  return (
    <div className="animate-in fade-in mx-auto max-w-6xl space-y-6 duration-500">
      <div>
        <Link
          href="/admin"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-[#0a2a4a]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Operations Centre
        </Link>
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-[#0a2a4a]">
              Admin Governance
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Super Admin controls to manage administrative staff, grant elevation, and revoke
              privileges.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="h-8 gap-1.5 bg-[#0a2a4a] font-semibold text-white hover:bg-[#153e6b]"
            >
              <Plus className="h-3.5 w-3.5" /> Invite Administrator
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-slate-200 bg-white px-4 py-24 text-center shadow-sm">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
          <UserCheck className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-base font-bold text-[#0a2a4a]">Super Admin Workspace</p>
        <p className="max-w-sm text-sm text-slate-500">
          The Administrative Governance module is currently under development.
        </p>
      </div>
    </div>
  );
}
