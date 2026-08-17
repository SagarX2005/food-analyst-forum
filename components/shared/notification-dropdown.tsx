"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Check, ExternalLink } from "lucide-react";
import { Button } from "@components/ui/button";
import { NotificationService, type NotificationRow } from "@services/notificationService";
import { useAuth } from "@hooks/use-auth";

export function NotificationDropdown() {
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<NotificationRow[]>([]);
  const [loading, setLoading] = React.useState(false);

  const loadNotifications = React.useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await NotificationService.getUserNotifications(user.id);
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated, loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAllRead = async () => {
    if (!user) return;
    await NotificationService.markAllAsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  if (!isAuthenticated) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="relative text-[#0a2a4a] dark:text-foreground hover:bg-accent"
        aria-label="View notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-xs">
            {unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full pt-1 w-80 animate-in fade-in-50 zoom-in-95 duration-150 z-50">
          <div className="rounded-2xl border border-border bg-card p-3 shadow-2xl space-y-2">
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-border/60">
              <span className="text-xs font-extrabold text-[#0a2a4a] dark:text-foreground uppercase tracking-wider">
                Notifications ({unreadCount} unread)
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-bold text-[#4a9d23] hover:underline flex items-center gap-1"
                >
                  <Check className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1">
              {loading ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No notifications yet.
                </div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs space-y-1 transition-colors ${
                      !n.is_read ? "bg-[#4a9d23]/10 font-medium" : "hover:bg-accent"
                    }`}
                  >
                    <p className="font-bold text-[#0a2a4a] dark:text-foreground">{n.title}</p>
                    <p className="text-muted-foreground text-[11px]">{n.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-border/60 text-center">
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline"
              >
                View Notification Center <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
