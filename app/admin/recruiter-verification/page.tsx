// app/admin/recruiter-verification/page.tsx
import { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { RecruiterVerificationService } from "@services/recruiterVerificationService";
import { RecruiterApplicationTable } from "./_components/recruiter-application-table";
import { Card } from "@components/ui/card";
import { Badge } from "@components/ui/badge";

export const metadata: Metadata = {
  title: "Recruiter Verification — Admin",
  description: "Review and manage recruiter applications for Food Analyst Forum.",
};

export const dynamic = "force-dynamic";

function StatCard({ label, value, status }: { label: string; value: number; status?: string }) {
  return (
    <Card className="group flex items-start justify-between border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-300">
      <div className="space-y-1">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{label}</p>
        <p className="text-2xl font-black tracking-tight text-[#0a2a4a]">{value}</p>
      </div>
      {status && (
        <Badge variant={status === "pending" ? "default" : status === "approved" ? "green" : "secondary"}>
          {status}
        </Badge>
      )}
    </Card>
  );
}

export default async function RecruiterVerificationPage() {
  const { data: applications } = await RecruiterVerificationService.getApplications({ status: "all", limit: 100 });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    moreInfo: applications.filter((a) => a.status === "more_information_required").length,
  };

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#0a2a4a]">
            Recruiter Verification
          </h1>
          <p className="mt-1 text-sm text-slate-500">Review platform applications for Recruiter access.</p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
          <Briefcase className="h-4 w-4 text-indigo-500" />
          <span>{stats.pending} pending applications</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Apps" value={stats.total} />
        <StatCard label="Pending" value={stats.pending} status="pending" />
        <StatCard label="Approved" value={stats.approved} status="approved" />
        <StatCard label="Rejected" value={stats.rejected} status="rejected" />
        <StatCard label="More Info" value={stats.moreInfo} />
      </div>

      <RecruiterApplicationTable applications={applications} />
    </div>
  );
}
