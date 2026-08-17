import { Card } from "@components/ui/card";
import { TrendingUp, type LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  icon: LucideIcon;
  color?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
}: KpiCardProps) {
  return (
    <Card className="p-4 flex flex-col justify-between border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-[#4a9d23]/30 group bg-white">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            {title}
          </span>
          <h3 className="text-2xl font-black text-[#0a2a4a] tracking-tight">
            {value}
          </h3>
        </div>
        <div className="h-8 w-8 rounded-md bg-slate-50 text-[#0a2a4a] flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-[#4a9d23]/10 group-hover:border-[#4a9d23]/20 transition-colors">
          <Icon className="h-4 w-4 text-slate-500 group-hover:text-[#4a9d23] transition-colors" />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-500">
          <TrendingUp className="h-3 w-3 text-[#4a9d23]" /> {trend}
        </span>
        {subtitle && <span>{subtitle}</span>}
      </div>
    </Card>
  );
}
