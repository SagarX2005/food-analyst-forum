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
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link href="/jobs" className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Career Portal
          </Link>
          <h1 className="text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
            <Building2 className="h-7 w-7 text-[#4a9d23]" /> Recruiter Hiring Pipeline Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage open postings, review candidate CVs, and track applicants across hiring stages.
          </p>
        </div>

        <Link href="/jobs/create">
          <Button variant="green" size="default" className="gap-2 shadow-md shrink-0">
            <PlusCircle className="h-4 w-4" /> Post New Job
          </Button>
        </Link>
      </div>

      {/* RECRUITER JOB SELECTOR */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
          Select Active Job Posting
        </label>
        {loading ? (
          <div className="text-xs text-muted-foreground">Loading job postings...</div>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {jobs.map((j) => (
              <button
                key={j.id}
                onClick={() => setSelectedJobId(j.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                  selectedJobId === j.id
                    ? "bg-[#4a9d23] text-white border-[#4a9d23] shadow-xs"
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
        <div className="py-12 text-center text-xs text-muted-foreground">No active job selected.</div>
      )}
    </div>
  );
}
