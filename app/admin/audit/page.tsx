"use client";

import * as React from "react";
import Link from "next/link";
import { Activity, ArrowLeft, Clock, User, Shield, Search, RefreshCw, Filter } from "lucide-react";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { AdminService, type AuditLogRow } from "@services/adminService";

export default function SystemAuditLogsPage() {
  const [logs, setLogs] = React.useState<AuditLogRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  const loadLogs = React.useCallback(async () => {
    setLoading(true);
    const data = await AdminService.getAuditLogs(30);
    setLogs(data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.entity_type && log.entity_type.toLowerCase().includes(searchTerm.toLowerCase())),
  );

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
              System Audit Logs
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Security event trail for administrative actions, roles, and system events.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadLogs}
              disabled={loading}
              className="h-8 gap-1.5 bg-white font-semibold text-slate-600"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
        <div className="relative w-full max-w-sm flex-1">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action or entity..."
            className="h-9 border-slate-200 bg-slate-50 pl-9 text-sm focus-visible:ring-[#4a9d23] focus-visible:ring-offset-0"
          />
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <span className="text-xs font-medium whitespace-nowrap text-slate-500">
            Showing {filteredLogs.length} events
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <Filter className="h-3.5 w-3.5" /> Filter Log Type
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-widest text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-4">Action Event</th>
                <th className="px-6 py-4">Actor ID</th>
                <th className="px-6 py-4">Entity Type</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#4a9d23]" />
                      <p className="text-sm text-slate-500">Loading audit stream...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                        <Activity className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-base font-bold text-[#0a2a4a]">No events found</p>
                      <p className="max-w-sm text-sm text-slate-500">
                        No audit logs match your search criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="group transition-colors hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-slate-500 transition-colors group-hover:border-[#4a9d23]/20 group-hover:bg-[#4a9d23]/10 group-hover:text-[#4a9d23]">
                          <Shield className="h-4 w-4" />
                        </div>
                        <span className="text-sm leading-tight font-bold text-[#0a2a4a]">
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-xs text-slate-500">
                          {log.user_id ? log.user_id.substring(0, 8) + "..." : "SYSTEM"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className="border-slate-200 bg-slate-50 text-[10px] font-bold tracking-widest text-slate-600 uppercase"
                      >
                        {log.entity_type || "GLOBAL"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(log.created_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
