/* eslint-disable no-console */
import { createClient } from "@supabase/supabase-js";
// @ts-expect-error - @next/env types might not be perfectly resolved in this TS config
import { loadEnvConfig } from "@next/env";

// Load environment variables from .env.local
loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function makeSuperAdmin(email: string) {
  console.log(`Looking up user with email: ${email}...`);
  
  // List users via Admin API
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
  
  if (userError) {
    console.error("Error fetching users:", userError.message);
    process.exit(1);
  }
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.error(`User not found with email: ${email}`);
    process.exit(1);
  }
  
  console.log(`Found user ${user.id}. Updating role in profiles...`);
  
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ role_id: "SUPER_ADMIN" })
    .eq("id", user.id);
    
  if (updateError) {
    console.error("Error updating profile role:", updateError.message);
    process.exit(1);
  }
  
  console.log(`Successfully assigned SUPER_ADMIN role to ${email}.`);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: npx ts-node scripts/make-super-admin.ts <email>");
  process.exit(1);
}

makeSuperAdmin(args[0] as string).catch(console.error);
