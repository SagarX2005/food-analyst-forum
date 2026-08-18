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
    <div className="animate-in fade-in mx-auto max-w-5xl space-y-6 duration-500">
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
              Forum Moderation Queue
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review community reports and enforce scientific discussion standards.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 bg-white font-semibold text-slate-600"
            >
              <Filter className="h-3.5 w-3.5" /> Filter Queue
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadQueue}
              disabled={loading}
              className="h-8 gap-1.5 bg-white font-semibold text-slate-600"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-slate-200 bg-white py-24 shadow-sm">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#4a9d23]" />
          <p className="text-sm text-slate-500">Loading moderation queue...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-slate-200 bg-white px-4 py-24 text-center shadow-sm">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
            <MessageSquare className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-base font-bold text-[#0a2a4a]">Queue is empty</p>
          <p className="max-w-sm text-sm text-slate-500">No items currently require moderation.</p>
        </div>
      ) : (
        <ModerationQueue items={items} />
      )}
    </div>
  );
}
