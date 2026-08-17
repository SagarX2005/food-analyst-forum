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
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      <div>
        <Link href="/training" className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline mb-2">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Learning Portal
        </Link>
        <h1 className="text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-[#4a9d23]" /> Student Learning Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track active certification courses, completion progress, and official certificates.
        </p>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Enrolled Courses</span>
          <p className="text-2xl font-black text-[#0a2a4a] dark:text-foreground">{enrollments.length}</p>
        </Card>
        <Card className="p-4 space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg Completion</span>
          <p className="text-2xl font-black text-[#4a9d23]">45%</p>
        </Card>
        <Card className="p-4 space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Certificates Earned</span>
          <p className="text-2xl font-black text-amber-500 flex items-center gap-1">
            <Award className="h-5 w-5 fill-amber-500" /> 1 Certified
          </p>
        </Card>
      </div>

      {/* ENROLLED COURSES */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
          <PlayCircle className="h-5 w-5 text-[#4a9d23]" /> Active Courses & Progress
        </h3>

        {loading ? (
          <div className="py-12 text-center text-xs text-muted-foreground">Loading your courses...</div>
        ) : enrollments.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
            <p className="font-bold">You are not enrolled in any courses yet.</p>
            <Link href="/training">
              <span className="text-[#4a9d23] hover:underline font-bold">Explore Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((en) => (
              en.course && (
                <CourseCard
                  key={en.id}
                  course={en.course}
                  progressPct={en.progress_pct || 45}
                />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
