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
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div>
        <Link href="/jobs" className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline mb-2">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Career Portal
        </Link>
        <h1 className="text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
          <Briefcase className="h-7 w-7 text-[#4a9d23]" /> My Submitted Applications
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track the real-time status of your analytical chemist & quality auditor job applications.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            Loading your applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
            <p className="font-bold">You have not submitted any job applications yet.</p>
            <Link href="/jobs">
              <span className="text-[#4a9d23] hover:underline font-bold">Browse Open Roles</span>
            </Link>
          </div>
        ) : (
          applications.map((app) => (
            <Card key={app.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <Badge variant="green" className="text-[10px]">
                  {app.status || "Applied"}
                </Badge>
                <h3 className="text-base font-bold text-[#0a2a4a] dark:text-foreground">
                  {app.job?.title || "Analytical Position"}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Submitted on {new Date(app.created_at).toLocaleDateString()}
                </p>
              </div>

              {app.job && (
                <Link href={`/jobs/${app.job.id}`}>
                  <button className="px-4 py-2 rounded-xl bg-accent text-xs font-bold hover:bg-[#4a9d23]/10 hover:text-[#4a9d23] transition-colors">
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
