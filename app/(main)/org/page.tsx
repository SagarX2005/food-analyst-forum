"use client";

import * as React from "react";
import { Search, Building2 } from "lucide-react";
import { Input } from "@components/ui/input";
import { OrgCard } from "@components/org/org-card";
import { OrganizationService, type ExtendedOrganization } from "@services/organizationService";

export default function OrgDirectoryPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [orgs, setOrgs] = React.useState<ExtendedOrganization[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await OrganizationService.listOrganizations(searchTerm);
      setOrgs(data);
      setLoading(false);
    }
    loadData();
  }, [searchTerm]);

  return (
    <div className="space-y-8 py-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Building2 className="h-7 w-7 text-[#4a9d23]" />
          <h1 className="dark:text-foreground text-3xl font-extrabold text-[#0a2a4a]">
            Accredited Laboratory & Organization Directory
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Discover NABL & FSSAI accredited food testing laboratories, certification bodies, and FMCG
          manufacturers across India.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <div className="relative w-full flex-1">
          <Search className="text-muted-foreground absolute top-3.5 left-3.5 h-4 w-4" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search organizations by name, city, or accreditation..."
            className="pl-10"
          />
        </div>
      </div>

      {/* ORGANIZATIONS GRID */}
      {loading ? (
        <div className="text-muted-foreground py-12 text-center text-sm">
          Loading accredited organizations...
        </div>
      ) : orgs.length === 0 ? (
        <div className="text-muted-foreground space-y-2 py-12 text-center text-sm">
          <p className="font-bold">No organizations found matching your search.</p>
          <p className="text-xs">
            Try searching for &quot;Eurofins&quot;, &quot;Nestlé&quot;, or &quot;Mumbai&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orgs.map((org) => (
            <OrgCard key={org.id} org={org} />
          ))}
        </div>
      )}
    </div>
  );
}
