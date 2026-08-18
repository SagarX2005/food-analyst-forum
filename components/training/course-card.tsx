import Link from "next/link";
import { BookOpen, Star, Clock, Users, Award, PlayCircle } from "lucide-react";
import { Card } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Avatar } from "@components/ui/avatar";
import { CourseService, type FullCourse } from "@services/courseService";

interface CourseCardProps {
  course: FullCourse;
  viewMode?: "grid" | "list";
  progressPct?: number;
}

export function CourseCard({ course, viewMode = "grid", progressPct }: CourseCardProps) {
  const instructorName = course.instructor?.full_name || "Lead LMS Instructor";
  const durationFormatted = CourseService.formatDuration(180);
  const level = course.level || "Intermediate";

  if (viewMode === "list") {
    return (
      <Card className="group flex flex-col items-start justify-between gap-4 p-4 transition-all hover:border-[#4a9d23] sm:flex-row sm:items-center">
        <div className="flex flex-1 items-start gap-3.5">
          <div className="border-border flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br from-[#0a2a4a] to-[#4a9d23] text-xs font-black text-white shadow-xs">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="green" className="py-0 text-[10px]">
                {level}
              </Badge>
              <Badge
                variant="outline"
                className="border-[#4a9d23]/30 py-0 text-[10px] text-[#4a9d23]"
              >
                ISO 17025 Accredited
              </Badge>
            </div>
            <Link href={`/training/${course.id}`}>
              <h3 className="dark:text-foreground text-base leading-snug font-bold text-[#0a2a4a] transition-colors group-hover:text-[#4a9d23]">
                {course.title}
              </h3>
            </Link>
            <div className="text-muted-foreground flex items-center gap-4 pt-0.5 text-xs font-medium">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {durationFormatted}
              </span>
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="h-3.5 w-3.5 fill-amber-500" /> {course.rating_avg}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link href={`/training/${course.id}`}>
            <button className="flex items-center gap-1.5 rounded-xl bg-[#4a9d23] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#3d831d]">
              <PlayCircle className="h-4 w-4" />{" "}
              {progressPct !== undefined ? "Continue Course" : "Enroll Now"}
            </button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group flex flex-col justify-between p-5 transition-all hover:border-[#4a9d23]">
      <div className="space-y-4">
        {/* Banner Card Header */}
        <div className="relative flex h-36 w-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-[#0a2a4a] via-[#113a63] to-[#4a9d23] p-4 text-white shadow-inner">
          <div className="relative z-10 flex items-center justify-between">
            <Badge variant="green" className="text-[10px] font-extrabold uppercase">
              {level}
            </Badge>
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300">
              <Award className="h-3 w-3" /> Certificate Included
            </span>
          </div>
          <h4 className="relative z-10 line-clamp-2 text-sm leading-snug font-extrabold text-white">
            {course.title}
          </h4>
          <BookOpen className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10" />
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
            {course.description}
          </p>

          <div className="text-muted-foreground flex items-center justify-between pt-1 text-xs font-semibold">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#4a9d23]" /> {durationFormatted}
            </span>
            <span className="flex items-center gap-1 font-bold text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-500" /> {course.rating_avg} (
              {course.rating_count})
            </span>
          </div>
        </div>
      </div>

      {progressPct !== undefined && (
        <div className="space-y-1 pt-3">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-muted-foreground">Course Progress</span>
            <span className="text-[#4a9d23]">{progressPct}%</span>
          </div>
          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div
              className="h-full bg-[#4a9d23] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      <div className="border-border/60 mt-4 flex items-center justify-between border-t pt-4 text-xs">
        <div className="flex items-center gap-2">
          <Avatar
            src={course.instructor?.avatar_url || undefined}
            fallback={instructorName}
            size="sm"
          />
          <span className="text-muted-foreground max-w-[100px] truncate text-[11px] font-semibold">
            {instructorName}
          </span>
        </div>

        <Link href={`/training/${course.id}`}>
          <button className="inline-flex items-center gap-1 font-bold text-[#4a9d23] hover:underline">
            <Users className="h-3.5 w-3.5" /> {course.enrolled_count || 0} Students
          </button>
        </Link>
      </div>
    </Card>
  );
}
