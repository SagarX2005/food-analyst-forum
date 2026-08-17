"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@lib/utils";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function AccordionItem({ title, children, isOpen, onToggle, className }: AccordionItemProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = isOpen !== undefined ? isOpen : internalOpen;

  const handleToggle = () => {
    if (onToggle) onToggle();
    else setInternalOpen(!internalOpen);
  };

  return (
    <div className={cn("border-b border-border/60 py-3", className)}>
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between py-2 text-left font-semibold text-[#0a2a4a] dark:text-foreground transition-all hover:text-[#4a9d23]"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn("h-5 w-5 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open && <div className="pt-2 pb-4 text-sm text-muted-foreground leading-relaxed animate-in fade-in-50 duration-200">{children}</div>}
    </div>
  );
}

export function Accordion({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("w-full divide-y divide-border/60", className)}>{children}</div>;
}
