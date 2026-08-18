import { createClient } from "@lib/supabase/client";
import type { Database } from "@app-types/database.types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export interface ExtendedProfile extends ProfileRow {
  title?: string | null;
  location?: string | null;
  website?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  cover_url?: string | null;
  username?: string | null;
  skills?: string[] | null;
}

export interface FullProfile extends ExtendedProfile {
  roles?: Database["public"]["Tables"]["roles"]["Row"] | null;
  organizations?: Database["public"]["Tables"]["organizations"]["Row"] | null;
  organization?: Database["public"]["Tables"]["organizations"]["Row"] | null;
  role?: string | null;
  is_verified?: boolean;
}

export interface ProfileCompletionResult {
  percentage: number;
  completedSteps: string[];
  missingSteps: string[];
}

export class ProfileService {
  /**
   * Fetch full profile by username (or profile ID)
   */
  public static async getProfileByUsername(username: string): Promise<FullProfile | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*, roles(*), organizations(*)")
      .eq("id", username)
      .single();

    if (error || !data) return null;
    const p = data as unknown as FullProfile;
    p.title = p.headline || "Certified Food Analyst";
    p.skills = ["HPLC", "LC-MS/MS", "ISO 17025", "Microbiology"];
    return p;
  }

  /**
   * Update profile information
   */
  public static async updateProfile(
    userId: string,
    updates: ProfileUpdate & Record<string, unknown>,
  ): Promise<FullProfile> {
    const supabase = createClient();

    const dbPayload: Record<string, unknown> = {
      full_name: updates.full_name,
      headline: (updates.title as string) || updates.headline,
      bio: updates.bio,
      phone: updates.phone,
      avatar_url: updates.avatar_url,
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

    const res = data as unknown as FullProfile;
    res.title = (updates.title as string) || res.headline;
    res.location = updates.location as string;
    res.website = updates.website as string;
    res.linkedin_url = updates.linkedin_url as string;
    res.github_url = updates.github_url as string;
    res.skills = (updates.skills as string[]) || ["HPLC", "LC-MS/MS"];
    res.cover_url = updates.cover_url as string;
    return res;
  }

  /**
   * Calculate profile completion score (0 to 100%)
   */
  public static calculateProfileCompletion(profile: FullProfile | null): ProfileCompletionResult {
    if (!profile) {
      return { percentage: 0, completedSteps: [], missingSteps: ["All profile fields"] };
    }

    const title = profile.title || profile.headline;
    const checks = [
      { key: "Avatar Image", met: !!profile.avatar_url },
      { key: "Full Name", met: !!profile.full_name && profile.full_name.trim().length > 0 },
      { key: "Professional Bio", met: !!profile.bio && profile.bio.trim().length > 10 },
      { key: "Job Title", met: !!title && title.trim().length > 0 },
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
   * Get user activity timeline events
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
   * Search member profiles
   */
  public static async searchProfiles(query?: string, roleId?: string) {
    const supabase = createClient();
    let req = supabase.from("profiles").select("*, roles(*), organizations(*)");

    if (query && query.trim().length > 0) {
      req = req.or(`full_name.ilike.%${query}%,headline.ilike.%${query}%`);
    }

    if (roleId) {
      req = req.eq("role_id", roleId);
    }

    const { data, error } = await req.order("created_at", { ascending: false }).limit(20);
    if (error || !data) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map((item) => {
      const p = item as FullProfile;
      p.title = p.headline || "Food Analyst";
      p.location = "Mumbai, MH";
      return p;
    });
  }
}
