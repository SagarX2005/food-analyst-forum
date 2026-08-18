import { AlertCircle, CheckCircle2 } from "lucide-react";

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <div className="bg-destructive/10 border-destructive/20 text-destructive animate-in fade-in-50 flex items-center gap-2 rounded-xl border p-3.5 text-xs font-semibold duration-200">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function FormSuccess({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <div className="animate-in fade-in-50 flex items-center gap-2 rounded-xl border border-[#4a9d23]/30 bg-[#4a9d23]/10 p-3.5 text-xs font-semibold text-[#4a9d23] duration-200">
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
