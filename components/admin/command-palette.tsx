"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Users,
  Building2,
  Mail,
  MessageSquare,
  BookOpen,
  Briefcase,
  GraduationCap,
  Newspaper,
  Activity,
  Server,
  UserCheck,
  KeyRound,
  ShieldAlert,
  Settings2,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  const routes = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Organizations", href: "/admin/organizations", icon: Building2 },
    { name: "Invitations", href: "/admin/invitations", icon: Mail },
    { name: "Forum Moderation", href: "/admin/forum", icon: MessageSquare },
    { name: "Resources", href: "/admin/resources", icon: BookOpen },
    { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
    { name: "Training", href: "/admin/training", icon: GraduationCap },
    { name: "News", href: "/admin/news", icon: Newspaper },
    { name: "Audit Logs", href: "/admin/audit", icon: Activity },
    { name: "Platform Health", href: "/admin/health", icon: Server },
    { name: "Admin Roles", href: "/admin/admins", icon: UserCheck },
    { name: "RBAC Policies", href: "/admin/roles", icon: KeyRound },
    { name: "Security Compliance", href: "/admin/security", icon: ShieldAlert },
    { name: "Global Settings", href: "/admin/settings", icon: Settings2 },
  ];

  const filteredRoutes = routes.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div
        className="animate-in fade-in fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm duration-200"
        onClick={() => setOpen(false)}
      />
      <div className="animate-in fade-in zoom-in-95 fixed top-[20%] left-[50%] z-50 w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl duration-200">
        <div className="flex items-center border-b border-slate-100 px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
          <input
            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm text-slate-700 outline-hidden placeholder:text-slate-400"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <kbd className="hidden h-5 items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100 sm:inline-flex">
            ESC
          </kbd>
        </div>

        <div className="max-h-[300px] overflow-y-auto scroll-smooth p-2">
          {filteredRoutes.length === 0 ? (
            <p className="p-4 text-center text-sm text-slate-500">No results found.</p>
          ) : (
            <div className="space-y-1">
              <p className="px-2 py-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Quick Navigation
              </p>
              {filteredRoutes.map((route, i) => (
                <div
                  key={i}
                  className="group relative flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm text-slate-700 outline-hidden transition-colors select-none hover:bg-[#4a9d23]/10 hover:text-[#0a2a4a]"
                  onClick={() => {
                    router.push(route.href);
                    setOpen(false);
                  }}
                >
                  <route.icon className="mr-2 h-4 w-4 text-slate-400 group-hover:text-[#4a9d23]" />
                  <span className="font-medium">{route.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
