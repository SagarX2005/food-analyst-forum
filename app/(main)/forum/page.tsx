"use client";

import * as React from "react";
import Link from "next/link";
import { PlusCircle, Search, Layers, Sparkles } from "lucide-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Card } from "@components/ui/card";
import {
  ForumService,
  type FullForumPost,
  type ForumCategoryRow,
  type GetPostsOptions,
} from "@services/forumService";
import { PostCard } from "@components/forum/post-card";
import { ForumFilters } from "@components/forum/forum-filters";
import { useAuth } from "@hooks/use-auth";
import { MembershipGate } from "@components/shared/membership-gate";

export default function ForumHomePage() {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categories, setCategories] = React.useState<ForumCategoryRow[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = React.useState("all");
  const [activeSort, setActiveSort] = React.useState("latest");

  const [posts, setPosts] = React.useState<FullForumPost[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function initCategories() {
      const cats = await ForumService.getCategories();
      setCategories(cats);
    }
    initCategories();
  }, []);

  const loadPosts = React.useCallback(async () => {
    setLoading(true);
    const data = await ForumService.getPosts({
      categorySlug: activeCategorySlug,
      search: searchTerm,
      sortBy: activeSort as GetPostsOptions["sortBy"],
    });
    setPosts(data);
    setLoading(false);
  }, [activeCategorySlug, searchTerm, activeSort]);

  React.useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <div className="space-y-8 py-4">
      {/* HEADER CTA BANNER */}
      <div className="border-border/60 flex flex-col items-start justify-between gap-6 border-b pb-2 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-7 w-7 text-[#4a9d23]" />
            <h1 className="dark:text-foreground text-3xl font-extrabold text-[#0a2a4a]">
              Professional Discussion Forum
            </h1>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Connect with 5000+ certified food analysts, microbiologists, and laboratory managers
            across India.
          </p>
        </div>

        <Link href="/forum/create">
          <Button variant="green" size="lg" className="shrink-0 gap-2 shadow-md">
            <PlusCircle className="h-5 w-5" /> Ask Question
          </Button>
        </Link>
      </div>

      {/* FEATURED PINNED TOPIC BANNER */}
      <Card className="from-card to-card border-2 border-[#4a9d23]/40 bg-gradient-to-r via-[#4a9d23]/5 p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#4a9d23]" />
          <span className="flex items-center gap-1 text-xs font-bold tracking-wider text-[#4a9d23] uppercase">
            <Sparkles className="h-3.5 w-3.5" /> Featured Protocol Guidelines 2026
          </span>
        </div>
        <h3 className="dark:text-foreground text-lg font-extrabold text-[#0a2a4a]">
          NABL ISO 17025:2017 Technical Checklist Revisions for Food Labs
        </h3>
        <p className="text-muted-foreground mt-1 text-xs">
          Review updated requirements for measurement uncertainty calculations, proficiency testing
          (PT), and internal audits.
        </p>
      </Card>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-3.5 left-3.5 h-4 w-4" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search technical topics, HPLC methods, FSSAI regulations..."
          className="h-11 pl-10"
        />
      </div>

      {/* CATEGORY & SORT FILTERS */}
      <ForumFilters
        categories={categories}
        activeCategorySlug={activeCategorySlug}
        onSelectCategory={(cat) => setActiveCategorySlug(cat)}
        activeSort={activeSort}
        onSelectSort={(sort) => setActiveSort(sort)}
      />

      {/* POSTS FEED */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-muted-foreground py-16 text-center text-sm">
            Loading discussions...
          </div>
        ) : posts.length === 0 ? (
          <div className="border-border space-y-3 rounded-3xl border-2 border-dashed p-8 py-16 text-center">
            <p className="dark:text-foreground text-base font-bold text-[#0a2a4a]">
              No discussions found matching your criteria.
            </p>
            <p className="text-muted-foreground text-xs">
              Be the first to ask a technical question or share an analytical protocol with the
              community!
            </p>
            <Link href="/forum/create" className="inline-block pt-2">
              <Button variant="green" size="default" className="gap-2">
                <PlusCircle className="h-4 w-4" /> Start Discussion
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {posts.slice(0, isAuthenticated ? posts.length : 3).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {!isAuthenticated && (
              <div className="pt-8 pb-4">
                <MembershipGate
                  title="Unlock Full Discussions"
                  description="Join 5000+ certified analysts to read full technical threads, download attachments, and ask your own questions."
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
