import { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrganizationService } from "@services/organizationService";
import { OrgHeader } from "@components/org/org-header";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Users, Building2, MapPin } from "lucide-react";
import { Avatar } from "@components/ui/avatar";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const org = await OrganizationService.getOrganizationBySlug(slug);

  if (!org) {
    return {
      title: "Organization Not Found",
    };
  }

  return {
    title: `${org.name} — Accredited Laboratory Facility`,
    description: org.description || `${org.name} profile on Food Analyst Forum.`,
  };
}

export default async function OrgProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const org = await OrganizationService.getOrganizationBySlug(slug);

  if (!org) {
    notFound();
  }

  return (
    <div className="space-y-8 py-4">
      <OrgHeader org={org} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-[#4a9d23]" /> Certified Laboratory Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              {org.members && org.members.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {org.members.map((member) => (
                    <Link
                      key={member.id}
                      href={`/u/${member.username || member.id}`}
                      className="p-3 rounded-2xl border border-border/60 hover:border-[#4a9d23] transition-all flex items-center gap-3 group"
                    >
                      <Avatar
                        src={member.avatar_url || undefined}
                        fallback={member.full_name || "User"}
                        size="md"
                      />
                      <div className="space-y-0.5 truncate">
                        <p className="text-sm font-bold text-[#0a2a4a] dark:text-foreground group-hover:text-[#4a9d23] transition-colors truncate">
                          {member.full_name || "Analyst"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.title || "Analyst Member"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No public members listed for this organization yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-[#0a2a4a] dark:text-foreground">
                Facility Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#4a9d23]" />
                <span>NABL ISO/IEC 17025 Accredited</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#4a9d23]" />
                <span>{org.city ? `${org.city}, ${org.state || "India"}` : "India"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
