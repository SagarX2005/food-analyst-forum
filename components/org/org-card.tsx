import Link from "next/link";
import { Building2, MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import { Card } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import type { ExtendedOrganization } from "@services/organizationService";

export function OrgCard({ org }: { org: ExtendedOrganization }) {
  return (
    <Card className="hover:border-[#4a9d23] transition-all flex flex-col justify-between group">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="h-14 w-14 rounded-2xl bg-[#0a2a4a]/10 dark:bg-primary/10 text-[#0a2a4a] dark:text-primary flex items-center justify-center overflow-hidden border border-border">
            {org.logo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={org.logo_url} alt={org.name} className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-7 w-7 text-[#4a9d23]" />
            )}
          </div>
          {org.is_verified && (
            <Badge variant="green" className="gap-1 text-[11px]">
              <ShieldCheck className="h-3 w-3" /> NABL Accredited
            </Badge>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-[#0a2a4a] dark:text-foreground group-hover:text-[#4a9d23] transition-colors">
            {org.name}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {org.city ? `${org.city}, ${org.state || "India"}` : "India"}
          </p>
        </div>

        {org.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {org.description}
          </p>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-border/60">
        <Link
          href={`/org/${org.slug || org.id}`}
          className="inline-flex items-center text-xs font-bold text-[#4a9d23] hover:underline gap-1"
        >
          View Organization Profile <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Card>
  );
}
