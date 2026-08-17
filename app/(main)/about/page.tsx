import { Metadata } from "next";
import { Target, Eye, Award, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Food Analyst Forum - India's premier community for food analysts, lab managers, and quality assurance professionals.",
};

export default function AboutPage() {
  return (
    <div className="space-y-12 py-4">
      {/* HEADER SECTION */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <Badge variant="green" className="text-xs">KNOWLEDGE • INTEGRITY • SAFETY</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a2a4a] dark:text-foreground">
          About Food Analyst Forum
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          India’s most trusted network uniting food safety scientists, analytical chemists, laboratory managers, and regulatory compliance experts.
        </p>
      </div>

      {/* GRID 3 CARDS MATCHING PROTOTYPE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:border-[#4a9d23] transition-all">
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-[#4a9d23]/10 text-[#4a9d23] flex items-center justify-center mb-2">
              <Target className="h-5 w-5" />
            </div>
            <CardTitle className="text-[#4a9d23]">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Build a vibrant scientific community, provide standardized SOPs, analytical training, and real-time regulatory update notifications to every food lab across India.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-[#0a2a4a] dark:hover:border-primary transition-all">
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-[#0a2a4a]/10 dark:bg-primary/10 text-[#0a2a4a] dark:text-primary flex items-center justify-center mb-2">
              <Eye className="h-5 w-5" />
            </div>
            <CardTitle className="text-[#0a2a4a] dark:text-foreground">Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To be the premier, most trusted digital platform for laboratory testing excellence, quality assurance innovation, and ISO 17025 compliance in India.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-[#4a9d23] transition-all">
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-[#4a9d23]/10 text-[#4a9d23] flex items-center justify-center mb-2">
              <Award className="h-5 w-5" />
            </div>
            <CardTitle className="text-[#4a9d23]">Our Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0a2a4a] dark:text-foreground">
              <CheckCircle2 className="h-4 w-4 text-[#4a9d23]" />
              <span>5000+ Active Professionals</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0a2a4a] dark:text-foreground">
              <CheckCircle2 className="h-4 w-4 text-[#4a9d23]" />
              <span>1000+ Verified Testing Labs</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0a2a4a] dark:text-foreground">
              <CheckCircle2 className="h-4 w-4 text-[#4a9d23]" />
              <span>3000+ Standard SOP Resources</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DETAILED OVERVIEW SECTION */}
      <section className="rounded-3xl bg-card border border-border/60 p-8 sm:p-12 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-[#0a2a4a] dark:text-foreground">
          Why Food Analyst Forum Matters
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Food safety testing requires rigorous adherence to scientific standards, precise instrumentation, and compliance with evolving regulatory guidelines from FSSAI, NABL, US FDA, and EFSA. Food Analyst Forum connects analysts from accredited laboratories across India, giving them a shared knowledge base to discuss analytical methodologies, resolve matrix interferences, and access validated standard operating procedures.
        </p>
      </section>
    </div>
  );
}
