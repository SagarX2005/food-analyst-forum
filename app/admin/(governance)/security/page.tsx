"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Download } from "lucide-react";
import { Button } from "@components/ui/button";

export default function SecurityManagementPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0a2a4a] transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Operations Centre
        </Link>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-[#0a2a4a] tracking-tight flex items-center gap-2">
              Security Compliance
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Super Admin workspace for data compliance, security posture, and infrastructure compliance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="h-8 gap-1.5 font-semibold text-slate-600 bg-white">
              <Download className="h-3.5 w-3.5" /> Download Report
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm py-24 flex flex-col items-center justify-center space-y-3 px-4 text-center">
        <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-2 border border-slate-100">
          <ShieldAlert className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-base font-bold text-[#0a2a4a]">Super Admin Workspace</p>
        <p className="text-sm text-slate-500 max-w-sm">The Security Compliance module is currently under development.</p>
      </div>
    </div>
  );
}
