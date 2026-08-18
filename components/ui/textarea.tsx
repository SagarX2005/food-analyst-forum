import * as React from "react";
import { cn } from "@lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "border-input bg-background placeholder:text-muted-foreground flex min-h-[100px] w-full resize-y rounded-xl border px-4 py-3 text-sm shadow-xs transition-all duration-200 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[#4a9d23] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
