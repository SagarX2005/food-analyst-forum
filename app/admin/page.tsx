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
  Clock,
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import {
  AdminService,
  type PlatformStats,
  type HealthMetric,
  type AuditLogRow,
} from "@services/adminService";
import { KpiCard } from "@components/admin/kpi-card";

export default function OperationsCenterHome() {
  const [stats, setStats] = React.useState<
    (PlatformStats & { pendingInvitations: number; pendingRecruiterApplications: number }) | null
  >(null);
  const [healthMetrics, setHealthMetrics] = React.useState<HealthMetric[]>([]);
  const [recentActivity, setRecentActivity] = React.useState<AuditLogRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      const [data, activity, metrics] = await Promise.all([
        AdminService.getPlatformStats(),
        AdminService.getAuditLogs(5),
        AdminService.getHealthMetrics(), // Synchronous mock currently, but keeping pattern
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
    <div className="animate-in fade-in space-y-8 duration-500">
      {/* HEADER */}
      <div className="flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0a2a4a]">
              Platform Operations
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {getGreeting()}. Here&apos;s what needs your attention today.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-700">All systems operational</span>
        </div>
      </div>

      {/* NEEDS ATTENTION */}
      {stats && (stats.pendingInvitations > 0 || stats.pendingRecruiterApplications > 0) && (
        <section>
          <h2 className="mb-4 text-sm font-bold tracking-widest text-slate-400 uppercase">
            Needs Your Attention
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-amber-200 bg-amber-50/50 p-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2 text-amber-600">
                    <MailOpen className="h-4 w-4" />
                    <span className="font-bold">{stats.pendingInvitations}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">Membership requests</p>
                  <p className="mt-0.5 text-xs text-slate-500">Awaiting professional review</p>
                </div>
                <Link href="/admin/invitations">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-semibold text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                  >
                    Review <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </Card>

            {stats.pendingRecruiterApplications > 0 && (
              <Card className="border-indigo-200 bg-indigo-50/50 p-4 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-2 text-indigo-600">
                      <Briefcase className="h-4 w-4" />
                      <span className="font-bold">{stats.pendingRecruiterApplications}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700">Recruiter Applications</p>
                    <p className="mt-0.5 text-xs text-slate-500">Awaiting Super Admin review</p>
                  </div>
                  <Link href="/admin/recruiter-verification">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800"
                    >
                      Review <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            <Card className="border-rose-200 bg-rose-50/50 p-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2 text-rose-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-bold">2</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">Forum reports</p>
                  <p className="mt-0.5 text-xs text-slate-500">Content flagged by members</p>
                </div>
                <Link href="/admin/forum">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-semibold text-rose-700 hover:bg-rose-100 hover:text-rose-800"
                  >
                    Moderate <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* EXECUTIVE KPIs */}
          <section>
            <h2 className="mb-4 text-sm font-bold tracking-widest text-slate-400 uppercase">
              Executive KPIs
            </h2>
            {loading || !stats ? (
              <div className="py-8 text-center text-xs text-slate-500">Loading metrics...</div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <KpiCard
                  title="Total Members"
                  value={stats.totalUsers.toLocaleString()}
                  icon={Users}
                  trend="Active community"
                />
                <KpiCard
                  title="Pending Invitations"
                  value={stats.pendingInvitations.toLocaleString()}
                  icon={MailOpen}
                  trend="Requires review"
                />
                <KpiCard
                  title="Active Organizations"
                  value={stats.activeOrganizations.toLocaleString()}
                  icon={Building2}
                  trend="Verified entities"
                />
                <KpiCard
                  title="Resources"
                  value={stats.resourcesUploaded.toLocaleString()}
                  icon={FileText}
                  trend="SOPs & Docs"
                />
                <KpiCard
                  title="Active Jobs"
                  value={stats.activeJobs.toLocaleString()}
                  icon={Briefcase}
                  trend="Open positions"
                />
                <KpiCard
                  title="Course Enrollments"
                  value={stats.courseEnrollments.toLocaleString()}
                  icon={GraduationCap}
                  trend="Active learners"
                />
              </div>
            )}
          </section>

          {/* PLATFORM HEALTH */}
          <section>
            <h2 className="mb-4 flex items-center justify-between text-sm font-bold tracking-widest text-slate-400 uppercase">
              Platform Health
              <Link
                href="/admin/health"
                className="flex items-center text-[10px] text-[#4a9d23] hover:underline"
              >
                Detailed Telemetry <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </h2>
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <div className="divide-y divide-slate-100">
                {healthMetrics.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    Telemetry unavailable
                  </div>
                ) : (
                  healthMetrics.map((m) => (
                    <div
                      key={m.service}
                      className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <Database className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-sm font-semibold text-[#0a2a4a]">{m.service}</p>
                          <p className="text-xs text-slate-500">
                            {m.status === "operational" ? "Operational" : "Degraded"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${m.status === "operational" ? "bg-[#4a9d23]" : "bg-amber-500"}`}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </section>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="space-y-4 lg:col-span-1">
          <h2 className="mb-4 text-sm font-bold tracking-widest text-slate-400 uppercase">
            Recent Activity
          </h2>
          <Card className="border-slate-200 p-0 shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading activity...</div>
            ) : recentActivity.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No recent activity.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentActivity.map((log) => (
                  <div key={log.id} className="flex gap-3 p-4 transition-colors hover:bg-slate-50">
                    <div className="mt-0.5 shrink-0">
                      <div className="h-2 w-2 rounded-full bg-slate-300 ring-4 ring-slate-50" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm leading-tight text-slate-700">
                        <span className="font-semibold">{log.action}</span>
                        {log.details ? ` - ${JSON.stringify(log.details)}` : ""}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                        <Clock className="h-3 w-3" />
                        {new Date(log.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="rounded-b-lg border-t border-slate-100 bg-slate-50 p-3">
              <Link href="/admin/audit">
                <Button variant="ghost" className="h-8 w-full text-xs font-semibold text-slate-600">
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
