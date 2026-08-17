"use client";

import * as React from "react";
import { CheckCircle, XCircle, ShieldAlert, MessageSquare, Flag } from "lucide-react";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import type { ModerationItem } from "@services/adminService";

interface ModerationQueueProps {
  items: ModerationItem[];
}

export function ModerationQueue({ items }: ModerationQueueProps) {
  const [queue, setQueue] = React.useState<ModerationItem[]>(items);

  const handleResolve = (id: string) => {
    setQueue(queue.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-4">
      {queue.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm py-24 flex flex-col items-center justify-center space-y-3 px-4 text-center">
          <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-2">
            <CheckCircle className="h-6 w-6 text-emerald-400" />
          </div>
          <p className="text-base font-bold text-[#0a2a4a]">Queue is clear</p>
          <p className="text-sm text-slate-500 max-w-sm">No pending moderation flags in queue. All clear!</p>
        </div>
      ) : (
        queue.map((item) => (
          <div key={item.id} className="p-5 rounded-lg border border-slate-200 bg-white space-y-4 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100">
                  <Flag className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Reported {item.type}</span>
                    <Badge variant="outline" className="text-[10px] bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100">
                      Requires Action
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-500 font-medium mt-0.5 block">
                    Reported by <span className="font-semibold text-slate-700">{item.reportedBy}</span>
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {new Date(item.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </span>
            </div>

            <div className="pl-11">
              <h4 className="text-sm font-bold text-[#0a2a4a] flex items-start gap-2 leading-tight">
                <MessageSquare className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" /> 
                {item.title}
              </h4>
              <div className="mt-3 bg-slate-50 p-3 rounded-md border border-slate-100 relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-l-md" />
                <p className="text-sm text-slate-700 leading-relaxed pl-2 font-medium">
                  &quot;{item.reason}&quot;
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResolve(item.id)}
                className="text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 border-slate-200"
              >
                <XCircle className="mr-1.5 h-3.5 w-3.5 text-slate-400" /> Dismiss Flag
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleResolve(item.id)}
                className="text-xs font-semibold shadow-sm"
              >
                <ShieldAlert className="mr-1.5 h-3.5 w-3.5" /> Remove Content
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
