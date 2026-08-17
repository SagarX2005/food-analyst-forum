"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Users, ShieldCheck, MapPin, Building2 } from "lucide-react";
import { Input } from "@components/ui/input";
import { Card } from "@components/ui/card";
import { Avatar } from "@components/ui/avatar";
import { Badge } from "@components/ui/badge";
import { ProfileService, type FullProfile } from "@services/profileService";

export default function MembersDirectoryPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [members, setMembers] = React.useState<FullProfile[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadMembers() {
      setLoading(true);
      const data = await ProfileService.searchProfiles(searchTerm);
      setMembers(data);
      setLoading(false);
    }
    loadMembers();
  }, [searchTerm]);

  return (
    <div className="space-y-8 py-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="h-7 w-7 text-[#4a9d23]" />
          <h1 className="text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground">
            Food Analysts Member Directory
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Connect with certified food analysts, microbiologists, quality managers, and regulatory officers across India.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search members by name, title, or city..."
          className="pl-10"
        />
      </div>

      {/* MEMBERS GRID */}
      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Loading analyst profiles...
        </div>
      ) : members.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground space-y-2">
          <p className="font-bold">No members found matching your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card key={member.id} className="hover:border-[#4a9d23] transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={member.avatar_url || undefined}
                    fallback={member.full_name || "User"}
                    size="lg"
                  />
                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-[#0a2a4a] dark:text-foreground group-hover:text-[#4a9d23] transition-colors truncate">
                        {member.full_name || "Analyst"}
                      </h3>
                      <ShieldCheck className="h-4 w-4 text-[#4a9d23] shrink-0" />
                    </div>
                    <Badge variant="green" className="text-[10px] uppercase">
                      {member.roles?.name || "User"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">{member.title || "Food Safety Specialist"}</p>
                  {member.organizations?.name && (
                    <p className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-[#4a9d23]" /> {member.organizations.name}
                    </p>
                  )}
                  {member.location && (
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {member.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border/60">
                <Link
                  href={`/u/${member.username || member.id}`}
                  className="inline-flex items-center text-xs font-bold text-[#4a9d23] hover:underline"
                >
                  View Member Profile →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
