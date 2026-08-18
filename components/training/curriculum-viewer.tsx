"use client";

import * as React from "react";
import { PlayCircle, FileText, CheckCircle2, Clock } from "lucide-react";
import { CourseService, type FullCourseModule } from "@services/courseService";

interface CurriculumViewerProps {
  modules: FullCourseModule[];
  onSelectLesson?: (videoUrl?: string) => void;
}

export function CurriculumViewer({ modules, onSelectLesson }: CurriculumViewerProps) {
  const [completedLessonIds, setCompletedLessonIds] = React.useState<string[]>(["les-1"]);

  const toggleLessonComplete = (lessonId: string) => {
    if (completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds(completedLessonIds.filter((id) => id !== lessonId));
    } else {
      setCompletedLessonIds([...completedLessonIds, lessonId]);
    }
  };

  return (
    <div className="space-y-4">
      {modules.map((mod) => (
        <div
          key={mod.id}
          className="border-border/80 bg-card overflow-hidden rounded-2xl border shadow-xs"
        >
          {/* Module Header */}
          <div className="bg-muted/40 border-border/60 dark:text-foreground flex items-center justify-between border-b px-5 py-3.5 text-sm font-bold text-[#0a2a4a]">
            <span>{mod.title}</span>
            <span className="text-muted-foreground text-xs font-semibold">
              {mod.lessons?.length || 0} Lessons
            </span>
          </div>

          {/* Lessons List */}
          <div className="divide-border/60 divide-y">
            {mod.lessons?.map((les) => {
              const isDone = completedLessonIds.includes(les.id);
              const durationFormatted = CourseService.formatDuration(les.duration);

              return (
                <div
                  key={les.id}
                  className="hover:bg-accent/30 flex items-center justify-between px-5 py-3 text-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleLessonComplete(les.id)}>
                      <CheckCircle2
                        className={`h-4 w-4 transition-colors ${
                          isDone ? "fill-[#4a9d23]/20 text-[#4a9d23]" : "text-muted-foreground/40"
                        }`}
                      />
                    </button>
                    {les.video_url ? (
                      <PlayCircle className="h-4 w-4 text-[#4a9d23]" />
                    ) : (
                      <FileText className="dark:text-primary h-4 w-4 text-[#0a2a4a]" />
                    )}
                    <span
                      onClick={() => onSelectLesson?.(les.video_url || undefined)}
                      className="text-foreground cursor-pointer font-semibold hover:text-[#4a9d23]"
                    >
                      {les.title}
                    </span>
                  </div>

                  <span className="text-muted-foreground flex items-center gap-1 font-medium">
                    <Clock className="h-3 w-3" /> {durationFormatted}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
