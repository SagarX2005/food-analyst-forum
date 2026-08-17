"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, ArrowLeft } from "lucide-react";
import { ResourceService, type FullResource } from "@services/resourceService";
import { ResourceCard } from "@components/resources/resource-card";
import { useAuth } from "@hooks/use-auth";

export default function SavedResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = React.useState<FullResource[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadSaved() {
      if (!user) return;
      setLoading(true);
      const data = await ResourceService.getResources({ sortBy: "most_downloaded", limit: 10 });
      setResources(data);
      setLoading(false);
    }
    loadSaved();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div>
        <Link href="/resources" className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline mb-2">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Resource Library
        </Link>
        <h1 className="text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
          <Bookmark className="h-7 w-7 text-[#4a9d23]" /> My Saved SOPs & Documents
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quick access to bookmarked laboratory SOPs, FSSAI advisories, and validation templates.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            Loading saved resources...
          </div>
        ) : resources.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            You have not bookmarked any knowledge documents yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
