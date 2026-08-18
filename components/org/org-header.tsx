import { Building2, MapPin, Globe, ShieldCheck } from "lucide-react";
import { Badge } from "@components/ui/badge";
import type { OrganizationWithMembers } from "@services/organizationService";

export function OrgHeader({ org }: { org: OrganizationWithMembers }) {
  return (
    <div className="border-border/60 bg-card relative overflow-hidden rounded-3xl border shadow-lg">
      <div className="relative h-44 w-full bg-gradient-to-r from-[#0a2a4a] via-[#154678] to-[#4a9d23] sm:h-56" />

      <div className="relative px-6 pt-0 pb-6">
        <div className="-mt-16 mb-4 flex flex-col items-start justify-between gap-4 sm:-mt-20 sm:flex-row sm:items-end">
          <div className="border-card bg-background flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-4 shadow-2xl sm:h-36 sm:w-36">
            {org.logo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={org.logo_url} alt={org.name} className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-12 w-12 text-[#4a9d23]" />
            )}
          </div>

          {org.is_verified && (
            <Badge variant="green" className="gap-1.5 px-3 py-1 text-xs">
              <ShieldCheck className="h-4 w-4" /> NABL & FSSAI Accredited Facility
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <h1 className="dark:text-foreground text-2xl font-extrabold text-[#0a2a4a] sm:text-3xl">
              {org.name}
            </h1>
            <p className="text-muted-foreground flex items-center gap-1.5 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-[#4a9d23]" />
              {org.city ? `${org.city}, ${org.state || "India"}` : "India"}
            </p>
          </div>

          {org.description && (
            <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed">
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
