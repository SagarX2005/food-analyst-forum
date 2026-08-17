"use client";

import * as React from "react";
import Link from "next/link";
import { Settings2, ArrowLeft, Save } from "lucide-react";
import { Button } from "@components/ui/button";

export default function GlobalSettingsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0a2a4a] transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Operations Centre
        </Link>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-[#0a2a4a] tracking-tight flex items-center gap-2">
              Global Platform Settings
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Super Admin workspace to configure system-wide settings, themes, and integrations.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="h-8 gap-1.5 font-semibold bg-[#0a2a4a] hover:bg-[#153e6b] text-white">
              <Save className="h-3.5 w-3.5" /> Save Configuration
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm py-24 flex flex-col items-center justify-center space-y-3 px-4 text-center">
        <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-2 border border-slate-100">
          <Settings2 className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-base font-bold text-[#0a2a4a]">Super Admin Workspace</p>
        <p className="text-sm text-slate-500 max-w-sm">The Global Platform Settings module is currently under development.</p>
      </div>
    </div>
  );
}
