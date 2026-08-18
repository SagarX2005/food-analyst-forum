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
        className="dark:text-foreground hover:bg-accent relative text-[#0a2a4a]"
        aria-label="View notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="bg-destructive absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-xs">
            {unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="animate-in fade-in-50 zoom-in-95 absolute top-full right-0 z-50 w-80 pt-1 duration-150">
          <div className="border-border bg-card space-y-2 rounded-2xl border p-3 shadow-2xl">
            <div className="border-border/60 flex items-center justify-between border-b px-2 py-1.5">
              <span className="dark:text-foreground text-xs font-extrabold tracking-wider text-[#0a2a4a] uppercase">
                Notifications ({unreadCount} unread)
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#4a9d23] hover:underline"
                >
                  <Check className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-64 space-y-1 overflow-y-auto">
              {loading ? (
                <div className="text-muted-foreground p-4 text-center text-xs">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-muted-foreground p-4 text-center text-xs">
                  No notifications yet.
                </div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className={`space-y-1 rounded-xl p-2.5 text-xs transition-colors ${
                      !n.is_read ? "bg-[#4a9d23]/10 font-medium" : "hover:bg-accent"
                    }`}
                  >
                    <p className="dark:text-foreground font-bold text-[#0a2a4a]">{n.title}</p>
                    <p className="text-muted-foreground text-[11px]">{n.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="border-border/60 border-t pt-2 text-center">
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
