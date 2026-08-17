import { redirect } from "next/navigation";
import { createClient } from "@lib/supabase/server";
import { ReactNode } from "react";

export default async function GovernanceLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  // The parent AdminLayout already verifies is_admin(). 
  // We must now strictly verify is_super_admin() for governance routes.
  const { data: isSuperAdmin, error: rpcError } = await supabase.rpc("is_super_admin");

  if (rpcError || !isSuperAdmin) {
    // Standard admins cannot access governance routes
    redirect("/admin?error=Unauthorized: Super Admin access required.");
  }

  return <>{children}</>;
}
