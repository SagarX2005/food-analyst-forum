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
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8 shadow-sm sm:p-12 lg:p-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <Badge
              variant="green"
              className="gap-1.5 px-3 py-1 text-xs font-bold tracking-wider uppercase"
            >
              <Sparkles className="h-3.5 w-3.5" /> India’s Premier Laboratory Network
            </Badge>

            <h1 className="text-3xl leading-[1.25] font-extrabold tracking-tight text-[#0a2a4a] sm:text-4xl lg:text-5xl">
              Where Food Analysis Professionals{" "}
              <span className="text-[#4a9d23]">Connect, Learn & Grow.</span>
            </h1>

            <p className="text-muted-foreground max-w-2xl text-base leading-relaxed sm:text-lg">
              FAF brings together food analysts, laboratory professionals, researchers, quality
              teams, organizations, and industry experts through trusted knowledge, professional
              opportunities, and specialized learning.
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
            <div className="border-border/60 text-muted-foreground grid grid-cols-3 gap-4 border-t pt-6 text-xs font-semibold">
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

          <div className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border-4 border-white shadow-2xl lg:max-w-none dark:border-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-lab.jpg"
                alt="Food Analyst Laboratory Professional"
                className="h-[380px] w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#0a2a4a]/80 via-transparent to-transparent p-6">
                <div className="space-y-1 text-white">
                  <p className="text-xs font-bold tracking-wider text-[#4a9d23] uppercase">
                    ISO 17025 Compliant
                  </p>
                  <p className="text-sm font-semibold">
                    Standardized Chemical & Microbiological Protocols
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section id="explore" className="scroll-mt-24 space-y-8">
        <div className="mx-auto max-w-3xl space-y-2 text-center">
          <h2 className="text-2xl font-extrabold text-[#0a2a4a] sm:text-3xl">What FAF Offers</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            An exclusive professional ecosystem designed specifically for food safety analysts, lab
            managers, and quality assurance personnel.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="group transition-all hover:border-[#4a9d23]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4a9d23]/10 text-[#4a9d23] transition-transform group-hover:scale-110">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-[#4a9d23]">DISCUSSION FORUM</h3>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              Connect with leading experts, troubleshoot complex matrix interferences, and solve
              laboratory analytical challenges.
            </p>
            <Link
              href="/forum"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline"
            >
              Join Discussions <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>

          <Card className="group transition-all hover:border-[#0a2a4a]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0a2a4a]/10 text-[#0a2a4a] transition-transform group-hover:scale-110">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-[#0a2a4a]">SOP LIBRARY</h3>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              Access standardized operating procedures, analytical testing methodologies, and
              validated uncertainty templates.
            </p>
            <Link
              href="/resources"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0a2a4a] hover:underline"
            >
              Browse SOPs <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>

          <Card className="group transition-all hover:border-[#4a9d23]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4a9d23]/10 text-[#4a9d23] transition-transform group-hover:scale-110">
              <FileCheck className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-[#4a9d23]">REGULATORY UPDATES</h3>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              Stay immediately updated with FSSAI notifications, MRL revisions, NABL 17025
              checklists, and global regulations.
            </p>
            <Link
              href="/news"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline"
            >
              Read Latest News <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
        </div>
      </section>

      {/* QUICK STATS & FLIMS BANNER */}
      <section className="rounded-3xl bg-[#0a2a4a] p-8 text-white shadow-xl sm:p-12">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <Badge variant="green" className="text-xs">
              FLIMS Platform
            </Badge>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              Food Analyst Laboratory Information System (FLIMS)
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
              Track samples from sample receiving to final test report dispatch. Auto-generate NABL
              & FSSAI compliant reports with full instrument calibration and logbook management.
            </p>
          </div>
          <div className="flex justify-start lg:col-span-4 lg:justify-end">
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
