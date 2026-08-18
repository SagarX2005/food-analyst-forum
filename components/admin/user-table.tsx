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
        <thead className="sticky top-0 border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-widest text-slate-500 uppercase">
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

            const isAdmin =
              currentRole.toLowerCase() === "admin" || currentRole.toLowerCase() === "super admin";

            return (
              <tr key={u.id} className="group transition-colors hover:bg-slate-50/80">
                <td className="flex items-center gap-3 px-6 py-4">
                  <Avatar
                    src={u.avatar_url || undefined}
                    fallback={name}
                    size="sm"
                    className="h-9 w-9 ring-1 ring-slate-200"
                  />
                  <div>
                    <p className="flex items-center gap-1 text-sm font-bold text-[#0a2a4a]">
                      {name}{" "}
                      {u.is_verified && <ShieldCheck className="h-3.5 w-3.5 text-[#4a9d23]" />}
                    </p>
                    <p className="text-xs font-medium text-slate-500">@{u.username || "user"}</p>
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
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase ${isAdmin ? "border border-amber-200 bg-amber-100 text-amber-700" : "border border-slate-200 bg-slate-100 text-slate-600"}`}
                  >
                    {isAdmin && <ShieldAlert className="h-3 w-3" />}
                    {currentRole}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-slate-500">
                    {new Date(u.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <select
                      value={currentRole.toLowerCase()}
                      onChange={(e) => onRoleChange(u.id, e.target.value)}
                      className="h-8 cursor-pointer rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 focus:border-[#4a9d23] focus:ring-1 focus:ring-[#4a9d23] focus:outline-hidden"
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
                      className="h-8 w-8 text-slate-400 opacity-0 transition-colors group-hover:opacity-100 hover:border-red-100 hover:bg-red-50 hover:text-red-600 md:opacity-100"
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
