"use client";

import * as React from "react";
import { useAuth } from "@hooks/use-auth";
import { Search, Bell, Menu } from "lucide-react";
import { Button } from "@components/ui/button";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { profile } = useAuth();
  const initials = profile?.full_name?.substring(0, 2).toUpperCase() || "AD";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden items-center gap-2 lg:flex">
          <div className="relative">
            <Search className="absolute top-2 left-2.5 h-4 w-4 text-slate-400" />
            <div className="flex h-8 w-64 cursor-pointer items-center rounded-md border border-slate-200 bg-slate-50 pr-3 pl-9 text-xs text-slate-500 hover:bg-white focus:bg-white">
              Search operations...{" "}
              <span className="ml-auto rounded border border-slate-200 px-1 text-[10px] font-bold tracking-widest text-slate-400">
                ⌘K
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <Bell className="h-4 w-4" />
        </Button>
        <div className="h-5 w-px bg-slate-200" />
        <div className="flex items-center gap-2 pl-1">
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-xs font-bold text-[#0a2a4a]">
              {profile?.full_name || "Admin"}
            </span>
            <span className="text-[10px] font-bold tracking-wider text-[#4a9d23] uppercase">
              {profile?.roles?.name || "Admin"}
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0a2a4a] text-xs font-bold text-white shadow-sm ring-2 ring-white">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
