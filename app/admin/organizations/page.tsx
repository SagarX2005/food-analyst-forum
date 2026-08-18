"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, ShieldCheck, ArrowLeft, Search, RefreshCw, XCircle } from "lucide-react";

import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { AdminService } from "@services/adminService";
import { OrganizationService, type OrganizationRow } from "@services/organizationService";

export default function OrganizationManagementPage() {
  const [organizations, setOrganizations] = React.useState<OrganizationRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  const loadOrgs = React.useCallback(async () => {
    setLoading(true);
    const data = await OrganizationService.listOrganizations();
    setOrganizations(data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    loadOrgs();
  }, [loadOrgs]);

  const handleToggleVerification = async (orgId: string, currentStatus: boolean) => {
    await AdminService.toggleOrganizationVerification(orgId, !currentStatus);
    loadOrgs();
  };

  const filteredOrgs = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (org.city && org.city.toLowerCase().includes(searchTerm.toLowerCase())),
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
              Organization Verification
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review and accredit testing laboratories, FSSAI bodies, and research institutes.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
            <Building2 className="h-4 w-4 text-[#4a9d23]" />
            <span>{organizations.length} organizations</span>
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
            placeholder="Search organizations..."
            className="h-9 border-slate-200 bg-slate-50 pl-9 text-sm focus-visible:ring-[#4a9d23] focus-visible:ring-offset-0"
          />
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <span className="text-xs font-medium whitespace-nowrap text-slate-500">
            {filteredOrgs.length} result{filteredOrgs.length !== 1 ? "s" : ""}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={loadOrgs}
            disabled={loading}
            className="h-9 gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-slate-200 bg-white py-24 shadow-sm">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#4a9d23]" />
            <p className="text-sm text-slate-500">Loading organizations...</p>
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-slate-200 bg-white px-4 py-24 text-center shadow-sm">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
              <Building2 className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-base font-bold text-[#0a2a4a]">No organizations found</p>
            <p className="max-w-sm text-sm text-slate-500">
              There are no organizations matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredOrgs.map((org) => {
              const isVerified = org.verified || false;

              return (
                <Card
                  key={org.id}
                  className="group flex flex-col items-start justify-between gap-4 border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-[#4a9d23]/30 hover:shadow-md sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 transition-colors group-hover:border-[#4a9d23]/20 group-hover:bg-[#4a9d23]/10">
                      <Building2 className="h-5 w-5 text-slate-400 transition-colors group-hover:text-[#4a9d23]" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#0a2a4a]">{org.name}</h3>
                        {isVerified && (
                          <div className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-700 uppercase">
                            <ShieldCheck className="h-3 w-3" /> Verified
                          </div>
                        )}
                        {!isVerified && (
                          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                            Pending Audit
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-500">
                        {org.city || "Mumbai"}, {org.state || "MH"} • NABL / FSSAI Partner
                      </p>
                    </div>
                  </div>

                  <Button
                    variant={isVerified ? "outline" : "green"}
                    size="sm"
                    onClick={() => handleToggleVerification(org.id, isVerified)}
                    className={`h-9 shrink-0 gap-1.5 font-semibold ${isVerified ? "border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600" : "shadow-sm"}`}
                  >
                    {isVerified ? (
                      <>
                        <XCircle className="h-4 w-4" /> Revoke Verification
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" /> Approve Verification
                      </>
                    )}
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
