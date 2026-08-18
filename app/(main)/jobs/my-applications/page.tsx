"use client";

import * as React from "react";
import Link from "next/link";
import { Briefcase, ArrowLeft, Clock } from "lucide-react";
import { JobService, type FullJobApplication } from "@services/jobService";
import { Badge } from "@components/ui/badge";
import { Card } from "@components/ui/card";
import { useAuth } from "@hooks/use-auth";

export default function CandidateApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = React.useState<FullJobApplication[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadUserApps() {
      if (!user) return;
      setLoading(true);
      const data = await JobService.getUserApplications(user.id);
      setApplications(data);
      setLoading(false);
    }
    loadUserApps();
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
          <Briefcase className="h-7 w-7 text-[#4a9d23]" /> My Submitted Applications
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Track the real-time status of your analytical chemist & quality auditor job applications.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-muted-foreground py-12 text-center text-xs">
            Loading your applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="text-muted-foreground space-y-2 py-12 text-center text-xs">
            <p className="font-bold">You have not submitted any job applications yet.</p>
            <Link href="/jobs">
              <span className="font-bold text-[#4a9d23] hover:underline">Browse Open Roles</span>
            </Link>
          </div>
        ) : (
          applications.map((app) => (
            <Card
              key={app.id}
              className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center"
            >
              <div className="space-y-1">
                <Badge variant="green" className="text-[10px]">
                  {app.status || "Applied"}
                </Badge>
                <h3 className="dark:text-foreground text-base font-bold text-[#0a2a4a]">
                  {app.job?.title || "Analytical Position"}
                </h3>
                <p className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Clock className="h-3.5 w-3.5" /> Submitted on{" "}
                  {new Date(app.created_at).toLocaleDateString()}
                </p>
              </div>

              {app.job && (
                <Link href={`/jobs/${app.job.id}`}>
                  <button className="bg-accent rounded-xl px-4 py-2 text-xs font-bold transition-colors hover:bg-[#4a9d23]/10 hover:text-[#4a9d23]">
                    View Job Listing
                  </button>
                </Link>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
