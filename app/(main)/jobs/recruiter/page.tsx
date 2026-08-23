"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  PlusCircle,
  Users,
  Briefcase,
  AlertCircle,
  LayoutDashboard,
  Settings,
  Search,
  UserCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Avatar } from "@components/ui/avatar";
import { Badge } from "@components/ui/badge";
import { JobService, type FullJob, type FullJobApplication } from "@services/jobService";
import { PipelineBoard } from "@components/jobs/pipeline-board";
import { useAuth } from "@hooks/use-auth";

export default function RecruiterDashboardPage() {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = React.useState<FullJob[]>([]);
  const [applications, setApplications] = React.useState<FullJobApplication[]>([]);
  const [selectedJobId, setSelectedJobId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [currentTab, setCurrentTab] = React.useState<"overview" | "pipeline" | "jobs">("overview");

  const loadData = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const recruiterJobs = await JobService.getJobs({ limit: 50, recruiterId: user.id });
    setJobs(recruiterJobs);

    const appsPromises = recruiterJobs.map((job) => JobService.getRecruiterApplications(job.id!));
    const appsArrays = await Promise.all(appsPromises);
    const allApps = appsArrays.flat().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    setApplications(allApps);

    if (recruiterJobs.length > 0 && !selectedJobId && recruiterJobs[0]) {
      setSelectedJobId(recruiterJobs[0].id);
    }
    setLoading(false);
  }, [user, selectedJobId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateStatus = async (appId: string, status: string) => {
    await JobService.updateApplicationStatus(appId, status);
    loadData();
  };

  const activeJobsCount = jobs.filter(j => j.status === "active").length;
  const shortlistedCount = applications.filter(a => a.status === "shortlisted").length;
  
  const needsAttentionApps = applications.filter(a => a.status === "submitted" || a.status === "reviewing").slice(0, 5);
  const recentApps = applications.slice(0, 5);
  const selectedJobApps = applications.filter(a => a.status !== "rejected" && a.job_id === selectedJobId);

  if (loading) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Loading Hiring Command Center...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl py-4 flex flex-col md:flex-row gap-8 min-h-[80vh]">
      
      {/* COMPACT RECRUITER SIDEBAR */}
      <div className="w-full md:w-56 shrink-0 space-y-6">
        <div className="flex items-center gap-2 px-2">
          <Building2 className="h-6 w-6 text-[#4a9d23]" />
          <span className="font-extrabold text-[#0a2a4a] text-lg tracking-tight">Recruiting</span>
        </div>
        
        <nav className="space-y-1">
          <div className="text-xs font-bold tracking-wider text-muted-foreground mb-2 px-2">HIRING</div>
          <button 
            onClick={() => setCurrentTab("overview")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${currentTab === "overview" ? "bg-[#4a9d23]/10 text-[#4a9d23]" : "text-foreground hover:bg-accent"}`}
          >
            <LayoutDashboard className="h-4 w-4" /> Overview
          </button>
          <button 
            onClick={() => setCurrentTab("jobs")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${currentTab === "jobs" ? "bg-[#4a9d23]/10 text-[#4a9d23]" : "text-foreground hover:bg-accent"}`}
          >
            <Briefcase className="h-4 w-4" /> My Jobs
          </button>
          <button 
            onClick={() => setCurrentTab("pipeline")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${currentTab === "pipeline" ? "bg-[#4a9d23]/10 text-[#4a9d23]" : "text-foreground hover:bg-accent"}`}
          >
            <Users className="h-4 w-4" /> Candidate Pipeline
          </button>
        </nav>

        <nav className="space-y-1 pt-4 border-t">
          <div className="text-xs font-bold tracking-wider text-muted-foreground mb-2 px-2">TOOLS</div>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-foreground hover:bg-accent opacity-50 cursor-not-allowed" title="Not yet implemented">
            <Search className="h-4 w-4" /> Find Candidates
          </button>
        </nav>

        <nav className="space-y-1 pt-4 border-t">
          <div className="text-xs font-bold tracking-wider text-muted-foreground mb-2 px-2">ACCOUNT</div>
          <Link href="/profile/edit" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-foreground hover:bg-accent">
            <UserCircle className="h-4 w-4" /> My Profile
          </Link>
          <Link href="/settings" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-foreground hover:bg-accent">
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </nav>
      </div>

      {/* MAIN DASHBOARD WORKSPACE */}
      <div className="flex-1 space-y-8 min-w-0">
        
        {/* DASHBOARD HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0a2a4a] dark:text-foreground">Good morning, {profile?.full_name || 'Recruiter'}</h1>
            <p className="text-muted-foreground text-sm mt-1">Here&apos;s what&apos;s happening with your hiring today.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="outline" size="sm" className="gap-2" disabled title="Candidate search not yet implemented">
              <Search className="h-4 w-4" /> Find Candidates
            </Button>
            <Link href="/jobs/create">
              <Button variant="green" size="sm" className="gap-2 shadow-sm">
                <PlusCircle className="h-4 w-4" /> Create Job
              </Button>
            </Link>
          </div>
        </div>

        {currentTab === "overview" && (
          <>
            {/* HIRING SNAPSHOT */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">Hiring Snapshot</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="hover:border-[#4a9d23] transition-colors">
                  <CardContent className="p-5 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Active Jobs</p>
                    <p className="text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground">{activeJobsCount}</p>
                  </CardContent>
                </Card>
                <Card className="hover:border-[#4a9d23] transition-colors">
                  <CardContent className="p-5 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Total Applications</p>
                    <p className="text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground">{applications.length}</p>
                  </CardContent>
                </Card>
                <Card className="hover:border-[#4a9d23] transition-colors">
                  <CardContent className="p-5 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Shortlisted</p>
                    <p className="text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground">{shortlistedCount}</p>
                  </CardContent>
                </Card>
                <Card className="opacity-60 bg-muted/30">
                  <CardContent className="p-5 flex flex-col justify-center relative group">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Interviews</p>
                    <p className="text-3xl font-extrabold text-muted-foreground">-</p>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-background/80 transition-opacity backdrop-blur-sm rounded-xl">
                      <span className="text-[10px] font-bold text-center px-2">Not yet implemented</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* TWO COLUMN CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* NEEDS YOUR ATTENTION */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold tracking-wider text-[#d93025] flex items-center gap-2 uppercase">
                  <AlertCircle className="h-4 w-4" /> Needs your attention
                </h2>
                {needsAttentionApps.length === 0 ? (
                  <Card className="border-dashed bg-accent/30">
                    <CardContent className="p-8 text-center text-sm text-muted-foreground">
                      You&apos;re all caught up! No applications require immediate attention.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {needsAttentionApps.map(app => (
                      <Card key={app.id} className="border-l-4 border-l-[#d93025] shadow-xs">
                        <CardContent className="p-4 flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">
                              {app.applicant?.full_name} <span className="font-normal text-muted-foreground">applied for</span> {app.job?.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Status: {app.status}</p>
                          </div>
                          <Button size="sm" variant="outline" className="shrink-0 text-xs h-7 px-2" onClick={() => setCurrentTab("pipeline")}>
                            Review
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* RECENT APPLICATIONS */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">Recent Applications</h2>
                {recentApps.length === 0 ? (
                  <Card className="border-dashed bg-accent/30">
                    <CardContent className="p-8 text-center text-sm text-muted-foreground">
                      Applications will appear here when candidates apply to your jobs.
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <div className="divide-y">
                      {recentApps.map(app => (
                        <div key={app.id} className="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar src={app.applicant?.avatar_url || undefined} fallback={app.applicant?.full_name || "C"} size="sm" />
                            <div className="min-w-0">
                              <p className="text-sm font-bold truncate">{app.applicant?.full_name}</p>
                              <p className="text-xs text-muted-foreground truncate">{app.job?.title}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end shrink-0 gap-1">
                            <span className="text-[10px] text-muted-foreground">{new Date(app.created_at).toLocaleDateString()}</span>
                            <Badge variant="outline" className="text-[10px] py-0">{app.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}

        {currentTab === "pipeline" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">Filter by Job:</span>
              {jobs.map(j => (
                <button
                  key={j.id}
                  onClick={() => setSelectedJobId(j.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedJobId === j.id
                      ? "bg-[#0a2a4a] text-white"
                      : "bg-accent text-foreground hover:bg-accent/80"
                  }`}
                >
                  {j.title}
                </button>
              ))}
            </div>
            
            {selectedJobId ? (
              <PipelineBoard applications={selectedJobApps} onUpdateStatus={handleUpdateStatus} />
            ) : (
              <div className="text-center py-12 text-sm text-muted-foreground border rounded-xl border-dashed">
                Select a job above to view its candidate pipeline.
              </div>
            )}
          </div>
        )}

        {currentTab === "jobs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">My Active Jobs</h2>
            </div>
            
            {jobs.length === 0 ? (
              <Card className="border-dashed bg-accent/30">
                <CardContent className="p-12 text-center flex flex-col items-center">
                  <Briefcase className="h-10 w-10 text-muted-foreground/50 mb-4" />
                  <p className="text-sm text-foreground font-semibold mb-2">You haven&apos;t posted any jobs yet.</p>
                  <Link href="/jobs/create">
                    <Button variant="green" size="sm" className="mt-2 shadow-sm gap-2">
                      <PlusCircle className="h-4 w-4" /> Create your first job
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {jobs.map(job => {
                  const jobApps = applications.filter(a => a.job_id === job.id);
                  const jobShortlisted = jobApps.filter(a => a.status === "shortlisted").length;
                  return (
                    <Card key={job.id} className="hover:border-[#4a9d23] transition-colors overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="p-5 flex-1 min-w-0 border-b sm:border-b-0 sm:border-r">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Link href={`/jobs/${job.slug}`} className="text-lg font-bold text-[#0a2a4a] dark:text-foreground hover:underline truncate block">
                                {job.title}
                              </Link>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {job.location || 'Remote'}</span>
                                <span className="uppercase font-semibold">{job.job_type?.replace('_', ' ') || 'Full-time'}</span>
                                <Badge variant={job.status === 'active' ? 'green' : 'outline'} className="text-[10px] py-0 px-1.5 uppercase">
                                  {job.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="p-5 flex flex-col items-center justify-center min-w-[120px] bg-accent/30 border-r">
                            <span className="text-2xl font-extrabold text-[#0a2a4a] dark:text-foreground">{jobApps.length}</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Applications</span>
                          </div>
                          <div className="p-5 flex flex-col items-center justify-center min-w-[120px] bg-accent/30 border-r">
                            <span className="text-2xl font-extrabold text-[#4a9d23]">{jobShortlisted}</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Shortlisted</span>
                          </div>
                          <div className="p-5 flex items-center justify-center bg-accent/10">
                            <Button 
                              variant="ghost" 
                              className="gap-1 text-xs text-[#4a9d23]"
                              onClick={() => {
                                setSelectedJobId(job.id);
                                setCurrentTab("pipeline");
                              }}
                            >
                              Manage <ArrowRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
