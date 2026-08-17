import Link from "next/link";
import {
  Users,
  BookOpen,
  FileCheck,
  ArrowRight,
  FlaskConical,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { Badge } from "@components/ui/badge";

export default function HomePage() {
  return (
    <div className="space-y-16 py-4">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8 sm:p-12 lg:p-16 border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Badge variant="green" className="px-3 py-1 text-xs gap-1.5 font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> India’s Premier Laboratory Network
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0a2a4a] leading-[1.25]">
              Where Food Analysis Professionals{" "}
              <span className="text-[#4a9d23]">
                Connect, Learn & Grow.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              FAF brings together food analysts, laboratory professionals, researchers, quality teams, organizations, and industry experts through trusted knowledge, professional opportunities, and specialized learning.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/request-invite">
                <Button variant="navy" size="lg" className="gap-2 shadow-lg hover:shadow-xl">
                  Request an Invitation
                </Button>
              </Link>
              <Link href="#explore">
                <Button variant="outline" size="lg" className="gap-2 shadow-sm">
                  Explore FAF
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-border/60 grid grid-cols-3 gap-4 text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#4a9d23]" />
                <span>5000+ Analysts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#0a2a4a]" />
                <span>1000+ Labs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#4a9d23]" />
                <span>3000+ SOPs</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none overflow-hidden rounded-2xl shadow-2xl border-4 border-white dark:border-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-lab.jpg"
                alt="Food Analyst Laboratory Professional"
                className="w-full h-[380px] object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a2a4a]/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <p className="text-xs font-bold text-[#4a9d23] uppercase tracking-wider">ISO 17025 Compliant</p>
                  <p className="text-sm font-semibold">Standardized Chemical & Microbiological Protocols</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section id="explore" className="space-y-8 scroll-mt-24">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a2a4a]">
            What FAF Offers
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            An exclusive professional ecosystem designed specifically for food safety analysts, lab managers, and quality assurance personnel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-[#4a9d23] transition-all group">
            <div className="h-12 w-12 rounded-2xl bg-[#4a9d23]/10 text-[#4a9d23] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-[#4a9d23] mb-2">DISCUSSION FORUM</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Connect with leading experts, troubleshoot complex matrix interferences, and solve laboratory analytical challenges.
            </p>
            <Link href="/forum" className="inline-flex items-center text-xs font-bold text-[#4a9d23] hover:underline gap-1">
              Join Discussions <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>

          <Card className="hover:border-[#0a2a4a] transition-all group">
            <div className="h-12 w-12 rounded-2xl bg-[#0a2a4a]/10 text-[#0a2a4a] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0a2a4a] mb-2">SOP LIBRARY</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Access standardized operating procedures, analytical testing methodologies, and validated uncertainty templates.
            </p>
            <Link href="/resources" className="inline-flex items-center text-xs font-bold text-[#0a2a4a] hover:underline gap-1">
              Browse SOPs <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>

          <Card className="hover:border-[#4a9d23] transition-all group">
            <div className="h-12 w-12 rounded-2xl bg-[#4a9d23]/10 text-[#4a9d23] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              <FileCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-[#4a9d23] mb-2">REGULATORY UPDATES</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Stay immediately updated with FSSAI notifications, MRL revisions, NABL 17025 checklists, and global regulations.
            </p>
            <Link href="/news" className="inline-flex items-center text-xs font-bold text-[#4a9d23] hover:underline gap-1">
              Read Latest News <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
        </div>
      </section>

      {/* QUICK STATS & FLIMS BANNER */}
      <section className="rounded-3xl bg-[#0a2a4a] text-white p-8 sm:p-12 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <Badge variant="green" className="text-xs">FLIMS Platform</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Food Analyst Laboratory Information System (FLIMS)
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Track samples from sample receiving to final test report dispatch. Auto-generate NABL & FSSAI compliant reports with full instrument calibration and logbook management.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <Link href="/flims">
              <Button variant="green" size="lg" className="gap-2 shadow-lg">
                <FlaskConical className="h-5 w-5" />
                Request FLIMS Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
