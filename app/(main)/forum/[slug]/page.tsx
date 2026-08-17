import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, ThumbsUp, Bookmark, Share2, ShieldCheck, Building2 } from "lucide-react";
import { ForumService } from "@services/forumService";
import { Badge } from "@components/ui/badge";
import { Avatar } from "@components/ui/avatar";
import { Card } from "@components/ui/card";
import { CommentTreeContainer } from "./comment-container";
import { MembershipGate } from "@components/invitations/membership-gate";
import { createClient } from "@lib/supabase/server";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await ForumService.getPostBySlug(slug);

  if (!post) {
    return {
      title: "Topic Not Found",
    };
  }

  const authorName = post.author?.full_name || "Food Analyst Member";
  const title = post.title;
  const description = post.content.slice(0, 160);

  return {
    title: `${title} — Food Analyst Forum`,
    description,
    openGraph: {
      title: `${title} — Food Analyst Forum`,
      description,
      type: "article",
      authors: [authorName],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await ForumService.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  const readingTime = ForumService.calculateReadingTime(post.content);
  const authorName = post.author?.full_name || "Community Member";
  const authorRole = post.author?.roles?.name || "User";
  const orgName = post.author?.organizations?.name;
  const categoryName = post.category?.name || "Analytical Chemistry";

  // JSON-LD DiscussionForumPosting schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: post.title,
    articleBody: post.content,
    datePublished: post.created_at,
    author: {
      "@type": "Person",
      name: authorName,
    },
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: post.likes_count || 0,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CommentAction",
        userInteractionCount: post.comments_count || 0,
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <Link href="/forum" className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline mb-3">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Forum Feed
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="green" className="text-xs">{categoryName}</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {readingTime} min read
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> {post.views_count} views
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground leading-snug">
          {post.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* MAIN POST BODY & COMMENTS */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-6 space-y-6">
            {/* Author Meta Header */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <Avatar src={post.author?.avatar_url || undefined} fallback={authorName} size="md" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#0a2a4a] dark:text-foreground text-sm">{authorName}</span>
                    <ShieldCheck className="h-4 w-4 text-[#4a9d23]" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[10px] py-0 uppercase">{authorRole}</Badge>
                    {orgName && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {orgName}</span>}
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>

            {/* Post Content */}
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-line space-y-4">
              {post.content}
            </div>

            {/* Toolbar Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs">
              <div className="flex items-center gap-3 font-semibold">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent hover:bg-[#4a9d23]/10 hover:text-[#4a9d23] transition-colors">
                  <ThumbsUp className="h-4 w-4" /> <span>{post.likes_count || 0} Likes</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent hover:bg-accent/80 transition-colors">
                  <Bookmark className="h-4 w-4" /> Bookmark
                </button>
              </div>
              <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </Card>

          {/* COMMENTS CONTAINER — Members Only */}
          {isAuthenticated ? (
            <CommentTreeContainer postId={post.id} postAuthorId={post.author_id} />
          ) : (
            <MembershipGate
              title="Join the Discussion"
              description="Comments and replies are available to FAF members. Request an invitation to participate."
            />
          )}
        </div>

        {/* AUTHOR & RECOMMENDED SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-5 space-y-4">
            <h4 className="text-xs font-extrabold text-[#0a2a4a] dark:text-foreground uppercase tracking-wider">
              Topic Author
            </h4>
            <div className="flex items-center gap-3">
              <Avatar src={post.author?.avatar_url || undefined} fallback={authorName} size="lg" />
              <div>
                <p className="font-bold text-sm text-[#0a2a4a] dark:text-foreground">{authorName}</p>
                <p className="text-xs text-muted-foreground">{post.author?.headline || "Food Safety Specialist"}</p>
              </div>
            </div>
            {post.author?.bio && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {post.author.bio}
              </p>
            )}
            <Link href={`/u/${post.author?.id}`} className="block">
              <button className="w-full py-2 rounded-xl bg-accent text-xs font-bold text-[#4a9d23] hover:bg-[#4a9d23]/10 transition-colors">
                View Member Profile
              </button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
