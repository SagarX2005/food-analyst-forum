import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Briefcase, IndianRupee, ShieldCheck, Building2, Bookmark, Clock } from "lucide-react";
import { JobService } from "@services/jobService";
import { Badge } from "@components/ui/badge";
import { Card } from "@components/ui/card";
import { QuickApplyContainer } from "./apply-container";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await JobService.getJobBySlug(slug);

  if (!job) {
    return {
      title: "Job Position Not Found",
    };
  }

  const companyName = job.organization?.name || "Accredited Laboratory";
  const title = job.title;
  const description = (job.description || "").slice(0, 160);

  return {
    title: `${title} at ${companyName} — Food Analyst Jobs`,
    description,
    openGraph: {
      title: `${title} at ${companyName} — Food Analyst Forum`,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${companyName}`,
      description,
    },
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const job = await JobService.getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const companyName = job.organization?.name || "Accredited Laboratory";
  const salaryFormatted = JobService.formatSalaryRange(job.salary_min, job.salary_max);
  const location = job.location || "Mumbai, MH, India";

  // JSON-LD JobPosting schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.created_at,
    employmentType: job.employment_type || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: companyName,
      logo: job.organization?.logo_url,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: location,
        addressCountry: "IN",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salary_min || 600000,
        maxValue: job.salary_max || 1200000,
        unitText: "YEAR",
      },
    },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <Link href="/jobs" className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline mb-3">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Career Portal
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="green" className="text-xs">{job.employment_type || "Full-Time"}</Badge>
          <Badge variant="outline" className="text-xs border-[#4a9d23]/40 text-[#4a9d23]">Verified Partner</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
            <Clock className="h-3.5 w-3.5" /> Posted {new Date(job.created_at).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground leading-snug">
          {job.title}
        </h1>
        <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 pt-1">
          <Building2 className="h-4 w-4 text-[#4a9d23]" /> {companyName} • <MapPin className="h-4 w-4 text-muted-foreground" /> {location}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* MAIN DESCRIPTION & SKILLS */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-6 space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-accent/30 border border-border text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Salary Offered</span>
                <span className="font-extrabold text-[#4a9d23] text-sm flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5" /> {salaryFormatted}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Experience</span>
                <span className="font-extrabold text-foreground text-sm flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> {job.experience_level || "3-5 Years"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Applicants</span>
                <span className="font-extrabold text-foreground text-sm">
                  {job.applications_count || 0} Candidates
                </span>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#0a2a4a] dark:text-foreground">
                Role Description & Key Responsibilities
              </h3>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Skills Required */}
            {job.skills_required && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-[#0a2a4a] dark:text-foreground uppercase tracking-wider">
                  Required Technical Competencies & Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.map((skill) => (
                    <Badge key={skill} variant="outline" className="px-3 py-1 text-xs border-[#4a9d23]/40">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* COMPANY & APPLY SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-5 space-y-4">
            <QuickApplyContainer job={job} />
          </Card>

          <Card className="p-5 space-y-4">
            <h4 className="text-xs font-extrabold text-[#0a2a4a] dark:text-foreground uppercase tracking-wider">
              About {companyName}
            </h4>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-[#0a2a4a]/10 dark:bg-primary/10 text-[#0a2a4a] dark:text-primary flex items-center justify-center border border-border">
                <Building2 className="h-6 w-6 text-[#4a9d23]" />
              </div>
              <div>
                <p className="font-bold text-sm text-[#0a2a4a] dark:text-foreground flex items-center gap-1">
                  {companyName} <ShieldCheck className="h-3.5 w-3.5 text-[#4a9d23]" />
                </p>
                <p className="text-xs text-muted-foreground">NABL & FSSAI Partner Lab</p>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl border border-border flex items-center justify-center gap-2 text-xs font-bold hover:border-[#4a9d23] transition-colors">
              <Bookmark className="h-4 w-4 text-[#4a9d23]" /> Bookmark Job
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
