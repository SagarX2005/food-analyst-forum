"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Award, PlayCircle } from "lucide-react";
import { CourseService, type FullEnrollment } from "@services/courseService";
import { CourseCard } from "@components/training/course-card";
import { Card } from "@components/ui/card";
import { useAuth } from "@hooks/use-auth";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = React.useState<FullEnrollment[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadStudentEnrollments() {
      if (!user) return;
      setLoading(true);
      const data = await CourseService.getUserEnrollments(user.id);
      setEnrollments(data);
      setLoading(false);
    }
    loadStudentEnrollments();
  }, [user]);

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-4">
      <div>
        <Link
          href="/training"
          className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Learning Portal
        </Link>
        <h1 className="dark:text-foreground flex items-center gap-2 text-3xl font-extrabold text-[#0a2a4a]">
          <GraduationCap className="h-7 w-7 text-[#4a9d23]" /> Student Learning Dashboard
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Track active certification courses, completion progress, and official certificates.
        </p>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="space-y-1 p-4">
          <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            Enrolled Courses
          </span>
          <p className="dark:text-foreground text-2xl font-black text-[#0a2a4a]">
            {enrollments.length}
          </p>
        </Card>
        <Card className="space-y-1 p-4">
          <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            Avg Completion
          </span>
          <p className="text-2xl font-black text-[#4a9d23]">45%</p>
        </Card>
        <Card className="space-y-1 p-4">
          <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            Certificates Earned
          </span>
          <p className="flex items-center gap-1 text-2xl font-black text-amber-500">
            <Award className="h-5 w-5 fill-amber-500" /> 1 Certified
          </p>
        </Card>
      </div>

      {/* ENROLLED COURSES */}
      <div className="space-y-4">
        <h3 className="dark:text-foreground flex items-center gap-2 text-lg font-bold text-[#0a2a4a]">
          <PlayCircle className="h-5 w-5 text-[#4a9d23]" /> Active Courses & Progress
        </h3>

        {loading ? (
          <div className="text-muted-foreground py-12 text-center text-xs">
            Loading your courses...
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-muted-foreground space-y-2 py-12 text-center text-xs">
            <p className="font-bold">You are not enrolled in any courses yet.</p>
            <Link href="/training">
              <span className="font-bold text-[#4a9d23] hover:underline">Explore Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {enrollments.map(
              (en) =>
                en.course && (
                  <CourseCard key={en.id} course={en.course} progressPct={en.progress_pct || 45} />
                ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
