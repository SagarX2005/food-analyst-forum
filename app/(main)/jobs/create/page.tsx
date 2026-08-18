"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Briefcase, ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Select } from "@components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { JobService } from "@services/jobService";
import { useAuth } from "@hooks/use-auth";

export default function CreateJobPage() {
  const router = useRouter();
  const { user, profile, organization } = useAuth();

  const [title, setTitle] = React.useState("");
  const [employmentType, setEmploymentType] = React.useState("Full-Time");
  const [location, setLocation] = React.useState("Mumbai, MH, India");
  const [experienceLevel, setExperienceLevel] = React.useState("3-5 Years");
  const [salaryMin, setSalaryMin] = React.useState("800000");
  const [salaryMax, setSalaryMax] = React.useState("1400000");
  const [description, setDescription] = React.useState("");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login?redirectTo=/jobs/create");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const job = await JobService.createJob({
        postedById: user.id,
        organizationId: profile?.organization_id || organization?.id || "org_default",
        title,
        description,
        employmentType,
        location,
        experienceLevel,
        salaryMin: parseInt(salaryMin, 10) || 600000,
        salaryMax: parseInt(salaryMax, 10) || 1200000,
      });

      router.push(`/jobs/${job.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish job posting";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-4">
      <div>
        <Link
          href="/jobs"
          className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Career Portal
        </Link>
        <h1 className="dark:text-foreground flex items-center gap-2 text-3xl font-extrabold text-[#0a2a4a]">
          <PlusCircle className="h-7 w-7 text-[#4a9d23]" /> Post a New Job Opportunity
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Reach certified food analysts, laboratory managers, and quality assurance professionals
          across India.
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-xl border p-4 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="dark:text-foreground flex items-center gap-2 text-lg text-[#0a2a4a]">
              <Briefcase className="h-5 w-5 text-[#4a9d23]" /> Role Metadata & Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
                Job Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Analytical Chemist — LC-MS/MS & HPLC"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="text-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
                  Employment Type
                </label>
                <Select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  options={[
                    { value: "Full-Time", label: "Full-Time" },
                    { value: "Contract", label: "Contract SOP Auditor" },
                    { value: "Part-Time", label: "Part-Time Consultant" },
                    { value: "Remote", label: "Remote QA" },
                  ]}
                />
              </div>

              <div>
                <label className="text-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
                  Location
                </label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mumbai, MH, India"
                  required
                />
              </div>

              <div>
                <label className="text-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
                  Experience Level
                </label>
                <Input
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  placeholder="e.g. 3-5 Years"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
                  Minimum Salary (INR / Year)
                </label>
                <Input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="800000"
                />
              </div>
              <div>
                <label className="text-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
                  Maximum Salary (INR / Year)
                </label>
                <Input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="1400000"
                />
              </div>
            </div>

            <div>
              <label className="text-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
                Job Scope & Key Responsibilities
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe role responsibilities, testing instruments (HPLC, GC-MS), NABL ISO 17025 compliance tasks, and qualification criteria..."
                rows={7}
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="green"
                size="lg"
                disabled={isSubmitting}
                className="shadow-md"
              >
                {isSubmitting ? "Publishing Job..." : "Publish Job Posting"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
