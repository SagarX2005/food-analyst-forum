import { createClient } from "@lib/supabase/client";
import type { Database } from "@app-types/database.types";
import type { FullProfile } from "./profileService";

export type ForumPostRow = Database["public"]["Tables"]["forum_posts"]["Row"];
export type ForumCommentRow = Database["public"]["Tables"]["forum_comments"]["Row"];
export type ForumCategoryRow = Database["public"]["Tables"]["forum_categories"]["Row"];

export interface FullForumPost extends ForumPostRow {
  author?: FullProfile | null;
  category?: ForumCategoryRow | null;
  user_has_liked?: boolean;
  is_bookmarked?: boolean;
}

export interface ThreadedComment extends ForumCommentRow {
  author?: FullProfile | null;
  is_best_answer?: boolean;
  replies?: ThreadedComment[];
}

export interface GetPostsOptions {
  categorySlug?: string;
  tag?: string;
  search?: string;
  sortBy?: "latest" | "trending" | "most_viewed" | "most_liked" | "unanswered" | "solved";
  page?: number;
  limit?: number;
}

export class ForumService {
  /**
   * Calculate reading time in minutes for text content
   */
  public static calculateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  }

  /**
   * Generate URL friendly slug from title
   */
  public static generateSlug(title: string): string {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    return `${base}-${Date.now().toString(36)}`;
  }

  /**
   * List forum categories
   */
  public static async getCategories(): Promise<ForumCategoryRow[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("forum_categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data) return [];
    return data;
  }

  /**
   * List posts with search, filtering, and sorting
   */
  public static async getPosts(options: GetPostsOptions = {}): Promise<FullForumPost[]> {
    const supabase = createClient();
    const { categorySlug, search, sortBy = "latest", page = 1, limit = 15 } = options;

    let query = supabase.from("forum_posts").select("*, author:profiles(*), category:forum_categories(*)");

    if (categorySlug && categorySlug !== "all") {
      const { data: cat } = await supabase
        .from("forum_categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();
      if (cat) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const catRow = cat as any;
        query = query.eq("category_id", catRow.id);
      }
    }

    if (search && search.trim().length > 0) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    switch (sortBy) {
      case "trending":
      case "most_liked":
        query = query.order("likes_count", { ascending: false });
        break;
      case "most_viewed":
        query = query.order("views_count", { ascending: false });
        break;
      case "unanswered":
        query = query.eq("comments_count", 0).order("created_at", { ascending: false });
        break;
      case "latest":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error } = await query.range(from, to);

    if (error || !data) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map((item) => {
      const p = item as FullForumPost;
      if (p.author) {
        p.author.title = p.author.headline || "Food Analyst";
      }
      return p;
    });
  }

  /**
   * Fetch single post by slug and increment view count
   */
  public static async getPostBySlug(slug: string, userId?: string): Promise<FullForumPost | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("forum_posts")
      .select("*, author:profiles(*), category:forum_categories(*)")
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .single();

    if (error || !data) return null;

    const post = data as unknown as FullForumPost;
    if (post.author) {
      post.author.title = post.author.headline || "Food Analyst Specialist";
    }

    // Increment views counter via RPC
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).rpc("increment_views", { table_name: "forum_posts", record_id: post.id });
    } catch {
      // Ignore RPC error
    }

    // Check if current user has liked post
    if (userId) {
      const { data: likeData } = await supabase
        .from("forum_likes")
        .select("id")
        .eq("post_id", post.id)
        .eq("user_id", userId)
        .single();
      post.user_has_liked = !!likeData;
    }

    return post;
  }

  /**
   * Create a new forum post
   */
  public static async createPost(payload: {
    authorId: string;
    categoryId: string;
    title: string;
    content: string;
  }): Promise<FullForumPost> {
    const supabase = createClient();
    const slug = this.generateSlug(payload.title);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("forum_posts") as any)
      .insert({
        author_id: payload.authorId,
        category_id: payload.categoryId,
        title: payload.title,
        slug,
        content: payload.content,
        status: "published",
      })
      .select("*, author:profiles(*), category:forum_categories(*)")
      .single();

    if (error) {
      throw new Error(`Failed to create post: ${error.message}`);
    }

    return data as unknown as FullForumPost;
  }

  /**
   * Toggle like for a post using Supabase RPC function toggle_like
   */
  public static async togglePostLike(postId: string, userId: string): Promise<boolean> {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: liked, error } = await (supabase as any).rpc("toggle_like", {
      target_post_id: postId,
      target_user_id: userId,
    });

    if (error) {
      const { data: existing } = await supabase
        .from("forum_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .single();

      if (existing) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ex = existing as any;
        await supabase.from("forum_likes").delete().eq("id", ex.id);
        return false;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("forum_likes") as any).insert({ post_id: postId, user_id: userId });
        return true;
      }
    }

    return !!liked;
  }

  /**
   * Fetch threaded comments & nested replies for a post
   */
  public static async getComments(postId: string): Promise<ThreadedComment[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("forum_comments")
      .select("*, author:profiles(*)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error || !data) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allComments = (data as any[]).map((c) => {
      const comment = c as ThreadedComment;
      if (comment.author) {
        comment.author.title = comment.author.headline || "Analyst Member";
      }
      comment.replies = [];
      return comment;
    });

    const topLevel: ThreadedComment[] = [];
    const map = new Map<string, ThreadedComment>();

    allComments.forEach((c) => map.set(c.id, c));

    allComments.forEach((c) => {
      if (c.parent_id && map.has(c.parent_id)) {
        map.get(c.parent_id)!.replies!.push(c);
      } else {
        topLevel.push(c);
      }
    });

    return topLevel;
  }

  /**
   * Add a comment or nested reply
   */
  public static async addComment(payload: {
    postId: string;
    authorId: string;
    content: string;
    parentId?: string;
  }): Promise<ThreadedComment> {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("forum_comments") as any)
      .insert({
        post_id: payload.postId,
        author_id: payload.authorId,
        parent_id: payload.parentId || null,
        content: payload.content,
      })
      .select("*, author:profiles(*)")
      .single();

    if (error) {
      throw new Error(`Failed to add comment: ${error.message}`);
    }

    const comment = data as unknown as ThreadedComment;
    comment.replies = [];
    return comment;
  }
}
