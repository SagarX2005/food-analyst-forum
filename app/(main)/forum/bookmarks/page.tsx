"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, ArrowLeft } from "lucide-react";
import { ForumService, type FullForumPost } from "@services/forumService";
import { PostCard } from "@components/forum/post-card";
import { useAuth } from "@hooks/use-auth";

export default function BookmarkedPostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = React.useState<FullForumPost[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadBookmarks() {
      if (!user) return;
      setLoading(true);
      const data = await ForumService.getPosts({ sortBy: "most_liked", limit: 10 });
      setPosts(data);
      setLoading(false);
    }
    loadBookmarks();
  }, [user]);

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
      <div>
        <Link
          href="/forum"
          className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Discussions
        </Link>
        <h1 className="dark:text-foreground flex items-center gap-2 text-3xl font-extrabold text-[#0a2a4a]">
          <Bookmark className="h-7 w-7 text-[#4a9d23]" /> My Saved Topics & Bookmarks
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Quick access to bookmarked technical protocols, FSSAI advisories, and lab methods.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-muted-foreground py-12 text-center text-xs">
            Loading saved topics...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center text-xs">
            You have not bookmarked any forum topics yet.
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
