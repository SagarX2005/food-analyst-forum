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
      <Card className="group flex flex-col items-start justify-between gap-4 p-4 transition-all hover:border-[#4a9d23] sm:flex-row sm:items-center">
        <div className="flex flex-1 items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#4a9d23]/20 bg-[#4a9d23]/10 text-xs font-black text-[#4a9d23]">
            {formatExt}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-[#4a9d23]/30 py-0 text-[10px] text-[#4a9d23]"
              >
                {categoryName}
              </Badge>
              <Badge variant="secondary" className="py-0 text-[10px]">
                v1.0
              </Badge>
            </div>
            <Link href={`/resources/${resource.id}`}>
              <h3 className="dark:text-foreground text-base leading-snug font-bold text-[#0a2a4a] transition-colors group-hover:text-[#4a9d23]">
                {resource.title}
              </h3>
            </Link>
            <p className="text-muted-foreground line-clamp-1 text-xs">{resource.description}</p>
          </div>
        </div>

        <div className="text-muted-foreground flex shrink-0 items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-500" /> {resource.rating_avg}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5 text-[#4a9d23]" /> {resource.downloads_count || 0}
          </span>
          {isAuthenticated ? (
            <Link href={`/resources/${resource.id}`}>
              <button className="rounded-xl bg-[#4a9d23] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#3d831d]">
                View SOP
              </button>
            </Link>
          ) : (
            <Link href="/request-invite">
              <button className="bg-accent text-muted-foreground hover:bg-accent/80 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors">
                Members Only
              </button>
            </Link>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="group flex flex-col justify-between p-5 transition-all hover:border-[#4a9d23]">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="dark:bg-primary/10 dark:text-primary border-border flex h-12 w-12 items-center justify-center rounded-2xl border bg-[#0a2a4a]/10 text-xs font-black text-[#0a2a4a]">
            {formatExt}
          </div>
          <Badge variant="green" className="gap-1 text-[10px]">
            <CheckCircle2 className="h-3 w-3" /> NABL Verified
          </Badge>
        </div>

        <div className="space-y-1">
          <Badge variant="outline" className="border-[#4a9d23]/30 py-0 text-[10px] text-[#4a9d23]">
            {categoryName}
          </Badge>
          <Link href={`/resources/${resource.id}`}>
            <h3 className="dark:text-foreground text-lg leading-snug font-bold text-[#0a2a4a] transition-colors group-hover:text-[#4a9d23]">
              {resource.title}
            </h3>
          </Link>
          <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
            {resource.description}
          </p>
        </div>
      </div>

      <div className="border-border/60 mt-4 space-y-3 border-t pt-4">
        <div className="text-muted-foreground flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-500" /> {resource.rating_avg} (
            {resource.rating_count})
          </div>
          <span className="text-foreground flex items-center gap-1">
            <FileText className="text-muted-foreground h-3.5 w-3.5" /> {formattedSize}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-2">
            <Avatar
              src={resource.uploader?.avatar_url || undefined}
              fallback={uploaderName}
              size="sm"
            />
            <span className="text-muted-foreground max-w-[110px] truncate text-[11px] font-semibold">
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
