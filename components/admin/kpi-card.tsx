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

export function KpiCard({ title, value, subtitle, trend, icon: Icon }: KpiCardProps) {
  return (
    <Card className="group flex flex-col justify-between border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-[#4a9d23]/30 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="space-y-0.5">
          <span className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            {title}
          </span>
          <h3 className="text-2xl font-black tracking-tight text-[#0a2a4a]">{value}</h3>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-[#0a2a4a] transition-colors group-hover:border-[#4a9d23]/20 group-hover:bg-[#4a9d23]/10">
          <Icon className="h-4 w-4 text-slate-500 transition-colors group-hover:text-[#4a9d23]" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] font-bold text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-500">
          <TrendingUp className="h-3 w-3 text-[#4a9d23]" /> {trend}
        </span>
        {subtitle && <span>{subtitle}</span>}
      </div>
    </Card>
  );
}
