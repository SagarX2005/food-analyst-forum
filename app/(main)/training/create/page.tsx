"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Select } from "@components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { CourseService } from "@services/courseService";
import { useAuth } from "@hooks/use-auth";

export default function CreateCoursePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = React.useState("");
  const [level, setLevel] = React.useState("Intermediate");
  const [duration, setDuration] = React.useState("240");
  const [description, setDescription] = React.useState("");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login?redirectTo=/training/create");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const course = await CourseService.createCourse({
        instructorId: user.id,
        title,
        description,
        level,
        duration: parseInt(duration, 10) || 180,
      });

      router.push(`/training/${course.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish course";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div>
        <Link href="/training" className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline mb-2">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Learning Portal
        </Link>
        <h1 className="text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
          <PlusCircle className="h-7 w-7 text-[#4a9d23]" /> Create Professional Certification Course
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Publish accredited laboratory training modules, ISO 17025 audit guides, or HPLC method masterclasses.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#4a9d23]" /> Course Scope & Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block uppercase tracking-wider">
                Course Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ISO 17025:2017 Internal Auditor Certification Masterclass"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block uppercase tracking-wider">
                  Difficulty Level
                </label>
                <Select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  options={[
                    { value: "Beginner", label: "Beginner Analyst" },
                    { value: "Intermediate", label: "Intermediate" },
                    { value: "Advanced", label: "Advanced Lead Auditor" },
                  ]}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block uppercase tracking-wider">
                  Estimated Total Duration (Minutes)
                </label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="240"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground mb-1 block uppercase tracking-wider">
                Course Description & Learning Outcomes
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail what students will learn, ISO clauses covered, practical laboratory exercises, and certificate criteria..."
                rows={6}
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="green" size="lg" disabled={isSubmitting} className="shadow-md">
                {isSubmitting ? "Publishing Course..." : "Publish Certification Course"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
