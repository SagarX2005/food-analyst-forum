"use client";

import * as React from "react";
import Link from "next/link";
import { MessageSquare, ArrowLeft, RefreshCw, Filter } from "lucide-react";
import { Button } from "@components/ui/button";
import { AdminService, type ModerationItem } from "@services/adminService";
import { ModerationQueue } from "@components/admin/moderation-queue";

export default function ForumModerationPage() {
  const [items, setItems] = React.useState<ModerationItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadQueue = React.useCallback(async () => {
    setLoading(true);
    const data = await AdminService.getModerationItems();
    setItems(data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0a2a4a] transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Operations Centre
        </Link>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-[#0a2a4a] tracking-tight flex items-center gap-2">
              Forum Moderation Queue
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review community reports and enforce scientific discussion standards.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-slate-600 font-semibold bg-white">
              <Filter className="h-3.5 w-3.5" /> Filter Queue
            </Button>
            <Button variant="outline" size="sm" onClick={loadQueue} disabled={loading} className="h-8 gap-1.5 text-slate-600 font-semibold bg-white">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm py-24 flex flex-col items-center justify-center space-y-4">
          <div className="h-6 w-6 border-2 border-slate-200 border-t-[#4a9d23] rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading moderation queue...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm py-24 flex flex-col items-center justify-center space-y-3 px-4 text-center">
          <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-2">
            <MessageSquare className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-base font-bold text-[#0a2a4a]">Queue is empty</p>
          <p className="text-sm text-slate-500 max-w-sm">No items currently require moderation.</p>
        </div>
      ) : (
        <ModerationQueue items={items} />
      )}
    </div>
  );
}
