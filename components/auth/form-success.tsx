import { CheckCircle2 } from "lucide-react";

export function FormSuccess({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 rounded-xl bg-[#4a9d23]/10 border border-[#4a9d23]/30 p-3.5 text-xs font-semibold text-[#4a9d23] animate-in fade-in-50 duration-200">
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
