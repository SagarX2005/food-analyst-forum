"use client";

import { cn } from "@lib/utils";
import Lottie from "lottie-react";
import flaskAnimation from "../../public/animations/flask-loader.json";

interface FlaskLoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  label?: string;
  showLabel?: boolean;
}

const sizeConfig = {
  sm:  { px: 32,  label: "text-xs" },
  md:  { px: 56,  label: "text-sm" },
  lg:  { px: 96,  label: "text-sm" },
  xl:  { px: 140, label: "text-base" },
};

export function FlaskLoader({
  size = "md",
  className,
  label = "Loading...",
  showLabel = false,
}: FlaskLoaderProps) {
  const { px, label: labelClass } = sizeConfig[size];

  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-flex flex-col items-center justify-center gap-2", className)}
    >
      <Lottie
        animationData={flaskAnimation}
        loop
        autoplay
        style={{ width: px, height: px }}
      />

      {showLabel && (
        <p className={cn("font-semibold text-[#0a2a4a]", labelClass)}>{label}</p>
      )}

      <span className="sr-only">{label}</span>
    </div>
  );
}

/** Full-page loading screen with the Lottie flask */
export function FlaskPageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <FlaskLoader size="xl" showLabel label={message} />
    </div>
  );
}

/** Tiny inline flask for use inside buttons */
export function FlaskButtonLoader({ className }: { className?: string }) {
  return <FlaskLoader size="sm" className={className} />;
}
