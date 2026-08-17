"use client";

import * as React from "react";
import Link from "next/link";
import { Users, Search, ArrowLeft } from "lucide-react";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";
import { AdminService } from "@services/adminService";
import type { FullProfile } from "@services/profileService";
import { UserTable } from "@components/admin/user-table";
import { deleteUserAccount } from "./actions";

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeRole, setActiveRole] = React.useState("all");
  const [users, setUsers] = React.useState<FullProfile[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadUsers = React.useCallback(async () => {
    setLoading(true);
    const data = await AdminService.getUsers({
      role: activeRole,
      search: searchTerm,
    });
    setUsers(data);
    setLoading(false);
  }, [activeRole, searchTerm]);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    await AdminService.updateUserRole(userId, newRole);
    loadUsers();
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to permanently delete this user account? This cannot be undone.")) {
      try {
        await deleteUserAccount(userId);
        loadUsers();
      } catch (error) {
        if (error instanceof Error) alert(error.message);
      }
    }
  };

  const roles = [
    { slug: "all", label: "All Roles" },
    { slug: "user", label: "Users" },
    { slug: "recruiter", label: "Recruiters" },
    { slug: "trainer", label: "Trainers" },
    { slug: "moderator", label: "Moderators" },
    { slug: "admin", label: "Admins" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0a2a4a] transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Operations Centre
        </Link>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-[#0a2a4a] tracking-tight flex items-center gap-2">
              User Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Search, assign RBAC system roles, inspect accounts, and audit permissions.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 shrink-0">
            <Users className="h-4 w-4 text-[#4a9d23]" />
            <span>{users.length} members found</span>
          </div>
        </div>
      </div>

      {/* SEARCH & ROLE FILTER TABS */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name or username..."
            className="pl-9 h-9 text-sm bg-slate-50 border-slate-200 focus-visible:ring-[#4a9d23] focus-visible:ring-offset-0"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {roles.map((r) => {
            const isActive = activeRole === r.slug;
            return (
              <Badge
                key={r.slug}
                variant={isActive ? "green" : "outline"}
                onClick={() => setActiveRole(r.slug)}
                className={`cursor-pointer px-3 py-1.5 text-xs whitespace-nowrap shadow-none transition-colors ${
                  !isActive ? "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700" : ""
                }`}
              >
                {r.label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* USER TABLE */}
      {loading ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm py-24 flex flex-col items-center justify-center space-y-4">
          <div className="h-6 w-6 border-2 border-slate-200 border-t-[#4a9d23] rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading directory...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm py-24 flex flex-col items-center justify-center space-y-3 px-4 text-center">
          <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-2">
            <Users className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-base font-bold text-[#0a2a4a]">No members found</p>
          <p className="text-sm text-slate-500 max-w-sm">No users match your current search and role filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <UserTable users={users} onRoleChange={handleRoleChange} onDeleteUser={handleDeleteUser} />
        </div>
      )}
    </div>
  );
}
