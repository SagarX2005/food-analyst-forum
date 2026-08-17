"use client";

import { ShieldCheck, Building2, Trash2, ShieldAlert } from "lucide-react";
import { Avatar } from "@components/ui/avatar";

import { Button } from "@components/ui/button";
import type { FullProfile } from "@services/profileService";

interface UserTableProps {
  users: FullProfile[];
  onRoleChange: (userId: string, newRole: string) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

export function UserTable({ users, onRoleChange, onDeleteUser }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-widest sticky top-0">
          <tr>
            <th className="px-6 py-4">User Profile</th>
            <th className="px-6 py-4">Organization</th>
            <th className="px-6 py-4">System Role</th>
            <th className="px-6 py-4">Joined Date</th>
            <th className="px-6 py-4 text-right">Role Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((u) => {
            const name = u.full_name || u.username || "Member";
            const orgName = u.organization?.name || "Independent Analyst";
            const currentRole = u.role || "user";

            const isAdmin = currentRole.toLowerCase() === "admin" || currentRole.toLowerCase() === "super admin";

            return (
              <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4 flex items-center gap-3">
                  <Avatar src={u.avatar_url || undefined} fallback={name} size="sm" className="h-9 w-9 ring-1 ring-slate-200" />
                  <div>
                    <p className="font-bold text-[#0a2a4a] text-sm flex items-center gap-1">
                      {name} {u.is_verified && <ShieldCheck className="h-3.5 w-3.5 text-[#4a9d23]" />}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">@{u.username || "user"}</p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" /> {orgName}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${isAdmin ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                    {isAdmin && <ShieldAlert className="h-3 w-3" />}
                    {currentRole}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-slate-500">
                    {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <select
                      value={currentRole.toLowerCase()}
                      onChange={(e) => onRoleChange(u.id, e.target.value)}
                      className="h-8 px-2.5 rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#4a9d23] focus:border-[#4a9d23] hover:border-slate-300 transition-colors cursor-pointer"
                    >
                      <option value="user">User</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="trainer">Trainer</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                      <option value="super admin">Super Admin</option>
                    </select>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteUser(u.id)}
                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-colors group-hover:opacity-100 opacity-0 md:opacity-100"
                      title="Delete User"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
