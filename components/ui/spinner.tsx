/**
 * Spinner — now powered by the FlaskLoader for on-brand animation.
 * Drop-in compatible with all existing Spinner usages.
 */
import { FlaskLoader } from "./flask-loader";
import { cn } from "@lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <div className={cn("inline-flex items-center justify-center", className)} {...props}>
      <FlaskLoader size={size} />
    </div>
  );
}
