"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ isOpen, onClose, title, description, children, className }: DialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "bg-card border-border text-card-foreground relative z-50 w-full max-w-lg rounded-2xl border p-6 shadow-2xl",
              className,
            )}
          >
            <button
              onClick={onClose}
              className="text-muted-foreground hover:bg-accent hover:text-foreground absolute top-4 right-4 rounded-full p-1.5 transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
            {title && (
              <h2 className="dark:text-foreground mb-1 pr-6 text-xl font-bold text-[#0a2a4a]">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{description}</p>
            )}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
