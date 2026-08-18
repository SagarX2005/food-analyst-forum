import * as React from "react";
import { cn } from "@lib/utils";

interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AuthCard({ children, className, ...props }: AuthCardProps) {
  return (
    <div
      className={cn(
        "border-border/60 bg-card text-card-foreground w-full max-w-md rounded-3xl border p-8 shadow-xl transition-all",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
