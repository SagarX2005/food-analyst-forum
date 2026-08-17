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
      <Card className="hover:border-[#4a9d23] transition-all p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
        <div className="flex items-start gap-3.5 flex-1">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0a2a4a] to-[#4a9d23] text-white flex items-center justify-center font-black text-xs shrink-0 border border-border shadow-xs">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="green" className="text-[10px] py-0">
                {level}
              </Badge>
              <Badge variant="outline" className="text-[10px] py-0 border-[#4a9d23]/30 text-[#4a9d23]">
                ISO 17025 Accredited
              </Badge>
            </div>
            <Link href={`/training/${course.id}`}>
              <h3 className="text-base font-bold text-[#0a2a4a] dark:text-foreground group-hover:text-[#4a9d23] transition-colors leading-snug">
                {course.title}
              </h3>
            </Link>
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium pt-0.5">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {durationFormatted}</span>
              <span className="flex items-center gap-1 text-amber-500 font-bold"><Star className="h-3.5 w-3.5 fill-amber-500" /> {course.rating_avg}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href={`/training/${course.id}`}>
            <button className="px-4 py-2 rounded-xl bg-[#4a9d23] text-white text-xs font-bold shadow-xs hover:bg-[#3d831d] transition-colors flex items-center gap-1.5">
              <PlayCircle className="h-4 w-4" /> {progressPct !== undefined ? "Continue Course" : "Enroll Now"}
            </button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="hover:border-[#4a9d23] transition-all p-5 flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Banner Card Header */}
        <div className="h-36 w-full rounded-2xl bg-gradient-to-r from-[#0a2a4a] via-[#113a63] to-[#4a9d23] p-4 flex flex-col justify-between text-white shadow-inner relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <Badge variant="green" className="text-[10px] font-extrabold uppercase">
              {level}
            </Badge>
            <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
              <Award className="h-3 w-3" /> Certificate Included
            </span>
          </div>
          <h4 className="text-sm font-extrabold text-white line-clamp-2 relative z-10 leading-snug">
            {course.title}
          </h4>
          <BookOpen className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10" />
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold pt-1">
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-[#4a9d23]" /> {durationFormatted}</span>
            <span className="flex items-center gap-1 text-amber-500 font-bold"><Star className="h-3.5 w-3.5 fill-amber-500" /> {course.rating_avg} ({course.rating_count})</span>
          </div>
        </div>
      </div>

      {progressPct !== undefined && (
        <div className="space-y-1 pt-3">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-muted-foreground">Course Progress</span>
            <span className="text-[#4a9d23]">{progressPct}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="bg-[#4a9d23] h-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      )}

      <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Avatar src={course.instructor?.avatar_url || undefined} fallback={instructorName} size="sm" />
          <span className="font-semibold text-muted-foreground text-[11px] truncate max-w-[100px]">
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
