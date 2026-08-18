"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, PlusCircle, ArrowLeft } from "lucide-react";
import { Button } from "@components/ui/button";
import { JobService, type FullJob, type FullJobApplication } from "@services/jobService";
import { PipelineBoard } from "@components/jobs/pipeline-board";
import { useAuth } from "@hooks/use-auth";

export default function RecruiterDashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = React.useState<FullJob[]>([]);
  const [selectedJobId, setSelectedJobId] = React.useState<string | null>(null);
  const [applications, setApplications] = React.useState<FullJobApplication[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadRecruiterJobs() {
      if (!user) return;
      setLoading(true);
      const data = await JobService.getJobs({ limit: 10 });
      setJobs(data);
      if (data.length > 0 && data[0]) {
        setSelectedJobId(data[0].id);
      }
      setLoading(false);
    }
    loadRecruiterJobs();
  }, [user]);

  const loadApplications = React.useCallback(async () => {
    if (!selectedJobId) return;
    const apps = await JobService.getRecruiterApplications(selectedJobId);
    setApplications(apps);
  }, [selectedJobId]);

  React.useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleUpdateStatus = async (appId: string, status: string) => {
    await JobService.updateApplicationStatus(appId, status);
    loadApplications();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/jobs"
            className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Career Portal
          </Link>
          <h1 className="dark:text-foreground flex items-center gap-2 text-3xl font-extrabold text-[#0a2a4a]">
            <Building2 className="h-7 w-7 text-[#4a9d23]" /> Recruiter Hiring Pipeline Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage open postings, review candidate CVs, and track applicants across hiring stages.
          </p>
        </div>

        <Link href="/jobs/create">
          <Button variant="green" size="default" className="shrink-0 gap-2 shadow-md">
            <PlusCircle className="h-4 w-4" /> Post New Job
          </Button>
        </Link>
      </div>

      {/* RECRUITER JOB SELECTOR */}
      <div className="space-y-3">
        <label className="text-foreground block text-xs font-bold tracking-wider uppercase">
          Select Active Job Posting
        </label>
        {loading ? (
          <div className="text-muted-foreground text-xs">Loading job postings...</div>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {jobs.map((j) => (
              <button
                key={j.id}
                onClick={() => setSelectedJobId(j.id)}
                className={`rounded-xl border px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                  selectedJobId === j.id
                    ? "border-[#4a9d23] bg-[#4a9d23] text-white shadow-xs"
                    : "bg-card text-foreground border-border hover:border-[#4a9d23]"
                }`}
              >
                {j.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* PIPELINE BOARD */}
      {selectedJobId ? (
        <PipelineBoard applications={applications} onUpdateStatus={handleUpdateStatus} />
      ) : (
        <div className="text-muted-foreground py-12 text-center text-xs">
          No active job selected.
        </div>
      )}
    </div>
  );
}
