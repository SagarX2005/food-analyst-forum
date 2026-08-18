"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Search, PlusCircle, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { CourseService, type FullCourse, type GetCoursesOptions } from "@services/courseService";
import { CourseCard } from "@components/training/course-card";
import { LearningPathCard } from "@components/training/learning-path-card";
import { CourseFilters } from "@components/training/course-filters";

export default function LearningPortalPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeLevel, setActiveLevel] = React.useState("all");
  const [activeSort, setActiveSort] = React.useState("latest");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const [courses, setCourses] = React.useState<FullCourse[]>([]);
  const [loading, setLoading] = React.useState(true);

  const learningPaths = CourseService.getLearningPaths();

  const loadCourses = React.useCallback(async () => {
    setLoading(true);
    const data = await CourseService.getCourses({
      level: activeLevel,
      search: searchTerm,
      sortBy: activeSort as GetCoursesOptions["sortBy"],
    });
    setCourses(data);
    setLoading(false);
  }, [activeLevel, searchTerm, activeSort]);

  React.useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return (
    <div className="space-y-8 py-4">
      {/* HEADER CTA BANNER */}
      <div className="border-border/60 flex flex-col items-start justify-between gap-6 border-b pb-2 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-[#4a9d23]" />
            <h1 className="dark:text-foreground text-3xl font-extrabold text-[#0a2a4a]">
              Enterprise Learning & Certification LMS
            </h1>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Master ISO 17025 accreditation, FSSAI regulations, LC-MS instrumentation, and laboratory
            quality auditing.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link href="/training/dashboard">
            <Button variant="outline" size="lg" className="gap-2">
              <BookOpen className="h-4 w-4" /> Student Dashboard
            </Button>
          </Link>
          <Link href="/training/create">
            <Button variant="green" size="lg" className="gap-2 shadow-md">
              <PlusCircle className="h-5 w-5" /> Create Course
            </Button>
          </Link>
        </div>
      </div>

      {/* CURATED LEARNING PATHS */}
      <div className="space-y-3">
        <h3 className="dark:text-foreground flex items-center gap-1.5 text-sm font-extrabold tracking-wider text-[#0a2a4a] uppercase">
          <Sparkles className="h-4 w-4 text-[#4a9d23]" /> Curated Professional Certification
          Learning Tracks
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {learningPaths.map((path) => (
            <LearningPathCard key={path.id} path={path} onSelect={() => setActiveLevel("all")} />
          ))}
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-3.5 left-3.5 h-4 w-4" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search courses, ISO 17025, FSSAI examination preparation, HPLC methods..."
          className="h-11 pl-10"
        />
      </div>

      {/* COURSE FILTERS */}
      <CourseFilters
        activeLevel={activeLevel}
        onSelectLevel={(l) => setActiveLevel(l)}
        activeSort={activeSort}
        onSelectSort={(sort) => setActiveSort(sort)}
        viewMode={viewMode}
        onToggleViewMode={(mode) => setViewMode(mode)}
      />

      {/* COURSE CATALOG FEED */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-muted-foreground py-16 text-center text-sm">
            Loading course catalog...
          </div>
        ) : courses.length === 0 ? (
          <div className="border-border space-y-3 rounded-3xl border-2 border-dashed p-8 py-16 text-center">
            <p className="dark:text-foreground text-base font-bold text-[#0a2a4a]">
              No courses found matching your criteria.
            </p>
            <p className="text-muted-foreground text-xs">
              Be the first trainer to publish a professional certification course on the platform!
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }
          >
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
