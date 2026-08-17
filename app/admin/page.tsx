"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  FileText,
  Briefcase,
  GraduationCap,
  ArrowRight,
  Database,
  MailOpen,
  AlertCircle,
  Clock
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { AdminService, type PlatformStats, type HealthMetric, type AuditLogRow } from "@services/adminService";
import { KpiCard } from "@components/admin/kpi-card";

export default function OperationsCenterHome() {
  const [stats, setStats] = React.useState<(PlatformStats & { pendingInvitations: number }) | null>(null);
  const [healthMetrics, setHealthMetrics] = React.useState<HealthMetric[]>([]);
  const [recentActivity, setRecentActivity] = React.useState<AuditLogRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      const [data, activity, metrics] = await Promise.all([
        AdminService.getPlatformStats(),
        AdminService.getAuditLogs(5),
        AdminService.getHealthMetrics() // Synchronous mock currently, but keeping pattern
      ]);
      setStats(data);
      setRecentActivity(activity);
      setHealthMetrics(metrics);
      setLoading(false);
    }
    loadAdminData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#0a2a4a] tracking-tight">
              Platform Operations
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {getGreeting()}. Here&apos;s what needs your attention today.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-700">All systems operational</span>
        </div>
      </div>

      {/* NEEDS ATTENTION */}
      {stats && stats.pendingInvitations > 0 && (
        <section>
          <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4">Needs Your Attention</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-amber-200 bg-amber-50/50 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-600 mb-1">
                    <MailOpen className="h-4 w-4" />
                    <span className="font-bold">{stats.pendingInvitations}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">Membership requests</p>
                  <p className="text-xs text-slate-500 mt-0.5">Awaiting professional review</p>
                </div>
                <Link href="/admin/invitations">
                  <Button variant="ghost" size="sm" className="text-amber-700 hover:text-amber-800 hover:bg-amber-100 h-8 text-xs font-semibold">
                    Review <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-4 border-rose-200 bg-rose-50/50 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-600 mb-1">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-bold">2</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">Forum reports</p>
                  <p className="text-xs text-slate-500 mt-0.5">Content flagged by members</p>
                </div>
                <Link href="/admin/forum">
                  <Button variant="ghost" size="sm" className="text-rose-700 hover:text-rose-800 hover:bg-rose-100 h-8 text-xs font-semibold">
                    Moderate <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* EXECUTIVE KPIs */}
          <section>
            <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4">Executive KPIs</h2>
            {loading || !stats ? (
              <div className="py-8 text-center text-xs text-slate-500">Loading metrics...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <KpiCard title="Total Members" value={stats.totalUsers.toLocaleString()} icon={Users} trend="Active community" />
                <KpiCard title="Pending Invitations" value={stats.pendingInvitations.toLocaleString()} icon={MailOpen} trend="Requires review" />
                <KpiCard title="Active Organizations" value={stats.activeOrganizations.toLocaleString()} icon={Building2} trend="Verified entities" />
                <KpiCard title="Resources" value={stats.resourcesUploaded.toLocaleString()} icon={FileText} trend="SOPs & Docs" />
                <KpiCard title="Active Jobs" value={stats.activeJobs.toLocaleString()} icon={Briefcase} trend="Open positions" />
                <KpiCard title="Course Enrollments" value={stats.courseEnrollments.toLocaleString()} icon={GraduationCap} trend="Active learners" />
              </div>
            )}
          </section>

          {/* PLATFORM HEALTH */}
          <section>
            <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4 flex items-center justify-between">
              Platform Health
              <Link href="/admin/health" className="text-[10px] text-[#4a9d23] hover:underline flex items-center">
                Detailed Telemetry <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </h2>
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <div className="divide-y divide-slate-100">
                {healthMetrics.length === 0 ? (
                  <div className="p-4 text-xs text-slate-500 text-center">Telemetry unavailable</div>
                ) : (
                  healthMetrics.map((m) => (
                    <div key={m.service} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Database className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-sm font-semibold text-[#0a2a4a]">{m.service}</p>
                          <p className="text-xs text-slate-500">{m.status === 'operational' ? 'Operational' : 'Degraded'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${m.status === 'operational' ? 'bg-[#4a9d23]' : 'bg-amber-500'}`} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </section>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4">Recent Activity</h2>
          <Card className="p-0 border-slate-200 shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading activity...</div>
            ) : recentActivity.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No recent activity.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentActivity.map((log) => (
                  <div key={log.id} className="p-4 flex gap-3 hover:bg-slate-50 transition-colors">
                    <div className="mt-0.5 shrink-0">
                      <div className="h-2 w-2 rounded-full bg-slate-300 ring-4 ring-slate-50" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-700 leading-tight">
                        <span className="font-semibold">{log.action}</span>
                        {log.details ? ` - ${JSON.stringify(log.details)}` : ''}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                        <Clock className="h-3 w-3" />
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-lg">
              <Link href="/admin/audit">
                <Button variant="ghost" className="w-full text-xs font-semibold text-slate-600 h-8">
                  View Full Audit Log
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
