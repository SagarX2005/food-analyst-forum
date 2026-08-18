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
        <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-slate-200 bg-white px-4 py-24 text-center shadow-sm">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
            <CheckCircle className="h-6 w-6 text-emerald-400" />
          </div>
          <p className="text-base font-bold text-[#0a2a4a]">Queue is clear</p>
          <p className="max-w-sm text-sm text-slate-500">
            No pending moderation flags in queue. All clear!
          </p>
        </div>
      ) : (
        queue.map((item) => (
          <div
            key={item.id}
            className="group space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-rose-100 bg-rose-50 text-rose-500">
                  <Flag className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                      Reported {item.type}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-rose-200 bg-rose-50 text-[10px] text-rose-700 hover:bg-rose-100"
                    >
                      Requires Action
                    </Badge>
                  </div>
                  <span className="mt-0.5 block text-xs font-medium text-slate-500">
                    Reported by{" "}
                    <span className="font-semibold text-slate-700">{item.reportedBy}</span>
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {new Date(item.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="pl-11">
              <h4 className="flex items-start gap-2 text-sm leading-tight font-bold text-[#0a2a4a]">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                {item.title}
              </h4>
              <div className="relative mt-3 rounded-md border border-slate-100 bg-slate-50 p-3">
                <div className="absolute top-0 bottom-0 left-0 w-1 rounded-l-md bg-amber-400" />
                <p className="pl-2 text-sm leading-relaxed font-medium text-slate-700">
                  &quot;{item.reason}&quot;
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResolve(item.id)}
                className="border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
