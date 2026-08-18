import { createClient } from "@supabase/supabase-js";
import { env, getServiceRoleKey } from "@lib/env";
import type { Database } from "@app-types/database.types";

/**
 * Server-only Supabase client using the Service Role key to bypass Row Level Security (RLS)
 * for administrative tasks, automated background jobs, and system auditing.
 *
 * NEVER import or invoke this file in Client Components.
 */
export function createAdminClient() {
  const serviceRoleKey = getServiceRoleKey();
  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
