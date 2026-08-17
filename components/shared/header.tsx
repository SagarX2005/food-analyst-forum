"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  FlaskConical,
  BookOpen,
  FileText,
  Briefcase,
  GraduationCap,
  Newspaper,

  Info,
  Layers,
  LogOut,
  Settings,
  Bell,
  Building2,
  Users,
} from "lucide-react";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import { Dialog } from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { useAuth } from "@hooks/use-auth";
import { Avatar } from "@components/ui/avatar";
import { Badge } from "@components/ui/badge";
import { NotificationDropdown } from "./notification-dropdown";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, role, organization, isAuthenticated, signOut, isAdmin, isSuperAdmin } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    router.push("/");
  };

  const publicNavLinks = [
    {
      href: "#explore",
      label: "Explore",
      icon: Layers,
      hasDropdown: true,
      dropdownItems: [
        { href: "/forum", label: "Discussion Forum", icon: Users },
        { href: "/resources", label: "SOP Library & Resources", icon: FileText },
        { href: "/jobs", label: "Career Opportunities", icon: Briefcase },
        { href: "/training", label: "Training & Courses", icon: GraduationCap },
        { href: "/news", label: "Regulatory News", icon: Newspaper },
      ]
    },
    { href: "/org", label: "Organizations", icon: Building2 },
    { href: "/people", label: "People", icon: Users },
    { href: "/about", label: "About", icon: Info },
  ];

  const authNavLinks = [
    { href: "/forum", label: "Forum", icon: Users },
    {
      href: "/resources",
      label: "Resources",
      icon: BookOpen,
      hasDropdown: true,
      dropdownItems: [
        { href: "/resources", label: "SOP Library", icon: FileText },
        { href: "/resources?tab=templates", label: "Calculation Templates", icon: FileText },
        { href: "/resources?tab=regulatory", label: "Regulatory Guidelines", icon: FileText },
      ],
    },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/training", label: "Training", icon: GraduationCap },
    { href: "/news", label: "News", icon: Newspaper },
    { href: "/org", label: "Organizations", icon: Building2 },
    { href: "/people", label: "People", icon: Users },
  ];

  const navLinks = isAuthenticated ? authNavLinks : publicNavLinks;

  const fullName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const avatarUrl = profile?.avatar_url || undefined;
  const username = profile?.username || profile?.id || user?.id || "analyst";
  const orgName = organization?.name;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0a2a4a] shadow-sm transition-transform group-hover:scale-105">
              <FlaskConical className="h-4.5 w-4.5 text-[#4a9d23]" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-extrabold tracking-tight text-[#0a2a4a]">
                FOOD <span className="text-[#4a9d23]">ANALYST</span> FORUM
              </span>
              <span className="text-[9px] font-medium text-slate-400 tracking-widest uppercase hidden sm:block">
                Connect · Learn · Share · Grow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(link.href + "/");

              if (link.hasDropdown) {
                const isOpen = activeDropdown === link.label;
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-md text-[12.5px] font-semibold transition-colors",
                        isActive
                          ? "text-[#4a9d23] bg-[#4a9d23]/8"
                          : "text-slate-600 hover:text-[#0a2a4a] hover:bg-slate-100"
                      )}
                    >
                      {link.label}
                      <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", isOpen && "rotate-180")} />
                    </Link>

                    {isOpen && (
                      <div className="absolute left-0 top-full pt-2 w-60 animate-in fade-in-50 zoom-in-95 duration-150">
                        <div className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                          {link.dropdownItems?.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12.5px] font-medium text-slate-700 hover:bg-[#4a9d23]/8 hover:text-[#4a9d23] transition-colors"
                            >
                              <item.icon className="h-3.5 w-3.5 text-[#4a9d23]" />
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-[12.5px] font-semibold transition-colors",
                    isActive
                      ? "text-[#4a9d23] bg-[#4a9d23]/8"
                      : "text-slate-600 hover:text-[#0a2a4a] hover:bg-slate-100"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right-side Actions */}
          <div className="flex items-center gap-1.5">
            {/* Quick Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:text-[#0a2a4a] hover:bg-slate-100 transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Notifications */}
            <NotificationDropdown />

            {/* Divider */}
            <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

            {/* Auth State */}
            {isAuthenticated ? (
              <div
                className="relative"
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <Avatar src={avatarUrl} fallback={fullName} size="sm" />
                  <span className="text-xs font-semibold text-[#0a2a4a] hidden md:inline-block max-w-[100px] truncate">
                    {fullName}
                  </span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full pt-2 w-60 animate-in fade-in-50 zoom-in-95 duration-150 z-50">
                    <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-2xl">
                      <div className="px-3 py-2 mb-1 border-b border-slate-100">
                        <p className="text-sm font-bold text-[#0a2a4a] truncate">{fullName}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
                        <div className="flex items-center gap-1.5 pt-2">
                          <Badge variant="green" className="text-[10px] uppercase">{role}</Badge>
                          {orgName && (
                            <span className="text-[10px] text-slate-400 truncate font-medium">· {orgName}</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-0.5 py-1">
                        {isAdmin() && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-[#4a9d23] hover:bg-[#4a9d23]/10 transition-colors"
                          >
                            <Settings className="h-3.5 w-3.5" />
                            {isSuperAdmin() ? "Super Admin Dashboard" : "Admin Dashboard"}
                          </Link>
                        )}
                        {[
                          { href: "/dashboard", icon: FlaskConical, label: "My Dashboard" },
                          { href: `/u/${username}`, icon: UserIcon, label: "Public Profile" },
                          { href: "/notifications", icon: Bell, label: "Notifications" },
                          { href: "/settings", icon: Settings, label: "Account Settings" },
                        ].map(({ href, icon: Icon, label }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0a2a4a] transition-colors"
                          >
                            <Icon className="h-3.5 w-3.5 text-[#4a9d23]" />
                            {label}
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 pt-1 mt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs font-semibold h-8 px-3 text-slate-600 hover:text-[#0a2a4a]">
                    Sign In
                  </Button>
                </Link>
                <Link href="/request-invite">
                  <Button variant="navy" size="sm" className="text-xs font-semibold h-8 px-4 shadow-md transition-transform hover:-translate-y-0.5">
                    Request an Invitation
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 transition-colors ml-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed top-16 left-0 right-0 bottom-0 z-50 overflow-y-auto border-t border-slate-200 bg-white px-4 pb-6 pt-3 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-0.5">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <div key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => !link.hasDropdown && setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
                        isActive
                          ? "bg-[#0a2a4a]/5 text-[#0a2a4a]"
                          : "text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                    {link.hasDropdown && link.dropdownItems && (
                      <div className="pl-11 pr-4 py-1 space-y-1">
                        {link.dropdownItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:text-[#0a2a4a] hover:bg-slate-50 transition-colors"
                          >
                            <item.icon className="h-3.5 w-3.5" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={handleSignOut}
                  className="w-full justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out ({fullName})
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="lg" className="w-full justify-center">Sign In</Button>
                  </Link>
                  <Link href="/request-invite" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="navy" size="lg" className="w-full justify-center">Request Invitation</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Quick Search Modal */}
      <Dialog
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Search Food Analyst Forum"
        description="Find SOPs, analytical methods, regulatory news, job postings, and discussions."
      >
        <div className="space-y-4 pt-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Type keywords (e.g. FSSAI, HPLC, ISO 17025)..."
              className="pl-10"
              autoFocus
            />
          </div>
          <div className="text-xs text-slate-500 flex flex-wrap gap-2 pt-1">
            <span className="font-semibold text-slate-700">Popular Searches:</span>
            {["LC-MS Pesticides", "ISO 17025 Checklist", "FSSAI Certification"].map((term) => (
              <span
                key={term}
                className="cursor-pointer rounded-md bg-slate-100 px-2 py-1 hover:bg-slate-200 transition-colors"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      </Dialog>
    </>
  );
}
