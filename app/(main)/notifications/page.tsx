"use client";

import * as React from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { NotificationService, type NotificationRow } from "@services/notificationService";
import { useAuth } from "@hooks/use-auth";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = React.useState<NotificationRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      const data = await NotificationService.getUserNotifications(user.id);
      setNotifications(data);
      setLoading(false);
    }
    load();
  }, [user]);

  const handleMarkAllRead = async () => {
    if (!user) return;
    await NotificationService.markAllAsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const handleMarkSingleRead = async (id: string) => {
    await NotificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
            <Bell className="h-7 w-7 text-[#4a9d23]" /> Notification Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Stay updated with forum replies, resource approvals, and security alerts.
          </p>
        </div>

        {notifications.some((n) => !n.is_read) && (
          <Button variant="green" size="sm" onClick={handleMarkAllRead} className="gap-2">
            <Check className="h-4 w-4" /> Mark All as Read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-[#0a2a4a] dark:text-foreground">Your Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">No notifications found.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleMarkSingleRead(n.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  !n.is_read
                    ? "border-[#4a9d23]/50 bg-[#4a9d23]/5 font-semibold"
                    : "border-border/60 hover:border-border"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-[#0a2a4a] dark:text-foreground font-bold">{n.title}</p>
                    {!n.is_read && (
                      <span className="h-2 w-2 rounded-full bg-[#4a9d23]" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{n.content}</p>
                  <p className="text-[10px] text-muted-foreground pt-1">
                    {new Date(n.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
