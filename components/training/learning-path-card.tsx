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
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${path.gradient} p-6 text-white shadow-xl cursor-pointer hover:scale-[1.01] transition-transform group`}
    >
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <Badge variant="green" className="text-xs uppercase font-bold">
            {path.level} Track
          </Badge>
          <span className="text-xs font-semibold text-gray-300 flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" /> {path.courseCount} Courses ({path.estimatedHours} hrs)
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors">
          {path.title}
        </h3>

        <p className="text-xs text-gray-200 leading-relaxed line-clamp-2">
          {path.description}
        </p>

        <div className="pt-2 flex items-center text-xs font-bold text-amber-300 gap-1">
          Explore Learning Track <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      <Award className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10" />
    </div>
  );
}
