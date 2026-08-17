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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0a2a4a] transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Operations Centre
        </Link>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-[#0a2a4a] tracking-tight flex items-center gap-2">
              Platform Health & Telemetry
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time service operational status, database query latency, and auth availability.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={loadMetrics} disabled={loading} className="h-8 gap-1.5 text-slate-600 font-semibold bg-white">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Run Diagnostics
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 flex flex-col justify-between space-y-4 border-slate-200 shadow-sm bg-white overflow-hidden relative group">
          <div className="absolute -right-6 -top-6 text-slate-100 group-hover:text-emerald-50 transition-colors duration-500 pointer-events-none">
            <Cpu className="h-32 w-32 rotate-12" />
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
              <Cpu className="h-4 w-4 text-[#4a9d23]" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              API Latency
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-black text-[#0a2a4a] tracking-tight flex items-end gap-1.5">
              12 <span className="text-base font-bold text-slate-400 mb-1">ms avg</span>
            </p>
          </div>
        </Card>
        
        <Card className="p-5 flex flex-col justify-between space-y-4 border-slate-200 shadow-sm bg-white overflow-hidden relative group">
          <div className="absolute -right-6 -top-6 text-slate-100 group-hover:text-sky-50 transition-colors duration-500 pointer-events-none">
            <Database className="h-32 w-32 rotate-12" />
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-sky-50 flex items-center justify-center shrink-0 border border-sky-100">
              <Database className="h-4 w-4 text-sky-600" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              DB Pool Usage
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-black text-[#0a2a4a] tracking-tight flex items-end gap-1.5">
              8 <span className="text-base font-bold text-slate-400 mb-1">/ 50 Connections</span>
            </p>
          </div>
        </Card>
        
        <Card className="p-5 flex flex-col justify-between space-y-4 border-slate-200 shadow-sm bg-white overflow-hidden relative group">
          <div className="absolute -right-6 -top-6 text-slate-100 group-hover:text-[#4a9d23]/5 transition-colors duration-500 pointer-events-none">
            <ShieldCheck className="h-32 w-32 rotate-12" />
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
              <ShieldCheck className="h-4 w-4 text-[#4a9d23]" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Service SLA
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-black text-[#4a9d23] tracking-tight">99.99%</p>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <Activity className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-bold text-[#0a2a4a]">Detailed Microservice Status</h3>
        </div>
        
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="py-24 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-6 w-6 border-2 border-slate-200 border-t-[#4a9d23] rounded-full animate-spin" />
                <p className="text-sm text-slate-500">Querying services...</p>
              </div>
            </div>
          ) : (
            metrics.map((m) => {
              const isHealthy = m.uptimePct >= 99;
              
              return (
                <div key={m.service} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <span className="relative flex h-3 w-3">
                        {isHealthy && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20" />
                        )}
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-[#0a2a4a] leading-tight">{m.service}</h4>
                      <p className="text-xs font-medium text-slate-500">{m.details}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 bg-slate-50 px-4 py-2 rounded-md border border-slate-100">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Latency</span>
                      <span className="text-xs font-mono font-semibold text-slate-700">{m.latencyMs} ms</span>
                    </div>
                    <div className="h-6 w-px bg-slate-200" />
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Uptime</span>
                      <span className={`text-xs font-mono font-semibold ${isHealthy ? 'text-emerald-600' : 'text-amber-600'}`}>
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
