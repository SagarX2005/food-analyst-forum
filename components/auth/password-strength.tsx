import { calculatePasswordStrength } from "@features/auth/schemas";
import { cn } from "@lib/utils";

export function PasswordStrength({ password }: { password?: string }) {
  if (!password) return null;

  const { score, label, color } = calculatePasswordStrength(password);

  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Password strength:</span>
        <span className={cn("font-bold", score < 3 ? "text-orange-500" : "text-[#4a9d23]")}>
          {label}
        </span>
      </div>
      <div className="grid h-1.5 grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={cn(
              "h-full rounded-full transition-all duration-300",
              step <= score ? color : "bg-muted",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function PasswordRequirements({ password = "" }: { password?: string }) {
  const reqs = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter (a-z)", met: /[a-z]/.test(password) },
    { label: "At least one number (0-9)", met: /[0-9]/.test(password) },
    { label: "Special character (@$!%*?&#)", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="text-muted-foreground space-y-1 pt-1 text-xs">
      {reqs.map((req, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-xs font-bold",
              req.met ? "text-[#4a9d23]" : "text-muted-foreground/60",
            )}
          >
            {req.met ? "✓" : "○"}
          </span>
          <span className={cn(req.met && "text-foreground font-medium")}>{req.label}</span>
        </div>
      ))}
    </div>
  );
}
