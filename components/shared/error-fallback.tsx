"use client";

import { Button } from "@components/ui/button";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-destructive/10 p-4 text-destructive">⚠️</div>
      <h2 className="mt-4 font-bold text-2xl tracking-tight">Something went wrong!</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {error.message || "An unexpected application error has occurred. Our engineers have been notified."}
      </p>
      {error.digest && (
        <code className="mt-2 rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
          Digest: {error.digest}
        </code>
      )}
      <Button onClick={() => reset()} className="mt-6">
        Try again
      </Button>
    </div>
  );
}
