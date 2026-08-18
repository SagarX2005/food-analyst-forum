import Link from "next/link";

interface AuthFooterProps {
  label: string;
  linkText: string;
  linkHref: string;
}

export function AuthFooter({ label, linkText, linkHref }: AuthFooterProps) {
  return (
    <div className="text-muted-foreground mt-6 text-center text-xs">
      <span>{label} </span>
      <Link
        href={linkHref}
        className="font-bold text-[#4a9d23] underline-offset-4 transition-colors hover:underline"
      >
        {linkText}
      </Link>
    </div>
  );
}
