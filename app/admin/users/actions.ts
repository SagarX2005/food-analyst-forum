"use server";

import { createAdminClient } from "@lib/supabase/admin";
import { createClient } from "@lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteUserAccount(userId: string) {
  // 1. Verify caller is authenticated
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Please log in.");
  }

  // 2. Prevent self-deletion via this admin route
  if (user.id === userId) {
    throw new Error("Cannot delete your own active session account.");
  }

  // 3. Verify the caller is an Admin or Super Admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role_id, roles(name)")
    .eq("id", user.id)
    .single();

  const roleName = profile?.roles?.name?.toLowerCase();

  if (roleName !== "super admin" && roleName !== "admin") {
    throw new Error("Forbidden: You lack permissions to delete user accounts.");
  }

  // 4. Proceed with hard deletion via Admin API
  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.deleteUser(userId);

  if (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }

  revalidatePath("/admin/users");
}
