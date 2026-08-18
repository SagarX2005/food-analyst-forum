"use client";

import * as React from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@components/ui/input";
import { ProfileCard } from "@components/profile/profile-card";
import { ProfileService, type FullProfile } from "@services/profileService";

export default function PeopleDirectoryPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [profiles, setProfiles] = React.useState<FullProfile[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await ProfileService.searchProfiles(searchTerm);
      setProfiles(data);
      setLoading(false);
    }

    // Add a slight debounce for typing
    const timeoutId = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="space-y-8 py-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="h-7 w-7 text-[#4a9d23]" />
          <h1 className="dark:text-foreground text-3xl font-extrabold text-[#0a2a4a]">
            Professional Network Directory
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Connect with certified food analysts, laboratory professionals, and industry experts.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <div className="relative w-full flex-1">
          <Search className="text-muted-foreground absolute top-3.5 left-3.5 h-4 w-4" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search professionals by name, skill, or organization..."
            className="pl-10"
          />
        </div>
      </div>

      {/* PEOPLE GRID */}
      {loading ? (
        <div className="text-muted-foreground flex flex-col items-center gap-4 py-12 text-center text-sm">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#4a9d23]" />
          Loading professionals...
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-muted-foreground space-y-2 rounded-lg border border-slate-200 bg-white py-12 text-center text-sm">
          <p className="font-bold text-[#0a2a4a]">No professionals found matching your search.</p>
          <p className="text-xs">
            Try searching for &quot;Microbiology&quot;, &quot;HPLC&quot;, or &quot;Manager&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}
