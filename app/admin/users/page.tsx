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
    if (
      window.confirm(
        "Are you sure you want to permanently delete this user account? This cannot be undone.",
      )
    ) {
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
    { slug: "admin", label: "Admins" },
  ];

  return (
    <div className="animate-in fade-in mx-auto max-w-6xl space-y-6 duration-500">
      <div>
        <Link
          href="/admin"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-[#0a2a4a]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Operations Centre
        </Link>
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-[#0a2a4a]">
              User Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Search, assign RBAC system roles, inspect accounts, and audit permissions.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
            <Users className="h-4 w-4 text-[#4a9d23]" />
            <span>{users.length} members found</span>
          </div>
        </div>
      </div>

      {/* SEARCH & ROLE FILTER TABS */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm md:flex-row md:items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name or username..."
            className="h-9 border-slate-200 bg-slate-50 pl-9 text-sm focus-visible:ring-[#4a9d23] focus-visible:ring-offset-0"
          />
        </div>

        <div className="hide-scrollbar flex w-full items-center gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0">
          {roles.map((r) => {
            const isActive = activeRole === r.slug;
            return (
              <Badge
                key={r.slug}
                variant={isActive ? "green" : "outline"}
                onClick={() => setActiveRole(r.slug)}
                className={`cursor-pointer px-3 py-1.5 text-xs whitespace-nowrap shadow-none transition-colors ${
                  !isActive
                    ? "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    : ""
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
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-slate-200 bg-white py-24 shadow-sm">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#4a9d23]" />
          <p className="text-sm text-slate-500">Loading directory...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-slate-200 bg-white px-4 py-24 text-center shadow-sm">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
            <Users className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-base font-bold text-[#0a2a4a]">No members found</p>
          <p className="max-w-sm text-sm text-slate-500">
            No users match your current search and role filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <UserTable
            users={users}
            onRoleChange={handleRoleChange}
            onDeleteUser={handleDeleteUser}
          />
        </div>
      )}
    </div>
  );
}
