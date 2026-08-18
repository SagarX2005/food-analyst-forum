import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  IndianRupee,
  ShieldCheck,
  Building2,
  Bookmark,
  Clock,
} from "lucide-react";
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
    <div className="mx-auto max-w-5xl space-y-8 py-4">
      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <Link
          href="/jobs"
          className="mb-3 inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Career Portal
        </Link>

        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="green" className="text-xs">
            {job.employment_type || "Full-Time"}
          </Badge>
          <Badge variant="outline" className="border-[#4a9d23]/40 text-xs text-[#4a9d23]">
            Verified Partner
          </Badge>
          <span className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
            <Clock className="h-3.5 w-3.5" /> Posted {new Date(job.created_at).toLocaleDateString()}
          </span>
        </div>

        <h1 className="dark:text-foreground text-2xl leading-snug font-extrabold text-[#0a2a4a] sm:text-3xl">
          {job.title}
        </h1>
        <p className="text-muted-foreground flex items-center gap-1.5 pt-1 text-sm font-semibold">
          <Building2 className="h-4 w-4 text-[#4a9d23]" /> {companyName} •{" "}
          <MapPin className="text-muted-foreground h-4 w-4" /> {location}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* MAIN DESCRIPTION & SKILLS */}
        <div className="space-y-8 lg:col-span-8">
          <Card className="space-y-6 p-6">
            {/* Quick Metrics Bar */}
            <div className="bg-accent/30 border-border grid grid-cols-2 gap-4 rounded-2xl border p-4 text-xs sm:grid-cols-3">
              <div>
                <span className="text-muted-foreground block text-[11px]">Salary Offered</span>
                <span className="flex items-center gap-1 text-sm font-extrabold text-[#4a9d23]">
                  <IndianRupee className="h-3.5 w-3.5" /> {salaryFormatted}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Experience</span>
                <span className="text-foreground flex items-center gap-1 text-sm font-extrabold">
                  <Briefcase className="text-muted-foreground h-3.5 w-3.5" />{" "}
                  {job.experience_level || "3-5 Years"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Applicants</span>
                <span className="text-foreground text-sm font-extrabold">
                  {job.applications_count || 0} Candidates
                </span>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-4">
              <h3 className="dark:text-foreground text-lg font-bold text-[#0a2a4a]">
                Role Description & Key Responsibilities
              </h3>
              <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Skills Required */}
            {job.skills_required && (
              <div className="space-y-2 pt-2">
                <h4 className="dark:text-foreground text-xs font-bold tracking-wider text-[#0a2a4a] uppercase">
                  Required Technical Competencies & Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-[#4a9d23]/40 px-3 py-1 text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* COMPANY & APPLY SIDEBAR */}
        <div className="space-y-6 lg:col-span-4">
          <Card className="space-y-4 p-5">
            <QuickApplyContainer job={job} />
          </Card>

          <Card className="space-y-4 p-5">
            <h4 className="dark:text-foreground text-xs font-extrabold tracking-wider text-[#0a2a4a] uppercase">
              About {companyName}
            </h4>
            <div className="flex items-center gap-3">
              <div className="dark:bg-primary/10 dark:text-primary border-border flex h-12 w-12 items-center justify-center rounded-2xl border bg-[#0a2a4a]/10 text-[#0a2a4a]">
                <Building2 className="h-6 w-6 text-[#4a9d23]" />
              </div>
              <div>
                <p className="dark:text-foreground flex items-center gap-1 text-sm font-bold text-[#0a2a4a]">
                  {companyName} <ShieldCheck className="h-3.5 w-3.5 text-[#4a9d23]" />
                </p>
                <p className="text-muted-foreground text-xs">NABL & FSSAI Partner Lab</p>
              </div>
            </div>

            <button className="border-border flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition-colors hover:border-[#4a9d23]">
              <Bookmark className="h-4 w-4 text-[#4a9d23]" /> Bookmark Job
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
