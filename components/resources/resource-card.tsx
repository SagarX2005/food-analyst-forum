import Link from "next/link";
import { Download, Star, FileText, CheckCircle2 } from "lucide-react";
import { Card } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Avatar } from "@components/ui/avatar";
import { ResourceService, type FullResource } from "@services/resourceService";
import { useAuth } from "@hooks/use-auth";

interface ResourceCardProps {
  resource: FullResource;
  viewMode?: "grid" | "list";
}

export function ResourceCard({ resource, viewMode = "grid" }: ResourceCardProps) {
  const categoryName = resource.category?.name || "Standard Operating Procedure";
  const uploaderName = resource.uploader?.full_name || "Food Analyst Team";
  const formatExt = resource.file_format?.toUpperCase() || "PDF";
  const formattedSize = ResourceService.formatFileSize(resource.file_size || 1024000);
  const { isAuthenticated } = useAuth();

  if (viewMode === "list") {
    return (
      <Card className="hover:border-[#4a9d23] transition-all p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
        <div className="flex items-start gap-3.5 flex-1">
          <div className="h-12 w-12 rounded-2xl bg-[#4a9d23]/10 text-[#4a9d23] flex items-center justify-center font-black text-xs shrink-0 border border-[#4a9d23]/20">
            {formatExt}
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px] py-0 border-[#4a9d23]/30 text-[#4a9d23]">
                {categoryName}
              </Badge>
              <Badge variant="secondary" className="text-[10px] py-0">
                v1.0
              </Badge>
            </div>
            <Link href={`/resources/${resource.id}`}>
              <h3 className="text-base font-bold text-[#0a2a4a] dark:text-foreground group-hover:text-[#4a9d23] transition-colors leading-snug">
                {resource.title}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground line-clamp-1">{resource.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground font-semibold shrink-0">
          <span className="flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-500" /> {resource.rating_avg}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5 text-[#4a9d23]" /> {resource.downloads_count || 0}
          </span>
          {isAuthenticated ? (
            <Link href={`/resources/${resource.id}`}>
              <button className="px-3 py-1.5 rounded-xl bg-[#4a9d23] text-white text-xs font-bold shadow-xs hover:bg-[#3d831d] transition-colors">
                View SOP
              </button>
            </Link>
          ) : (
            <Link href="/request-invite">
              <button className="px-3 py-1.5 rounded-xl bg-accent text-xs font-bold transition-colors text-muted-foreground hover:bg-accent/80">
                Members Only
              </button>
            </Link>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="hover:border-[#4a9d23] transition-all p-5 flex flex-col justify-between group">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="h-12 w-12 rounded-2xl bg-[#0a2a4a]/10 dark:bg-primary/10 text-[#0a2a4a] dark:text-primary flex items-center justify-center font-black text-xs border border-border">
            {formatExt}
          </div>
          <Badge variant="green" className="text-[10px] gap-1">
            <CheckCircle2 className="h-3 w-3" /> NABL Verified
          </Badge>
        </div>

        <div className="space-y-1">
          <Badge variant="outline" className="text-[10px] py-0 border-[#4a9d23]/30 text-[#4a9d23]">
            {categoryName}
          </Badge>
          <Link href={`/resources/${resource.id}`}>
            <h3 className="text-lg font-bold text-[#0a2a4a] dark:text-foreground group-hover:text-[#4a9d23] transition-colors leading-snug">
              {resource.title}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {resource.description}
          </p>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-border/60 space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-500" /> {resource.rating_avg} ({resource.rating_count})
          </div>
          <span className="flex items-center gap-1 text-foreground">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" /> {formattedSize}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-2">
            <Avatar src={resource.uploader?.avatar_url || undefined} fallback={uploaderName} size="sm" />
            <span className="font-semibold text-muted-foreground text-[11px] truncate max-w-[110px]">
              {uploaderName}
            </span>
          </div>

          <span className="flex items-center gap-1 text-xs font-bold text-[#4a9d23]">
            <Download className="h-3.5 w-3.5" /> {resource.downloads_count || 0} Downloads
          </span>
        </div>
      </div>
    </Card>
  );
}
