import { BookOpen, Layers, ArrowRight } from "lucide-react";
import { Badge } from "@components/ui/badge";
import type { ResourceCollection } from "@services/resourceService";

interface CollectionCardProps {
  collection: ResourceCollection;
  onSelect: (collectionId: string) => void;
}

export function CollectionCard({ collection, onSelect }: CollectionCardProps) {
  return (
    <div
      onClick={() => onSelect(collection.id)}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${collection.coverGradient} p-6 text-white shadow-xl cursor-pointer hover:scale-[1.01] transition-transform group`}
    >
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <Badge variant="green" className="text-xs uppercase font-bold">
            {collection.badge}
          </Badge>
          <span className="text-xs font-semibold text-gray-300 flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" /> {collection.resourceCount} Documents
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors">
          {collection.title}
        </h3>

        <p className="text-xs text-gray-200 leading-relaxed line-clamp-2">
          {collection.description}
        </p>

        <div className="pt-2 flex items-center text-xs font-bold text-amber-300 gap-1">
          Explore Knowledge Kit <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      <Layers className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10" />
    </div>
  );
}
