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
        <div key={mod.id} className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
          {/* Module Header */}
          <div className="px-5 py-3.5 bg-muted/40 border-b border-border/60 flex items-center justify-between font-bold text-sm text-[#0a2a4a] dark:text-foreground">
            <span>{mod.title}</span>
            <span className="text-xs font-semibold text-muted-foreground">{mod.lessons?.length || 0} Lessons</span>
          </div>

          {/* Lessons List */}
          <div className="divide-y divide-border/60">
            {mod.lessons?.map((les) => {
              const isDone = completedLessonIds.includes(les.id);
              const durationFormatted = CourseService.formatDuration(les.duration);

              return (
                <div
                  key={les.id}
                  className="px-5 py-3 flex items-center justify-between hover:bg-accent/30 transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleLessonComplete(les.id)}>
                      <CheckCircle2
                        className={`h-4 w-4 transition-colors ${
                          isDone ? "text-[#4a9d23] fill-[#4a9d23]/20" : "text-muted-foreground/40"
                        }`}
                      />
                    </button>
                    {les.video_url ? (
                      <PlayCircle className="h-4 w-4 text-[#4a9d23]" />
                    ) : (
                      <FileText className="h-4 w-4 text-[#0a2a4a] dark:text-primary" />
                    )}
                    <span
                      onClick={() => onSelectLesson?.(les.video_url || undefined)}
                      className="font-semibold text-foreground hover:text-[#4a9d23] cursor-pointer"
                    >
                      {les.title}
                    </span>
                  </div>

                  <span className="text-muted-foreground font-medium flex items-center gap-1">
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
