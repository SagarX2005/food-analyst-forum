"use client";

import * as React from "react";
import { UserCheck, Clock, Download, ChevronRight } from "lucide-react";
import { Badge } from "@components/ui/badge";
import { Avatar } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import type { FullJobApplication } from "@services/jobService";

interface PipelineBoardProps {
  applications: FullJobApplication[];
  onUpdateStatus: (applicationId: string, status: string) => Promise<void>;
}

export function PipelineBoard({ applications, onUpdateStatus }: PipelineBoardProps) {
  const stages = ["Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-[#4a9d23]" /> Applicant Hiring Pipeline ({applications.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map((stage) => {
          const stageApps = applications.filter((a) => (a.status || "Applied") === stage);

          return (
            <div key={stage} className="rounded-2xl border border-border/80 bg-card p-3 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-xs font-bold text-foreground">{stage}</span>
                <Badge variant="outline" className="text-[10px] py-0">{stageApps.length}</Badge>
              </div>

              <div className="space-y-2">
                {stageApps.length === 0 ? (
                  <div className="py-6 text-center text-[11px] text-muted-foreground italic">No candidates</div>
                ) : (
                  stageApps.map((app) => (
                    <div key={app.id} className="p-3 rounded-xl border border-border bg-accent/30 space-y-2 hover:border-[#4a9d23] transition-colors">
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={app.applicant?.avatar_url || undefined}
                          fallback={app.applicant?.full_name || "User"}
                          size="sm"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-foreground truncate">{app.applicant?.full_name || "Applicant"}</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(app.created_at).toLocaleDateString()}</span>
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

                      <div className="pt-1 flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUpdateStatus(app.id, stage === "Applied" ? "Shortlisted" : "Selected")}
                          className="text-[10px] h-6 px-1.5 gap-0.5 text-[#4a9d23]"
                        >
                          Advance <ChevronRight className="h-3 w-3" />
                        </Button>
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
