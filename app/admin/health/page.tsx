"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Database, ShieldCheck, Cpu, RefreshCw, Activity } from "lucide-react";

import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { AdminService, type HealthMetric } from "@services/adminService";

export default function PlatformHealthPage() {
  const [metrics, setMetrics] = React.useState<HealthMetric[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadMetrics = React.useCallback(() => {
    setLoading(true);
    // Simulate network delay for effect
    setTimeout(() => {
      setMetrics(AdminService.getHealthMetrics());
      setLoading(false);
    }, 600);
  }, []);

  React.useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

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
              Platform Health & Telemetry
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Real-time service operational status, database query latency, and auth availability.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadMetrics}
              disabled={loading}
              className="h-8 gap-1.5 bg-white font-semibold text-slate-600"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Run
              Diagnostics
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="group relative flex flex-col justify-between space-y-4 overflow-hidden border-slate-200 bg-white p-5 shadow-sm">
          <div className="pointer-events-none absolute -top-6 -right-6 text-slate-100 transition-colors duration-500 group-hover:text-emerald-50">
            <Cpu className="h-32 w-32 rotate-12" />
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-emerald-100 bg-emerald-50">
              <Cpu className="h-4 w-4 text-[#4a9d23]" />
            </div>
            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
              API Latency
            </span>
          </div>
          <div className="relative z-10">
            <p className="flex items-end gap-1.5 text-3xl font-black tracking-tight text-[#0a2a4a]">
              12 <span className="mb-1 text-base font-bold text-slate-400">ms avg</span>
            </p>
          </div>
        </Card>

        <Card className="group relative flex flex-col justify-between space-y-4 overflow-hidden border-slate-200 bg-white p-5 shadow-sm">
          <div className="pointer-events-none absolute -top-6 -right-6 text-slate-100 transition-colors duration-500 group-hover:text-sky-50">
            <Database className="h-32 w-32 rotate-12" />
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-sky-100 bg-sky-50">
              <Database className="h-4 w-4 text-sky-600" />
            </div>
            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
              DB Pool Usage
            </span>
          </div>
          <div className="relative z-10">
            <p className="flex items-end gap-1.5 text-3xl font-black tracking-tight text-[#0a2a4a]">
              8 <span className="mb-1 text-base font-bold text-slate-400">/ 50 Connections</span>
            </p>
          </div>
        </Card>

        <Card className="group relative flex flex-col justify-between space-y-4 overflow-hidden border-slate-200 bg-white p-5 shadow-sm">
          <div className="pointer-events-none absolute -top-6 -right-6 text-slate-100 transition-colors duration-500 group-hover:text-[#4a9d23]/5">
            <ShieldCheck className="h-32 w-32 rotate-12" />
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-emerald-100 bg-emerald-50">
              <ShieldCheck className="h-4 w-4 text-[#4a9d23]" />
            </div>
            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
              Service SLA
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-black tracking-tight text-[#4a9d23]">99.99%</p>
          </div>
        </Card>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 p-4">
          <Activity className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-bold text-[#0a2a4a]">Detailed Microservice Status</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="py-24 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#4a9d23]" />
                <p className="text-sm text-slate-500">Querying services...</p>
              </div>
            </div>
          ) : (
            metrics.map((m) => {
              const isHealthy = m.uptimePct >= 99;

              return (
                <div
                  key={m.service}
                  className="flex flex-col items-start justify-between gap-4 p-5 transition-colors hover:bg-slate-50/50 sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <span className="relative flex h-3 w-3">
                        {isHealthy && (
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20" />
                        )}
                        <span
                          className={`relative inline-flex h-3 w-3 rounded-full ${isHealthy ? "bg-emerald-500" : "bg-amber-500"}`}
                        />
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm leading-tight font-bold text-[#0a2a4a]">
                        {m.service}
                      </h4>
                      <p className="text-xs font-medium text-slate-500">{m.details}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-6 rounded-md border border-slate-100 bg-slate-50 px-4 py-2">
                    <div className="flex flex-col items-end">
                      <span className="mb-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Latency
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-700">
                        {m.latencyMs} ms
                      </span>
                    </div>
                    <div className="h-6 w-px bg-slate-200" />
                    <div className="flex flex-col items-end">
                      <span className="mb-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Uptime
                      </span>
                      <span
                        className={`font-mono text-xs font-semibold ${isHealthy ? "text-emerald-600" : "text-amber-600"}`}
                      >
                        {m.uptimePct}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
