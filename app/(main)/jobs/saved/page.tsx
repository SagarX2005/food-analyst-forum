"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, ArrowLeft } from "lucide-react";
import { JobService, type FullJob } from "@services/jobService";
import { JobCard } from "@components/jobs/job-card";
import { useAuth } from "@hooks/use-auth";

export default function SavedJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = React.useState<FullJob[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadSaved() {
      if (!user) return;
      setLoading(true);
      const data = await JobService.getJobs({ sortBy: "salary", limit: 10 });
      setJobs(data);
      setLoading(false);
    }
    loadSaved();
  }, [user]);

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
      <div>
        <Link
          href="/jobs"
          className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Career Portal
        </Link>
        <h1 className="dark:text-foreground flex items-center gap-2 text-3xl font-extrabold text-[#0a2a4a]">
          <Bookmark className="h-7 w-7 text-[#4a9d23]" /> Saved Jobs & Bookmarks
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Quick access to bookmarked analytical chemist, QA, and lab management roles.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-muted-foreground py-12 text-center text-xs">
            Loading saved jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center text-xs">
            You have not bookmarked any jobs yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
