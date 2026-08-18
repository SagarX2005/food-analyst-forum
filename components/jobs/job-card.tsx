"use client";

import Link from "next/link";
import { Building2, MapPin, Briefcase, IndianRupee, ShieldCheck, ArrowRight } from "lucide-react";
import { Card } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { JobService, type FullJob } from "@services/jobService";
import { useAuth } from "@hooks/use-auth";
import { MembershipGate } from "@components/invitations/membership-gate";

interface JobCardProps {
  job: FullJob;
  viewMode?: "grid" | "list";
  onApplyClick?: (job: FullJob) => void;
}

export function JobCard({ job, viewMode = "grid", onApplyClick }: JobCardProps) {
  const companyName = job.organization?.name || "Accredited Laboratory";
  const salaryFormatted = JobService.formatSalaryRange(job.salary_min, job.salary_max);
  const location = job.location || "Mumbai, India";
  const type = job.employment_type || "Full-Time";
  const { isAuthenticated } = useAuth();

  if (viewMode === "list") {
    return (
      <Card className="group flex flex-col items-start justify-between gap-4 p-4 transition-all hover:border-[#4a9d23] sm:flex-row sm:items-center">
        <div className="flex flex-1 items-start gap-3.5">
          <div className="dark:bg-primary/10 dark:text-primary border-border flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-[#0a2a4a]/10 text-[#0a2a4a]">
            {job.organization?.logo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={job.organization.logo_url}
                alt={companyName}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-6 w-6 text-[#4a9d23]" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground flex items-center gap-1 text-xs font-bold">
                {companyName} <ShieldCheck className="h-3.5 w-3.5 text-[#4a9d23]" />
              </span>
              <Badge
                variant="outline"
                className="border-[#4a9d23]/30 py-0 text-[10px] text-[#4a9d23]"
              >
                {type}
              </Badge>
            </div>
            <Link href={`/jobs/${job.id}`}>
              <h3 className="dark:text-foreground text-base leading-snug font-bold text-[#0a2a4a] transition-colors group-hover:text-[#4a9d23]">
                {job.title}
              </h3>
            </Link>
            <div className="text-muted-foreground flex items-center gap-4 pt-0.5 text-xs font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="text-muted-foreground h-3.5 w-3.5" /> {location}
              </span>
              <span className="flex items-center gap-1">
                <IndianRupee className="h-3.5 w-3.5 text-[#4a9d23]" /> {salaryFormatted}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {onApplyClick && isAuthenticated ? (
            <button
              onClick={() => onApplyClick(job)}
              className="rounded-xl bg-[#4a9d23] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#3d831d]"
            >
              Quick Apply
            </button>
          ) : !isAuthenticated ? (
            <MembershipGate compact title="Members Apply" description="" />
          ) : null}
          <Link href={`/jobs/${job.id}`}>
            <button className="bg-accent hover:bg-accent/80 rounded-xl px-3 py-2 text-xs font-bold transition-colors">
              Details
            </button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group flex flex-col justify-between p-5 transition-all hover:border-[#4a9d23]">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="dark:bg-primary/10 dark:text-primary border-border flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border bg-[#0a2a4a]/10 text-[#0a2a4a]">
            {job.organization?.logo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={job.organization.logo_url}
                alt={companyName}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-7 w-7 text-[#4a9d23]" />
            )}
          </div>
          <Badge variant="green" className="gap-1 text-[10px]">
            <ShieldCheck className="h-3 w-3" /> NABL Partner
          </Badge>
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground flex items-center gap-1 text-xs font-bold">
            {companyName}
          </p>
          <Link href={`/jobs/${job.id}`}>
            <h3 className="dark:text-foreground text-lg leading-snug font-bold text-[#0a2a4a] transition-colors group-hover:text-[#4a9d23]">
              {job.title}
            </h3>
          </Link>
        </div>

        <div className="text-muted-foreground space-y-2 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <MapPin className="text-muted-foreground h-3.5 w-3.5" /> {location}
          </div>
          <div className="dark:text-foreground flex items-center gap-1.5 text-[#0a2a4a]">
            <Briefcase className="h-3.5 w-3.5 text-[#4a9d23]" /> {salaryFormatted}
          </div>
        </div>

        {job.skills_required && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {job.skills_required.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="border-border px-2 py-0.5 text-[10px]"
              >
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="border-border/60 mt-4 flex items-center justify-between border-t pt-4">
        <span className="text-muted-foreground text-[11px] font-medium">
          {job.applications_count || 0} Applicants
        </span>

        {isAuthenticated && onApplyClick ? (
          <button
            onClick={() => onApplyClick(job)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline"
          >
            Quick Apply <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : !isAuthenticated ? (
          <Link
            href="/request-invite"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline"
          >
            Members Only <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <Link
            href={`/jobs/${job.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline"
          >
            View Job Details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </Card>
  );
}
