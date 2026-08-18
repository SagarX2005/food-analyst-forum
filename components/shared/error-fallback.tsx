"use client";

import { Button } from "@components/ui/button";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <div className="bg-destructive/10 text-destructive rounded-full p-4">⚠️</div>
      <h2 className="mt-4 text-2xl font-bold tracking-tight">Something went wrong!</h2>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        {error.message ||
          "An unexpected application error has occurred. Our engineers have been notified."}
      </p>
      {error.digest && (
        <code className="bg-muted text-muted-foreground mt-2 rounded px-2 py-1 font-mono text-xs">
          Digest: {error.digest}
        </code>
      )}
      <Button onClick={() => reset()} className="mt-6">
        Try again
      </Button>
    </div>
  );
}
