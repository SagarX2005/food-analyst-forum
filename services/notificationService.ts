import { createClient } from "@lib/supabase/client";
import type { Database } from "@app-types/database.types";

export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"] & {
  content?: string;
};

export class NotificationService {
  /**
   * Fetch unread/all notifications for user
   */
  public static async getUserNotifications(userId: string): Promise<NotificationRow[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error || !data) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map((n) => ({
      ...n,
      content: n.message,
    }));
  }

  /**
   * Mark a single notification as read
   */
  public static async markAsRead(notificationId: string): Promise<void> {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("notifications") as any)
      .update({ is_read: true })
      .eq("id", notificationId);
  }

  /**
   * Mark all notifications as read for user
   */
  public static async markAllAsRead(userId: string): Promise<void> {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("notifications") as any).update({ is_read: true }).eq("user_id", userId);
  }
}
