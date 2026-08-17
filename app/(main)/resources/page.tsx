"use client";

import * as React from "react";
import Link from "next/link";
import { Upload, Search, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { ResourceService, type FullResource, type ResourceCategoryRow, type GetResourcesOptions } from "@services/resourceService";
import { ResourceCard } from "@components/resources/resource-card";
import { CollectionCard } from "@components/resources/collection-card";
import { ResourceFilters } from "@components/resources/resource-filters";

export default function ResourceLibraryPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categories, setCategories] = React.useState<ResourceCategoryRow[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = React.useState("all");
  const [activeSort, setActiveSort] = React.useState("latest");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const [resources, setResources] = React.useState<FullResource[]>([]);
  const [loading, setLoading] = React.useState(true);

  const collections = ResourceService.getCollections();

  React.useEffect(() => {
    async function initCategories() {
      const cats = await ResourceService.getCategories();
      setCategories(cats);
    }
    initCategories();
  }, []);

  const loadResources = React.useCallback(async () => {
    setLoading(true);
    const data = await ResourceService.getResources({
      categorySlug: activeCategorySlug,
      search: searchTerm,
      sortBy: activeSort as GetResourcesOptions["sortBy"],
    });
    setResources(data);
    setLoading(false);
  }, [activeCategorySlug, searchTerm, activeSort]);

  React.useEffect(() => {
    loadResources();
  }, [loadResources]);

  return (
    <div className="space-y-8 py-4">
      {/* HEADER CTA BANNER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-[#4a9d23]" />
            <h1 className="text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground">
              Enterprise Laboratory Resource Library
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Central repository for accredited laboratory SOPs, FSSAI regulatory compliance manuals, and LC-MS method protocols.
          </p>
        </div>

        <Link href="/resources/upload">
          <Button variant="green" size="lg" className="gap-2 shadow-md shrink-0">
            <Upload className="h-5 w-5" /> Upload Document
          </Button>
        </Link>
      </div>

      {/* CURATED KNOWLEDGE COLLECTIONS */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-[#0a2a4a] dark:text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-[#4a9d23]" /> Curated Knowledge Kits & Collections
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((col) => (
            <CollectionCard
              key={col.id}
              collection={col}
              onSelect={() => setActiveCategorySlug("all")}
            />
          ))}
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search SOP documents, FSSAI regulations, measurement uncertainty spreadsheets..."
          className="pl-10 h-11"
        />
      </div>

      {/* CATEGORY & SORT FILTERS */}
      <ResourceFilters
        categories={categories}
        activeCategorySlug={activeCategorySlug}
        onSelectCategory={(cat) => setActiveCategorySlug(cat)}
        activeSort={activeSort}
        onSelectSort={(sort) => setActiveSort(sort)}
        viewMode={viewMode}
        onToggleViewMode={(mode) => setViewMode(mode)}
      />

      {/* RESOURCES FEED GRID/LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Loading knowledge repository...
          </div>
        ) : resources.length === 0 ? (
          <div className="py-16 text-center space-y-3 border-2 border-dashed border-border rounded-3xl p-8">
            <p className="text-base font-bold text-[#0a2a4a] dark:text-foreground">
              No knowledge resources found matching your search.
            </p>
            <p className="text-xs text-muted-foreground">
              Be the first to upload an accredited laboratory SOP or validation protocol to the repository!
            </p>
            <Link href="/resources/upload" className="inline-block pt-2">
              <Button variant="green" size="default" className="gap-2">
                <Upload className="h-4 w-4" /> Upload Resource Document
              </Button>
            </Link>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {resources.map((res) => (
              <ResourceCard key={res.id} resource={res} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
