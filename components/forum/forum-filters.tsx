"use client";

import { Badge } from "@components/ui/badge";
import { Select } from "@components/ui/select";
import type { ForumCategoryRow } from "@services/forumService";

interface ForumFiltersProps {
  categories: ForumCategoryRow[];
  activeCategorySlug: string;
  onSelectCategory: (slug: string) => void;
  activeSort: string;
  onSelectSort: (sort: string) => void;
}

export function ForumFilters({
  categories,
  activeCategorySlug,
  onSelectCategory,
  activeSort,
  onSelectSort,
}: ForumFiltersProps) {
  const sortOptions = [
    { value: "latest", label: "Latest Discussions" },
    { value: "trending", label: "Trending / Most Liked" },
    { value: "most_viewed", label: "Most Viewed" },
    { value: "unanswered", label: "Unanswered Questions" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
        <Badge
          variant={activeCategorySlug === "all" ? "green" : "outline"}
          onClick={() => onSelectCategory("all")}
          className="cursor-pointer px-3 py-1.5 text-xs whitespace-nowrap"
        >
          All Topics
        </Badge>
        {categories.map((c) => {
          const isActive = activeCategorySlug === c.slug;
          return (
            <Badge
              key={c.id}
              variant={isActive ? "green" : "outline"}
              onClick={() => onSelectCategory(c.slug)}
              className="cursor-pointer px-3 py-1.5 text-xs whitespace-nowrap"
            >
              {c.name}
            </Badge>
          );
        })}
      </div>

      {/* Sort Filter Select */}
      <div className="w-full md:w-56 shrink-0">
        <Select
          value={activeSort}
          onChange={(e) => onSelectSort(e.target.value)}
          options={sortOptions}
        />
      </div>
    </div>
  );
}
