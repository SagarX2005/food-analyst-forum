"use client";

import * as React from "react";
import Link from "next/link";
import { Newspaper, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@components/ui/button";

export default function NewsManagementPage() {
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
              News & Announcements
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Publish industry news, platform updates, and manage announcement banners.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="h-8 gap-1.5 bg-[#4a9d23] font-semibold text-white hover:bg-[#3d831c]"
            >
              <Plus className="h-3.5 w-3.5" /> Publish Article
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-slate-200 bg-white px-4 py-24 text-center shadow-sm">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
          <Newspaper className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-base font-bold text-[#0a2a4a]">Coming Soon</p>
        <p className="max-w-sm text-sm text-slate-500">
          The News & Announcements module is currently under development.
        </p>
      </div>
    </div>
  );
}
