import { Award, ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@components/ui/badge";
import type { LearningPath } from "@services/courseService";

interface LearningPathCardProps {
  path: LearningPath;
  onSelect: (pathId: string) => void;
}

export function LearningPathCard({ path, onSelect }: LearningPathCardProps) {
  return (
    <div
      onClick={() => onSelect(path.id)}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${path.gradient} group cursor-pointer p-6 text-white shadow-xl transition-transform hover:scale-[1.01]`}
    >
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="green" className="text-xs font-bold uppercase">
            {path.level} Track
          </Badge>
          <span className="flex items-center gap-1 text-xs font-semibold text-gray-300">
            <BookOpen className="h-3.5 w-3.5" /> {path.courseCount} Courses ({path.estimatedHours}{" "}
            hrs)
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-white transition-colors group-hover:text-amber-300">
          {path.title}
        </h3>

        <p className="line-clamp-2 text-xs leading-relaxed text-gray-200">{path.description}</p>

        <div className="flex items-center gap-1 pt-2 text-xs font-bold text-amber-300">
          Explore Learning Track{" "}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      <Award className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10" />
    </div>
  );
}
