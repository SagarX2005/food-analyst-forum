import { FlaskPageLoader } from "@components/ui/flask-loader";
import { Skeleton } from "@components/ui/skeleton";

interface LoadingStateProps {
  message?: string;
  variant?: "spinner" | "cards";
}

export function LoadingState({ message = "Loading...", variant = "spinner" }: LoadingStateProps) {
  if (variant === "cards") {
    return (
      <div className="space-y-8 py-8">
        {/* Flask loader centred above skeleton cards */}
        <div className="flex justify-center">
          <FlaskPageLoader message={message} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return <FlaskPageLoader message={message} />;
}
