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
      <Card className="hover:border-[#4a9d23] transition-all p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
        <div className="flex items-start gap-3.5 flex-1">
          <div className="h-12 w-12 rounded-2xl bg-[#0a2a4a]/10 dark:bg-primary/10 text-[#0a2a4a] dark:text-primary flex items-center justify-center overflow-hidden border border-border shrink-0">
            {job.organization?.logo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={job.organization.logo_url} alt={companyName} className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-6 w-6 text-[#4a9d23]" />
            )}
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                {companyName} <ShieldCheck className="h-3.5 w-3.5 text-[#4a9d23]" />
              </span>
              <Badge variant="outline" className="text-[10px] py-0 border-[#4a9d23]/30 text-[#4a9d23]">
                {type}
              </Badge>
            </div>
            <Link href={`/jobs/${job.id}`}>
              <h3 className="text-base font-bold text-[#0a2a4a] dark:text-foreground group-hover:text-[#4a9d23] transition-colors leading-snug">
                {job.title}
              </h3>
            </Link>
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium pt-0.5">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {location}</span>
              <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5 text-[#4a9d23]" /> {salaryFormatted}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onApplyClick && isAuthenticated ? (
            <button
              onClick={() => onApplyClick(job)}
              className="px-4 py-2 rounded-xl bg-[#4a9d23] text-white text-xs font-bold shadow-xs hover:bg-[#3d831d] transition-colors"
            >
              Quick Apply
            </button>
          ) : !isAuthenticated ? (
            <MembershipGate compact title="Members Apply" description="" />
          ) : null}
          <Link href={`/jobs/${job.id}`}>
            <button className="px-3 py-2 rounded-xl bg-accent text-xs font-bold hover:bg-accent/80 transition-colors">
              Details
            </button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="hover:border-[#4a9d23] transition-all p-5 flex flex-col justify-between group">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="h-14 w-14 rounded-2xl bg-[#0a2a4a]/10 dark:bg-primary/10 text-[#0a2a4a] dark:text-primary flex items-center justify-center overflow-hidden border border-border">
            {job.organization?.logo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={job.organization.logo_url} alt={companyName} className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-7 w-7 text-[#4a9d23]" />
            )}
          </div>
          <Badge variant="green" className="text-[10px] gap-1">
            <ShieldCheck className="h-3 w-3" /> NABL Partner
          </Badge>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
            {companyName}
          </p>
          <Link href={`/jobs/${job.id}`}>
            <h3 className="text-lg font-bold text-[#0a2a4a] dark:text-foreground group-hover:text-[#4a9d23] transition-colors leading-snug">
              {job.title}
            </h3>
          </Link>
        </div>

        <div className="space-y-2 text-xs text-muted-foreground font-semibold">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {location}
          </div>
          <div className="flex items-center gap-1.5 text-[#0a2a4a] dark:text-foreground">
            <Briefcase className="h-3.5 w-3.5 text-[#4a9d23]" /> {salaryFormatted}
          </div>
        </div>

        {job.skills_required && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {job.skills_required.map((skill) => (
              <Badge key={skill} variant="outline" className="text-[10px] px-2 py-0.5 border-border">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground font-medium">
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
          <Link href="/request-invite" className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline">
            Members Only <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <Link href={`/jobs/${job.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline">
            View Job Details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </Card>
  );
}
