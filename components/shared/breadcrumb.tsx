"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumb() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-muted-foreground mb-6 flex items-center gap-2 text-xs font-medium"
    >
      <Link href="/" className="flex items-center gap-1 transition-colors hover:text-[#4a9d23]">
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>
      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === pathSegments.length - 1;
        const formattedLabel =
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

        return (
          <div key={href} className="flex items-center gap-2">
            <ChevronRight className="text-muted-foreground/60 h-3.5 w-3.5" />
            {isLast ? (
              <span className="dark:text-foreground font-semibold text-[#0a2a4a]">
                {formattedLabel}
              </span>
            ) : (
              <Link href={href} className="transition-colors hover:text-[#4a9d23]">
                {formattedLabel}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
