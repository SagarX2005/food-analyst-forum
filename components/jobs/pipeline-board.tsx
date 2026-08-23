"use client";

import * as React from "react";
import { UserCheck, Clock, Download } from "lucide-react";
import { Badge } from "@components/ui/badge";
import { Avatar } from "@components/ui/avatar";
import type { FullJobApplication } from "@services/jobService";

interface PipelineBoardProps {
  applications: FullJobApplication[];
  onUpdateStatus: (applicationId: string, status: string) => Promise<void>;
}

const STAGE_MAPPING = [
  { id: "submitted", label: "Applied" },
  { id: "reviewing", label: "Screening" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "hired", label: "Hired" },
  { id: "rejected", label: "Rejected" },
];

export function PipelineBoard({ applications, onUpdateStatus }: PipelineBoardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="dark:text-foreground flex items-center gap-2 text-lg font-bold text-[#0a2a4a]">
          <UserCheck className="h-5 w-5 text-[#4a9d23]" /> Candidate Pipeline ({applications.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {STAGE_MAPPING.map((stage) => {
          const stageApps = applications.filter((a) => a.status === stage.id);

          return (
            <div
              key={stage.id}
              className="border-border/80 bg-card space-y-3 rounded-2xl border p-3 shadow-xs flex flex-col h-full min-h-[300px]"
            >
              <div className="border-border/60 flex items-center justify-between border-b pb-2">
                <span className="text-foreground text-xs font-bold uppercase tracking-wider">{stage.label}</span>
                <Badge variant="outline" className="py-0 text-[10px]">
                  {stageApps.length}
                </Badge>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto">
                {stageApps.length === 0 ? (
                  <div className="text-muted-foreground py-6 text-center text-[11px] italic">
                    No candidates
                  </div>
                ) : (
                  stageApps.map((app) => (
                    <div
                      key={app.id}
                      className="border-border bg-accent/30 space-y-2 rounded-xl border p-3 transition-colors hover:border-[#4a9d23]"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={app.applicant?.avatar_url || undefined}
                          fallback={app.applicant?.full_name || "User"}
                          size="sm"
                        />
                        <div className="flex min-w-0 flex-col">
                          <span className="text-foreground truncate text-xs font-bold">
                            {app.applicant?.full_name || "Applicant"}
                          </span>
                          <span className="text-muted-foreground flex items-center gap-1 text-[10px]">
                            <Clock className="h-3 w-3" />{" "}
                            {new Date(app.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {app.resume_url && (
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4a9d23] hover:underline"
                        >
                          <Download className="h-3 w-3" /> View Resume
                        </a>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <select
                          className="h-7 w-full rounded-md border border-input bg-transparent px-2 text-[10px] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          value={app.status}
                          onChange={(e) => onUpdateStatus(app.id, e.target.value)}
                        >
                          {STAGE_MAPPING.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              Move to {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

