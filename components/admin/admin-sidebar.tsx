"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@hooks/use-auth";
import {
  LayoutDashboard, MailOpen, Users, Building2,
  MessageSquareWarning, FileText, Briefcase, GraduationCap,
  Newspaper, ShieldCheck, Activity, UserCog, Key, Settings, X, ChevronRight, FlaskConical
} from "lucide-react";
import { Button } from "@components/ui/button";

interface AdminSidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const ADMIN_LINKS = [
  { name: "Overview",       href: "/admin",                 icon: LayoutDashboard, exact: true },
  { name: "Invitations",    href: "/admin/invitations",     icon: MailOpen },
  { name: "Users",          href: "/admin/users",           icon: Users },
  { name: "Organizations",  href: "/admin/organizations",   icon: Building2 },
  { name: "Moderation",     href: "/admin/forum",           icon: MessageSquareWarning },
  { name: "Resources",      href: "/admin/resources",       icon: FileText },
  { name: "Jobs",           href: "/admin/jobs",            icon: Briefcase },
  { name: "Training",       href: "/admin/training",        icon: GraduationCap },
  { name: "News",           href: "/admin/news",            icon: Newspaper },
];

const SYSTEM_LINKS = [
  { name: "Audit Logs",     href: "/admin/audit",           icon: ShieldCheck },
  { name: "Platform Health",href: "/admin/health",          icon: Activity },
];

const GOVERNANCE_LINKS = [
  { name: "Admins",         href: "/admin/admins",          icon: UserCog },
  { name: "Roles & Perms",  href: "/admin/roles",           icon: Key },
  { name: "Security",       href: "/admin/security",        icon: ShieldCheck },
  { name: "Settings",       href: "/admin/settings",        icon: Settings },
];

export function AdminSidebar({ isMobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { isSuperAdmin } = useAuth();
  const superAdmin = isSuperAdmin();

  const NavItem = ({ link }: { link: { name: string, href: string, icon: React.ElementType, exact?: boolean } }) => {
    const isActive = link.exact 
      ? pathname === link.href 
      : pathname.startsWith(link.href);
      
    const Icon = link.icon;

    return (
      <Link href={link.href} onClick={() => onMobileClose()} className="block">
        <div className={`group flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
          isActive 
            ? "bg-[#0a2a4a]/5 font-semibold text-[#0a2a4a]" 
            : "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}>
          <div className="flex items-center gap-3">
            <Icon className={`h-4 w-4 ${isActive ? "text-[#4a9d23]" : "text-slate-400 group-hover:text-slate-600"}`} />
            {link.name}
          </div>
          {isActive && <ChevronRight className="h-3 w-3 text-[#4a9d23]" />}
        </div>
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="flex items-center gap-2 pl-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a2a4a]">
          <FlaskConical className="h-4 w-4 text-[#4a9d23]" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-[#0a2a4a] leading-tight tracking-tight">
            FAF <span className="text-[#4a9d23]">OPS</span>
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
            Enterprise Centre
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
        <div className="space-y-1">
          {ADMIN_LINKS.map(l => <NavItem key={l.href} link={l} />)}
        </div>

        <div>
          <h4 className="mb-2 px-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">
            System
          </h4>
          <div className="space-y-1">
            {SYSTEM_LINKS.map(l => <NavItem key={l.href} link={l} />)}
          </div>
        </div>

        {superAdmin && (
          <div>
            <h4 className="mb-2 px-3 text-xs font-extrabold uppercase tracking-widest text-[#4a9d23]">
              Governance
            </h4>
            <div className="space-y-1">
              {GOVERNANCE_LINKS.map(l => <NavItem key={l.href} link={l} />)}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-auto pt-4 border-t border-slate-200">
        <Link href="/">
          <Button variant="outline" className="w-full text-xs h-9 justify-center font-bold text-slate-600">
            Exit Operations Centre
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:shadow-sm
        ${isMobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"}
      `}>
        {/* Mobile Close Button */}
        <button 
          onClick={onMobileClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 lg:hidden"
        >
          <X className="h-5 w-5 text-slate-500" />
        </button>
        
        <SidebarContent />
      </aside>
    </>
  );
}
