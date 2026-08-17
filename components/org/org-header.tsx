import { Building2, MapPin, Globe, ShieldCheck } from "lucide-react";
import { Badge } from "@components/ui/badge";
import type { OrganizationWithMembers } from "@services/organizationService";

export function OrgHeader({ org }: { org: OrganizationWithMembers }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg">
      <div className="h-44 sm:h-56 w-full bg-gradient-to-r from-[#0a2a4a] via-[#154678] to-[#4a9d23] relative" />

      <div className="px-6 pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
          <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl border-4 border-card shadow-2xl overflow-hidden bg-background flex items-center justify-center">
            {org.logo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={org.logo_url} alt={org.name} className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-12 w-12 text-[#4a9d23]" />
            )}
          </div>

          {org.is_verified && (
            <Badge variant="green" className="gap-1.5 text-xs px-3 py-1">
              <ShieldCheck className="h-4 w-4" /> NABL & FSSAI Accredited Facility
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground">
              {org.name}
            </h1>
            <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#4a9d23]" />
              {org.city ? `${org.city}, ${org.state || "India"}` : "India"}
            </p>
          </div>

          {org.description && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {org.description}
            </p>
          )}

          {org.website && (
            <div className="pt-2">
              <a
                href={org.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4a9d23] hover:underline"
              >
                <Globe className="h-4 w-4" /> {org.website}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
