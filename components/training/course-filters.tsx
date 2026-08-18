"use client";

import { LayoutGrid, List } from "lucide-react";
import { Badge } from "@components/ui/badge";
import { Select } from "@components/ui/select";
import { Button } from "@components/ui/button";

interface CourseFiltersProps {
  activeLevel: string;
  onSelectLevel: (level: string) => void;
  activeSort: string;
  onSelectSort: (sort: string) => void;
  viewMode: "grid" | "list";
  onToggleViewMode: (mode: "grid" | "list") => void;
}

export function CourseFilters({
  activeLevel,
  onSelectLevel,
  activeSort,
  onSelectSort,
  viewMode,
  onToggleViewMode,
}: CourseFiltersProps) {
  const levels = [
    { slug: "all", label: "All Levels" },
    { slug: "Beginner", label: "Beginner Analyst" },
    { slug: "Intermediate", label: "Intermediate" },
    { slug: "Advanced", label: "Advanced Auditor" },
  ];

  const sortOptions = [
    { value: "latest", label: "Newest Courses" },
    { value: "popular", label: "Most Popular / Enrolled" },
    { value: "rating", label: "Highest Rated (5 Stars)" },
  ];

  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      {/* Difficulty Level Tabs */}
      <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0">
        {levels.map((l) => {
          const isActive = activeLevel === l.slug;
          return (
            <Badge
              key={l.slug}
              variant={isActive ? "green" : "outline"}
              onClick={() => onSelectLevel(l.slug)}
              className="cursor-pointer px-3 py-1.5 text-xs whitespace-nowrap"
            >
              {l.label}
            </Badge>
          );
        })}
      </div>

      {/* Sort Select & View Mode Toggle */}
      <div className="flex w-full shrink-0 items-center gap-3 md:w-auto">
        <div className="w-full md:w-52">
          <Select
            value={activeSort}
            onChange={(e) => onSelectSort(e.target.value)}
            options={sortOptions}
          />
        </div>

        <div className="border-border bg-card flex items-center gap-1 rounded-xl border p-1">
          <Button
            variant={viewMode === "grid" ? "green" : "ghost"}
            size="icon"
            onClick={() => onToggleViewMode("grid")}
            className="h-8 w-8"
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "green" : "ghost"}
            size="icon"
            onClick={() => onToggleViewMode("list")}
            className="h-8 w-8"
            title="List View"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
