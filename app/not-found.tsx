import Link from "next/link";
import { FlaskConical, Home, Search } from "lucide-react";
import { Button } from "@components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 px-4 text-center">
      <div className="dark:text-primary dark:bg-primary/10 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#0a2a4a]/10 text-[#0a2a4a]">
        <FlaskConical className="h-10 w-10 text-[#4a9d23]" />
      </div>
      <div className="max-w-md space-y-2">
        <h1 className="dark:text-foreground text-4xl font-extrabold text-[#0a2a4a]">
          404 — Page Not Found
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The scientific methodology, resource page, or analytical topic you are searching for could
          not be located in our directory.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/">
          <Button variant="navy" size="lg" className="gap-2">
            <Home className="h-4 w-4" /> Return to Home
          </Button>
        </Link>
        <Link href="/forum">
          <Button variant="green" size="lg" className="gap-2">
            <Search className="h-4 w-4" /> Browse Forum
          </Button>
        </Link>
      </div>
    </div>
  );
}
