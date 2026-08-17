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

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (log.entity_type && log.entity_type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0a2a4a] transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Operations Centre
        </Link>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-[#0a2a4a] tracking-tight flex items-center gap-2">
              System Audit Logs
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Security event trail for administrative actions, roles, and system events.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={loadLogs} disabled={loading} className="h-8 gap-1.5 text-slate-600 font-semibold bg-white">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action or entity..."
            className="pl-9 h-9 text-sm bg-slate-50 border-slate-200 focus-visible:ring-[#4a9d23] focus-visible:ring-offset-0"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
            Showing {filteredLogs.length} events
          </span>
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-slate-600 border-slate-200 hover:bg-slate-50">
            <Filter className="h-3.5 w-3.5" /> Filter Log Type
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-widest sticky top-0">
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
                      <div className="h-6 w-6 border-2 border-slate-200 border-t-[#4a9d23] rounded-full animate-spin" />
                      <p className="text-sm text-slate-500">Loading audit stream...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                        <Activity className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-base font-bold text-[#0a2a4a]">No events found</p>
                      <p className="text-sm text-slate-500 max-w-sm">No audit logs match your search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-[#4a9d23]/10 group-hover:text-[#4a9d23] group-hover:border-[#4a9d23]/20 transition-colors">
                          <Shield className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-[#0a2a4a] text-sm leading-tight">
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                          {log.user_id ? log.user_id.substring(0, 8) + "..." : "SYSTEM"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest bg-slate-50 text-slate-600 border-slate-200">
                        {log.entity_type || "GLOBAL"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Clock className="h-3.5 w-3.5 text-slate-400" /> 
                        {new Date(log.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
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
