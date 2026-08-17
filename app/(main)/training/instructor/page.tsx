"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, PlusCircle, ArrowLeft, Users, Star } from "lucide-react";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { CourseService, type FullCourse } from "@services/courseService";
import { useAuth } from "@hooks/use-auth";

export default function InstructorDashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = React.useState<FullCourse[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadInstructorCourses() {
      if (!user) return;
      setLoading(true);
      const data = await CourseService.getInstructorCourses(user.id);
      setCourses(data);
      setLoading(false);
    }
    loadInstructorCourses();
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link href="/training" className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Learning Portal
          </Link>
          <h1 className="text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-[#4a9d23]" /> Instructor Dashboard & Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your published certification courses, view student enrollment counts, and track ratings.
          </p>
        </div>

        <Link href="/training/create">
          <Button variant="green" size="default" className="gap-2 shadow-md shrink-0">
            <PlusCircle className="h-4 w-4" /> Create New Course
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-muted-foreground">Loading instructor courses...</div>
        ) : courses.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
            <p className="font-bold">You have not published any courses yet.</p>
            <Link href="/training/create">
              <span className="text-[#4a9d23] hover:underline font-bold">Publish First Course</span>
            </Link>
          </div>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#0a2a4a] dark:text-foreground">
                  {course.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-[#4a9d23]" /> {course.enrolled_count} Students</span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold"><Star className="h-3.5 w-3.5 fill-amber-500" /> {course.rating_avg}</span>
                </div>
              </div>

              <Link href={`/training/${course.id}`}>
                <button className="px-4 py-2 rounded-xl bg-accent text-xs font-bold hover:bg-[#4a9d23]/10 hover:text-[#4a9d23] transition-colors">
                  View Course
                </button>
              </Link>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
