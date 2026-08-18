import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Eye,
  ThumbsUp,
  Bookmark,
  Share2,
  ShieldCheck,
  Building2,
} from "lucide-react";
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
    <div className="mx-auto max-w-5xl space-y-8 py-4">
      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <Link
          href="/forum"
          className="mb-3 inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Forum Feed
        </Link>

        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="green" className="text-xs">
            {categoryName}
          </Badge>
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <Clock className="h-3.5 w-3.5" /> {readingTime} min read
          </span>
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <Eye className="h-3.5 w-3.5" /> {post.views_count} views
          </span>
        </div>

        <h1 className="dark:text-foreground text-2xl leading-snug font-extrabold text-[#0a2a4a] sm:text-3xl">
          {post.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* MAIN POST BODY & COMMENTS */}
        <div className="space-y-8 lg:col-span-8">
          <Card className="space-y-6 p-6">
            {/* Author Meta Header */}
            <div className="border-border/60 flex items-center justify-between gap-4 border-b pb-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={post.author?.avatar_url || undefined}
                  fallback={authorName}
                  size="md"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="dark:text-foreground text-sm font-bold text-[#0a2a4a]">
                      {authorName}
                    </span>
                    <ShieldCheck className="h-4 w-4 text-[#4a9d23]" />
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="py-0 text-[10px] uppercase">
                      {authorRole}
                    </Badge>
                    {orgName && (
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" /> {orgName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-muted-foreground text-xs">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Post Content */}
            <div className="text-foreground space-y-4 text-sm leading-relaxed whitespace-pre-line">
              {post.content}
            </div>

            {/* Toolbar Buttons */}
            <div className="border-border/60 flex items-center justify-between border-t pt-4 text-xs">
              <div className="flex items-center gap-3 font-semibold">
                <button className="bg-accent flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-colors hover:bg-[#4a9d23]/10 hover:text-[#4a9d23]">
                  <ThumbsUp className="h-4 w-4" /> <span>{post.likes_count || 0} Likes</span>
                </button>
                <button className="bg-accent hover:bg-accent/80 flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-colors">
                  <Bookmark className="h-4 w-4" /> Bookmark
                </button>
              </div>
              <button className="text-muted-foreground hover:text-foreground flex items-center gap-1">
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
        <div className="space-y-6 lg:col-span-4">
          <Card className="space-y-4 p-5">
            <h4 className="dark:text-foreground text-xs font-extrabold tracking-wider text-[#0a2a4a] uppercase">
              Topic Author
            </h4>
            <div className="flex items-center gap-3">
              <Avatar src={post.author?.avatar_url || undefined} fallback={authorName} size="lg" />
              <div>
                <p className="dark:text-foreground text-sm font-bold text-[#0a2a4a]">
                  {authorName}
                </p>
                <p className="text-muted-foreground text-xs">
                  {post.author?.headline || "Food Safety Specialist"}
                </p>
              </div>
            </div>
            {post.author?.bio && (
              <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
                {post.author.bio}
              </p>
            )}
            <Link href={`/u/${post.author?.id}`} className="block">
              <button className="bg-accent w-full rounded-xl py-2 text-xs font-bold text-[#4a9d23] transition-colors hover:bg-[#4a9d23]/10">
                View Member Profile
              </button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
