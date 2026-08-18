import Link from "next/link";
import { MessageCircle, ThumbsUp, Eye, CheckCircle2, Clock } from "lucide-react";
import { Card } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Avatar } from "@components/ui/avatar";
import { ForumService, type FullForumPost } from "@services/forumService";

interface PostCardProps {
  post: FullForumPost;
}

export function PostCard({ post }: PostCardProps) {
  const authorName = post.author?.full_name || "Community Member";
  const authorAvatar = post.author?.avatar_url || undefined;
  const authorRole = post.author?.roles?.name || "User";
  const categoryName = post.category?.name || "Analytical Chemistry";
  const readingTime = ForumService.calculateReadingTime(post.content);

  return (
    <Card className="group p-5 transition-all hover:border-[#4a9d23]">
      <div className="space-y-3">
        {/* Top Metadata Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-[#4a9d23]/10 text-[#4a9d23] hover:bg-[#4a9d23]/20"
            >
              {categoryName}
            </Badge>
            {post.comments_count > 3 && (
              <Badge variant="green" className="gap-1 text-[10px]">
                <CheckCircle2 className="h-3 w-3" /> Solved
              </Badge>
            )}
          </div>
          <span className="text-muted-foreground flex items-center gap-1 font-medium">
            <Clock className="h-3.5 w-3.5" /> {readingTime} min read
          </span>
        </div>

        {/* Title */}
        <Link href={`/forum/${post.slug || post.id}`}>
          <h2 className="dark:text-foreground text-lg leading-snug font-bold text-[#0a2a4a] transition-colors group-hover:text-[#4a9d23] sm:text-xl">
            {post.title}
          </h2>
        </Link>

        {/* Snippet Preview */}
        <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed sm:text-sm">
          {post.content}
        </p>

        {/* Footer Bar: Author & Stats */}
        <div className="border-border/60 text-muted-foreground flex flex-col items-start justify-between gap-4 border-t pt-3 text-xs sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <Avatar src={authorAvatar} fallback={authorName} size="sm" />
            <div className="flex flex-col">
              <span className="dark:text-foreground font-semibold text-[#0a2a4a]">
                {authorName}
              </span>
              <span className="text-muted-foreground text-[10px]">
                {authorRole} •{" "}
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-muted-foreground flex items-center gap-1 transition-colors hover:text-[#4a9d23]">
              <ThumbsUp className="h-3.5 w-3.5" /> {post.likes_count || 0}
            </span>
            <span className="text-muted-foreground flex items-center gap-1 transition-colors hover:text-[#4a9d23]">
              <MessageCircle className="h-3.5 w-3.5" /> {post.comments_count || 0}
            </span>
            <span className="text-muted-foreground flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> {post.views_count || 0}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
