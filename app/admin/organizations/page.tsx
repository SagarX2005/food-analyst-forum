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

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (org.city && org.city.toLowerCase().includes(searchTerm.toLowerCase()))
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
              Organization Verification
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review and accredit testing laboratories, FSSAI bodies, and research institutes.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 shrink-0">
            <Building2 className="h-4 w-4 text-[#4a9d23]" />
            <span>{organizations.length} organizations</span>
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
            placeholder="Search organizations..."
            className="pl-9 h-9 text-sm bg-slate-50 border-slate-200 focus-visible:ring-[#4a9d23] focus-visible:ring-offset-0"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
            {filteredOrgs.length} result{filteredOrgs.length !== 1 ? "s" : ""}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={loadOrgs}
            disabled={loading}
            className="h-9 gap-1.5 text-slate-600 border-slate-200 hover:bg-slate-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm py-24 flex flex-col items-center justify-center space-y-4">
            <div className="h-6 w-6 border-2 border-slate-200 border-t-[#4a9d23] rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Loading organizations...</p>
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm py-24 flex flex-col items-center justify-center space-y-3 px-4 text-center">
            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-2">
              <Building2 className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-base font-bold text-[#0a2a4a]">No organizations found</p>
            <p className="text-sm text-slate-500 max-w-sm">There are no organizations matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredOrgs.map((org) => {
              const isVerified = org.verified || false;

              return (
                <Card key={org.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-slate-200 shadow-sm bg-white hover:shadow-md hover:border-[#4a9d23]/30 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-[#4a9d23]/10 group-hover:border-[#4a9d23]/20 transition-colors">
                      <Building2 className="h-5 w-5 text-slate-400 group-hover:text-[#4a9d23] transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#0a2a4a]">
                          {org.name}
                        </h3>
                        {isVerified && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-widest">
                            <ShieldCheck className="h-3 w-3" /> Verified
                          </div>
                        )}
                        {!isVerified && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-widest">
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
                    className={`gap-1.5 shrink-0 h-9 font-semibold ${isVerified ? 'text-slate-600 border-slate-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50' : 'shadow-sm'}`}
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
