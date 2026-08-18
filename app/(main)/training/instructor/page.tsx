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
    <div className="mx-auto max-w-5xl space-y-8 py-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/training"
            className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Learning Portal
          </Link>
          <h1 className="dark:text-foreground flex items-center gap-2 text-3xl font-extrabold text-[#0a2a4a]">
            <GraduationCap className="h-7 w-7 text-[#4a9d23]" /> Instructor Dashboard & Analytics
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your published certification courses, view student enrollment counts, and track
            ratings.
          </p>
        </div>

        <Link href="/training/create">
          <Button variant="green" size="default" className="shrink-0 gap-2 shadow-md">
            <PlusCircle className="h-4 w-4" /> Create New Course
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-muted-foreground py-12 text-center text-xs">
            Loading instructor courses...
          </div>
        ) : courses.length === 0 ? (
          <div className="text-muted-foreground space-y-2 py-12 text-center text-xs">
            <p className="font-bold">You have not published any courses yet.</p>
            <Link href="/training/create">
              <span className="font-bold text-[#4a9d23] hover:underline">Publish First Course</span>
            </Link>
          </div>
        ) : (
          courses.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center"
            >
              <div className="space-y-1">
                <h3 className="dark:text-foreground text-base font-bold text-[#0a2a4a]">
                  {course.title}
                </h3>
                <div className="text-muted-foreground flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-[#4a9d23]" /> {course.enrolled_count}{" "}
                    Students
                  </span>
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-amber-500" /> {course.rating_avg}
                  </span>
                </div>
              </div>

              <Link href={`/training/${course.id}`}>
                <button className="bg-accent rounded-xl px-4 py-2 text-xs font-bold transition-colors hover:bg-[#4a9d23]/10 hover:text-[#4a9d23]">
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
