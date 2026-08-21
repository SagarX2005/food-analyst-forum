import { createClient } from "@lib/supabase/client";
import type { Database } from "@app-types/database.types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

/**
 * Extended profile type that joins roles and organizations.
 * All fields from ProfileRow are present (including the new extended columns).
 *
 * NOTE: `title` is a computed display alias set at runtime by various services
 * (courseService, forumService, resourceService, organizationService) via:
 *   `obj.title = obj.headline || "fallback"`
 * It is NOT a database column — headline is the canonical storage field.
 */
export interface FullProfile extends ProfileRow {
  roles?: Database["public"]["Tables"]["roles"]["Row"] | null;
  organizations?: Database["public"]["Tables"]["organizations"]["Row"] | null;
  /** Convenience alias joined from organizations */
  organization?: Database["public"]["Tables"]["organizations"]["Row"] | null;
  /** Convenience alias joined from roles */
  role?: string | null;
  /** Convenience alias: true when the profile has been verified by an admin */
  is_verified?: boolean;
  /** Runtime display alias for headline. Set by service layer, never persisted. */
  title?: string | null;
}

export interface ProfileCompletionResult {
  percentage: number;
  completedSteps: string[];
  missingSteps: string[];
}

export class ProfileService {
  /**
   * Fetch a full profile by username slug.
   * Falls back to querying by UUID if the value looks like a UUID (backward
   * compatibility — profile links may still contain raw user IDs).
   */
  public static async getProfileByUsername(usernameOrId: string): Promise<FullProfile | null> {
    const supabase = createClient();

    // Determine lookup strategy: UUID (36-char with hyphens) → id column,
    // otherwise use the username column.
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      usernameOrId,
    );

    const { data, error } = await supabase
      .from("profiles")
      .select("*, roles(*), organizations(*)")
      .eq(isUuid ? "id" : "username", usernameOrId)
      .is("deleted_at", null)
      .single();

    if (error || !data) return null;
    return data as unknown as FullProfile;
  }

  /**
   * Update profile information.
   * All extended columns are now persisted to the database.
   */
  public static async updateProfile(
    userId: string,
    updates: ProfileUpdate & Record<string, unknown>,
  ): Promise<FullProfile> {
    const supabase = createClient();

    // Build the DB payload — only include keys that the DB actually has.
    // All extended columns are written through here.
    const dbPayload: Record<string, unknown> = {
      // Core columns
      full_name: updates.full_name ?? null,
      headline: (updates.headline as string | null) ?? null,
      bio: updates.bio ?? null,
      phone: updates.phone ?? null,
      avatar_url: updates.avatar_url ?? null,
      // Extended columns (new in migration 20260821000007)
      username: (updates.username as string | null) ?? null,
      location: (updates.location as string | null) ?? null,
      website: (updates.website as string | null) ?? null,
      linkedin_url: (updates.linkedin_url as string | null) ?? null,
      github_url: (updates.github_url as string | null) ?? null,
      cover_url: (updates.cover_url as string | null) ?? null,
      skills: Array.isArray(updates.skills) ? updates.skills : [],
      updated_at: new Date().toISOString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("profiles") as any)
      .update(dbPayload)
      .eq("id", userId)
      .select("*, roles(*), organizations(*)")
      .single();

    if (error) {
      throw new Error(`Profile update failed: ${error.message}`);
    }

    return data as unknown as FullProfile;
  }

  /**
   * Calculate profile completion score (0 to 100%).
   * Uses `headline` as the canonical title/headline field.
   */
  public static calculateProfileCompletion(profile: FullProfile | null): ProfileCompletionResult {
    if (!profile) {
      return { percentage: 0, completedSteps: [], missingSteps: ["All profile fields"] };
    }

    const checks = [
      { key: "Avatar Image", met: !!profile.avatar_url },
      { key: "Full Name", met: !!profile.full_name && profile.full_name.trim().length > 0 },
      { key: "Professional Bio", met: !!profile.bio && profile.bio.trim().length > 10 },
      {
        key: "Job Title",
        met: !!profile.headline && profile.headline.trim().length > 0,
      },
      { key: "Organization Mapping", met: !!profile.organization_id },
      {
        key: "Skills & Expertise",
        met: Array.isArray(profile.skills) && profile.skills.length > 0,
      },
      { key: "Location", met: !!profile.location && profile.location.trim().length > 0 },
      { key: "LinkedIn / Web Link", met: !!profile.website || !!profile.linkedin_url },
    ];

    const completedSteps = checks.filter((c) => c.met).map((c) => c.key);
    const missingSteps = checks.filter((c) => !c.met).map((c) => c.key);
    const percentage = Math.round((completedSteps.length / checks.length) * 100);

    return {
      percentage,
      completedSteps,
      missingSteps,
    };
  }

  /**
   * Get user activity timeline events.
   */
  public static async getUserActivityTimeline(userId: string) {
    const supabase = createClient();

    const { data: auditLogs } = await supabase
      .from("audit_logs")
      .select("id, action, ip_address, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: posts } = await supabase
      .from("forum_posts")
      .select("id, title, created_at")
      .eq("author_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: resources } = await supabase
      .from("resources")
      .select("id, title, created_at")
      .eq("uploader_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const logsArr = (auditLogs || []) as any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const postsArr = (posts || []) as any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resArr = (resources || []) as any[];

    const timeline = [
      ...logsArr.map((item) => ({
        id: item.id,
        type: "system",
        title: item.action,
        description: `IP: ${item.ip_address || "Internal"}`,
        timestamp: item.created_at,
      })),
      ...postsArr.map((item) => ({
        id: item.id,
        type: "forum",
        title: "Posted in Discussion Forum",
        description: item.title,
        timestamp: item.created_at,
      })),
      ...resArr.map((item) => ({
        id: item.id,
        type: "resource",
        title: "Uploaded Resource Document",
        description: item.title,
        timestamp: item.created_at,
      })),
    ];

    return timeline.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  /**
   * Search member profiles by name or headline.
   */
  public static async searchProfiles(query?: string, roleId?: string) {
    const supabase = createClient();
    let req = supabase
      .from("profiles")
      .select("*, roles(*), organizations(*)")
      .is("deleted_at", null);

    if (query && query.trim().length > 0) {
      req = req.or(`full_name.ilike.%${query}%,headline.ilike.%${query}%`);
    }

    if (roleId) {
      req = req.eq("role_id", roleId);
    }

    const { data, error } = await req.order("created_at", { ascending: false }).limit(20);
    if (error || !data) return [];
    return data as unknown as FullProfile[];
  }
}
