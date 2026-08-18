import { Metadata } from "next";
import { Calendar } from "lucide-react";
import { Card } from "@components/ui/card";
import { Badge } from "@components/ui/badge";

export const metadata: Metadata = {
  title: "News & Regulatory Updates",
  description:
    "Stay updated with FSSAI regulations, maximum residue limits, NABL 17025 standards, and food safety news in India.",
};

export default function NewsPage() {
  const newsItems = [
    {
      id: 1,
      title: "FSSAI issues new guidelines for fortified foods",
      date: "05 Aug 2026",
      category: "FSSAI Regulations",
      content:
        "New labeling norms and mandatory fortification validation protocols to be implemented across processed food categories starting Jan 2027.",
    },
    {
      id: 2,
      title: "NABL revises 17025 checklist",
      date: "01 Aug 2026",
      category: "NABL Accreditation",
      content:
        "Updated technical requirements for food testing laboratory accreditation, internal audits, and measurement uncertainty estimation.",
    },
    {
      id: 3,
      title: "Strict MRL Enforcement for Exported Spices and Culinary Herbs",
      date: "28 Jul 2026",
      category: "Export Quality",
      content:
        "Regulatory authorities release revised ethylene oxide and pesticide residue testing suites for accredited testing facilities.",
    },
  ];

  return (
    <div className="space-y-8 py-4">
      <div className="space-y-2">
        <h1 className="dark:text-foreground text-3xl font-extrabold text-[#0a2a4a]">
          Latest News & Regulatory Updates
        </h1>
        <p className="text-muted-foreground text-sm">
          Official FSSAI notifications, NABL accreditation advisories, and food laboratory industry
          developments.
        </p>
      </div>

      <div className="space-y-4">
        {newsItems.map((news) => (
          <Card key={news.id} className="transition-all hover:border-[#4a9d23]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="green" className="text-[11px]">
                  {news.category}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-[#777]">
                  <Calendar className="h-3.5 w-3.5" />
                  {news.date}
                </span>
              </div>
              <h3 className="dark:text-foreground cursor-pointer text-xl font-bold text-[#0a2a4a] transition-colors hover:text-[#4a9d23]">
                {news.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{news.content}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
