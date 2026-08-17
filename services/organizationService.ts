import { createClient } from "@lib/supabase/client";
import type { Database } from "@app-types/database.types";
import type { FullProfile } from "./profileService";

export type OrganizationRow = Database["public"]["Tables"]["organizations"]["Row"];

export interface ExtendedOrganization extends OrganizationRow {
  is_verified?: boolean;
  slug?: string;
  description?: string;
}

export interface OrganizationWithMembers extends ExtendedOrganization {
  members?: FullProfile[];
  memberCount?: number;
}

export class OrganizationService {
  /**
   * Get organization profile by slug or ID
   */
  public static async getOrganizationBySlug(slug: string): Promise<OrganizationWithMembers | null> {
    const supabase = createClient();

    const { data: org, error } = await supabase
      .from("organizations")
      .select("*")
      .or(`id.eq.${slug},name.ilike.%${slug}%`)
      .single();

    if (error || !org) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawOrg = org as any;

    const { data: members } = await supabase
      .from("profiles")
      .select("*, roles(*), organizations(*)")
      .eq("organization_id", rawOrg.id)
      .limit(10);

    const extOrg: OrganizationWithMembers = {
      ...rawOrg,
      is_verified: rawOrg.verified,
      slug: rawOrg.id,
      description: `${rawOrg.name} is a leading ${rawOrg.type?.toLowerCase() || "laboratory"} facility accredited by NABL & FSSAI.`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      members: ((members || []) as any[]).map((m) => {
        const p = m as FullProfile;
        p.title = p.headline || "Analyst";
        return p;
      }),
      memberCount: members?.length || 0,
    };

    return extOrg;
  }

  /**
   * Search and filter organization directory
   */
  public static async listOrganizations(query?: string, isVerified?: boolean) {
    const supabase = createClient();
    let req = supabase.from("organizations").select("*");

    if (query && query.trim().length > 0) {
      req = req.or(`name.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%`);
    }

    if (isVerified !== undefined) {
      req = req.eq("verified", isVerified);
    }

    const { data, error } = await req.order("created_at", { ascending: false }).limit(20);
    if (error || !data) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map((o) => ({
      ...o,
      is_verified: o.verified,
      slug: o.id,
      description: `${o.name} is an accredited ${o.type?.toLowerCase() || "laboratory"} located in ${o.city || "India"}.`,
    })) as ExtendedOrganization[];
  }
}
