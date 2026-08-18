"use client";

import * as React from "react";
import Link from "next/link";
import { Briefcase, Search, PlusCircle, Sparkles, Building2 } from "lucide-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Card } from "@components/ui/card";
import { JobService, type FullJob, type GetJobsOptions } from "@services/jobService";
import { JobCard } from "@components/jobs/job-card";
import { JobFilters } from "@components/jobs/job-filters";
import { ApplyModal } from "@components/jobs/apply-modal";

export default function CareerPortalPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeType, setActiveType] = React.useState("all");
  const [activeSort, setActiveSort] = React.useState("latest");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const [jobs, setJobs] = React.useState<FullJob[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [selectedJob, setSelectedJob] = React.useState<FullJob | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);
  const [applySuccess, setApplySuccess] = React.useState<string | null>(null);

  const loadJobs = React.useCallback(async () => {
    setLoading(true);
    const data = await JobService.getJobs({
      employmentType: activeType,
      search: searchTerm,
      sortBy: activeSort as GetJobsOptions["sortBy"],
    });
    setJobs(data);
    setLoading(false);
  }, [activeType, searchTerm, activeSort]);

  React.useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleOpenApplyModal = (job: FullJob) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="space-y-8 py-4">
      {/* HEADER CTA BANNER */}
      <div className="border-border/60 flex flex-col items-start justify-between gap-6 border-b pb-2 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-[#4a9d23]" />
            <h1 className="dark:text-foreground text-3xl font-extrabold text-[#0a2a4a]">
              Food Analyst Career & Hiring Portal
            </h1>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Discover senior analytical chemist, NABL auditor, FSSAI quality manager, and R&D roles
            across India.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link href="/jobs/recruiter">
            <Button variant="outline" size="lg" className="gap-2">
              <Building2 className="h-4 w-4" /> Recruiter Dashboard
            </Button>
          </Link>
          <Link href="/jobs/create">
            <Button variant="green" size="lg" className="gap-2 shadow-md">
              <PlusCircle className="h-5 w-5" /> Post a Job
            </Button>
          </Link>
        </div>
      </div>

      {applySuccess && (
        <div className="rounded-2xl border border-[#4a9d23]/30 bg-[#4a9d23]/10 p-4 text-xs font-semibold text-[#4a9d23]">
          {applySuccess}
        </div>
      )}

      {/* URGENT HIRING FEATURE BANNER */}
      <Card className="from-card to-card border-2 border-[#4a9d23]/40 bg-gradient-to-r via-[#4a9d23]/5 p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#4a9d23]" />
          <span className="flex items-center gap-1 text-xs font-bold tracking-wider text-[#4a9d23] uppercase">
            <Sparkles className="h-3.5 w-3.5" /> Featured Hiring Focus 2026
          </span>
        </div>
        <h3 className="dark:text-foreground text-lg font-extrabold text-[#0a2a4a]">
          Eurofins Scientific & SGS hiring Senior Residue Chemists & Microbiologists
        </h3>
        <p className="text-muted-foreground mt-1 text-xs">
          Accredited testing facilities in Mumbai, Delhi NCR, and Bengaluru seeking specialists in
          LC-MS/MS & GC-MS pesticide screening.
        </p>
      </Card>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-3.5 left-3.5 h-4 w-4" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search job title, company name, skills (HPLC, FSSAI), or location..."
          className="h-11 pl-10"
        />
      </div>

      {/* JOB FILTERS */}
      <JobFilters
        activeType={activeType}
        onSelectType={(type) => setActiveType(type)}
        activeSort={activeSort}
        onSelectSort={(sort) => setActiveSort(sort)}
        viewMode={viewMode}
        onToggleViewMode={(mode) => setViewMode(mode)}
      />

      {/* JOBS FEED */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-muted-foreground py-16 text-center text-sm">
            Loading job postings...
          </div>
        ) : jobs.length === 0 ? (
          <div className="border-border space-y-3 rounded-3xl border-2 border-dashed p-8 py-16 text-center">
            <p className="dark:text-foreground text-base font-bold text-[#0a2a4a]">
              No open roles found matching your search.
            </p>
            <p className="text-muted-foreground text-xs">
              Try adjusting your search keywords or clear filters to view all open analytical roles.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }
          >
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                viewMode={viewMode}
                onApplyClick={handleOpenApplyModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* QUICK APPLY MODAL */}
      <ApplyModal
        job={selectedJob}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() =>
          setApplySuccess(
            "Application submitted successfully! Track progress in Candidate Dashboard.",
          )
        }
      />
    </div>
  );
}
