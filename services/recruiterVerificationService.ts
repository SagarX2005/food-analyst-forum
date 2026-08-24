import { createClient } from "@lib/supabase/client";
import { type SupabaseClient } from "@supabase/supabase-js";
import type { Database, RecruiterApplicationStatus } from "@app-types/database.types";

export type RecruiterApplicationRow = Database["public"]["Tables"]["recruiter_applications"]["Row"];

export interface FullRecruiterApplication extends RecruiterApplicationRow {
  user: {
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    headline: string | null;
    roles: {
      name: string;
    } | null;
  } | null;
}

export type SubmitRecruiterApplicationPayload = Omit<
  Database["public"]["Tables"]["recruiter_applications"]["Insert"],
  "id" | "status" | "rejection_reason" | "more_info_request" | "reviewed_by" | "reviewed_at" | "created_at" | "updated_at"
>;

export interface GetApplicationsOptions {
  status?: RecruiterApplicationStatus | "all";
  page?: number;
  limit?: number;
}

export class RecruiterVerificationService {
  /**
   * Fetch recruiter applications with pagination and filtering
   */
  public static async getApplications(
    options: GetApplicationsOptions = {},
    client?: SupabaseClient<Database>
  ): Promise<{ data: FullRecruiterApplication[]; count: number }> {
    const supabase = (client || createClient()) as SupabaseClient<Database>;
    const { status = "pending", page = 1, limit = 20 } = options;

    let query = supabase
      .from("recruiter_applications")
      .select(`
        *,
        user:profiles!recruiter_applications_user_id_fkey(
          email,
          full_name,
          avatar_url,
          headline,
          roles(name)
        )
      `, { count: "exact" });

    if (status !== "all") {
      query = query.eq("status", status);
    }

    query = query.order("created_at", { ascending: false });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;
    
    return { data: data as unknown as FullRecruiterApplication[], count: count ?? 0 };
  }

  /**
   * Fetch a single recruiter application by ID
   */
  public static async getApplicationById(id: string, client?: SupabaseClient<Database>): Promise<FullRecruiterApplication> {
    const supabase = (client || createClient()) as SupabaseClient<Database>;
    const { data, error } = await supabase
      .from("recruiter_applications")
      .select(`
        *,
        user:profiles!recruiter_applications_user_id_fkey(
          email,
          full_name,
          avatar_url,
          headline,
          roles(name)
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as unknown as FullRecruiterApplication;
  }

  /**
   * Approve a recruiter application
   */
  public static async approveApplication(id: string, client?: SupabaseClient<Database>): Promise<void> {
    const supabase = (client || createClient()) as SupabaseClient<Database>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.rpc("approve_recruiter_application" as any, {
      p_app_id: id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    if (error) throw error;
  }

  /**
   * Reject a recruiter application
   */
  public static async rejectApplication(id: string, reason: string, client?: SupabaseClient<Database>): Promise<void> {
    const supabase = (client || createClient()) as SupabaseClient<Database>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.rpc("reject_recruiter_application" as any, {
      p_app_id: id,
      p_reason: reason,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    if (error) throw error;
  }

  /**
   * Request more information for a recruiter application
   */
  public static async requestMoreInfo(id: string, request: string, client?: SupabaseClient<Database>): Promise<void> {
    const supabase = (client || createClient()) as SupabaseClient<Database>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.rpc("request_more_info_recruiter_application" as any, {
      p_app_id: id,
      p_request: request,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    if (error) throw error;
  }

  /**
   * Fetch the active or most recent application for a user
   */
  public static async getUserActiveApplication(userId: string, client?: SupabaseClient<Database>): Promise<RecruiterApplicationRow | null> {
    const supabase = (client || createClient()) as SupabaseClient<Database>;
    const { data, error } = await supabase
      .from("recruiter_applications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Submit a new recruiter application
   */
  public static async submitApplication(payload: SubmitRecruiterApplicationPayload, client?: SupabaseClient<Database>): Promise<RecruiterApplicationRow> {
    const supabase = (client || createClient()) as SupabaseClient<Database>;
    const { data, error } = await supabase
      .from("recruiter_applications")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert([payload as any])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Resubmit a recruiter application that requires more information
   */
  public static async resubmitApplication(id: string, newEvidence: string, client?: SupabaseClient<Database>): Promise<void> {
    const supabase = (client || createClient()) as SupabaseClient<Database>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.rpc("resubmit_recruiter_application" as any, {
      p_app_id: id,
      p_new_evidence: newEvidence,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    if (error) throw error;
  }
}
