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
    <Card className="hover:border-[#4a9d23] transition-all p-5 group">
      <div className="space-y-3">
        {/* Top Metadata Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-[#4a9d23]/10 text-[#4a9d23] hover:bg-[#4a9d23]/20">
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
          <h2 className="text-lg sm:text-xl font-bold text-[#0a2a4a] dark:text-foreground group-hover:text-[#4a9d23] transition-colors leading-snug">
            {post.title}
          </h2>
        </Link>

        {/* Snippet Preview */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {post.content}
        </p>

        {/* Footer Bar: Author & Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-border/60 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <Avatar src={authorAvatar} fallback={authorName} size="sm" />
            <div className="flex flex-col">
              <span className="font-semibold text-[#0a2a4a] dark:text-foreground">
                {authorName}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {authorRole} • {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 font-semibold text-xs">
            <span className="flex items-center gap-1 text-muted-foreground hover:text-[#4a9d23] transition-colors">
              <ThumbsUp className="h-3.5 w-3.5" /> {post.likes_count || 0}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground hover:text-[#4a9d23] transition-colors">
              <MessageCircle className="h-3.5 w-3.5" /> {post.comments_count || 0}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Eye className="h-3.5 w-3.5" /> {post.views_count || 0}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
