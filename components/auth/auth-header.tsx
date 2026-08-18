import Link from "next/link";
import { FlaskConical } from "lucide-react";

interface AuthHeaderProps {
  title: string;
  description?: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="mb-6 flex flex-col items-center space-y-3 text-center">
      <Link href="/" className="group mb-1 flex items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0a2a4a] text-white shadow-md transition-transform group-hover:scale-105">
          <FlaskConical className="h-7 w-7 text-[#4a9d23]" />
        </div>
      </Link>
      <h1 className="dark:text-foreground text-2xl font-extrabold tracking-tight text-[#0a2a4a]">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground max-w-xs text-xs leading-relaxed">{description}</p>
      )}
    </div>
  );
}
