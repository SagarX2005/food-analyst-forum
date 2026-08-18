import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Food Analyst Forum"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    if (process.env.NODE_ENV === "test") {
      return {
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
        NEXT_PUBLIC_APP_NAME: "Food Analyst Forum",
        NEXT_PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "placeholder-anon-key",
        SUPABASE_SERVICE_ROLE_KEY: "placeholder-service-role-key",
        NODE_ENV: "test",
      };
    }
    const errors = JSON.stringify(parsed.error.format(), null, 2);
    console.warn(`[WARN] Environment validation warnings:\n${errors}`);
  }

  return (
    parsed.success
      ? parsed.data
      : {
          NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Food Analyst Forum",
          NEXT_PUBLIC_SUPABASE_URL:
            process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
          NEXT_PUBLIC_SUPABASE_ANON_KEY:
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
          SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
          NODE_ENV:
            (process.env.NODE_ENV as "development" | "test" | "production") || "development",
        }
  ) as Env;
}

export const env = validateEnv();

/**
 * Returns the Supabase Service Role Key safely for server-only environments.
 * Throws error if invoked on client or if missing on server.
 */
export function getServiceRoleKey(): string {
  if (typeof window !== "undefined") {
    throw new Error("CRITICAL SECURITY ERROR: SUPABASE_SERVICE_ROLE_KEY accessed on client side!");
  }
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for server admin operations but is not defined.",
    );
  }
  return key;
}
