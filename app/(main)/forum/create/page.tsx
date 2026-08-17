"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ForumService, type ForumCategoryRow } from "@services/forumService";
import { PostEditor } from "@components/forum/post-editor";
import { useAuth } from "@hooks/use-auth";

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = React.useState<ForumCategoryRow[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadCats() {
      const data = await ForumService.getCategories();
      setCategories(data);
    }
    loadCats();
  }, []);

  const handleSubmit = async (data: {
    categoryId: string;
    title: string;
    content: string;
    tags: string[];
  }) => {
    if (!user) {
      router.push("/login?redirectTo=/forum/create");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const post = await ForumService.createPost({
        authorId: user.id,
        categoryId: data.categoryId,
        title: data.title,
        content: data.content,
      });

      router.push(`/forum/${post.slug || post.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish topic";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div>
        <Link href="/forum" className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline mb-2">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Discussions
        </Link>
        <h1 className="text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
          <PlusCircle className="h-7 w-7 text-[#4a9d23]" /> Ask a Technical Question
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Share analytical challenges, methodology inquiries, or regulatory compliance questions with certified analysts.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive">
          {error}
        </div>
      )}

      {categories.length > 0 ? (
        <PostEditor categories={categories} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      ) : (
        <div className="p-8 text-center text-xs text-muted-foreground">Loading categories...</div>
      )}
    </div>
  );
}
