import { redirect } from "next/navigation";
import { createClient } from "@lib/supabase/server";
import { ReactNode } from "react";
import { AdminLayout as Shell } from "@components/admin/admin-layout";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect("/login");
  }

  // Check if user is an admin
  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");

  if (rpcError || !isAdmin) {
    redirect("/unauthorized");
  }

  return <Shell>{children}</Shell>;
}
