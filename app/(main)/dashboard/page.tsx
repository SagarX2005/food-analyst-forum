"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  BookOpen,
  Sparkles,
  PlusCircle,
  Clock,
  Briefcase,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { useAuth } from "@hooks/use-auth";
import { ProfileService, type ProfileCompletionResult, type FullProfile } from "@services/profileService";
import { ProfileCompletion } from "@components/profile/profile-completion";

export default function DashboardPage() {
  const { user, profile, role, organization } = useAuth();
  const [completion, setCompletion] = React.useState<ProfileCompletionResult>({
    percentage: 0,
    completedSteps: [],
    missingSteps: [],
  });

  React.useEffect(() => {
    if (profile) {
      const res = ProfileService.calculateProfileCompletion(profile as unknown as FullProfile);
      setCompletion(res);
    }
  }, [profile]);

  const fullName = profile?.full_name || user?.email?.split("@")[0] || "Analyst";

  return (
    <div className="space-y-8 py-4">
      {/* WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a2a4a] via-[#113a63] to-[#4a9d23] text-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="green" className="text-xs uppercase font-bold">
                {role} Dashboard
              </Badge>
              {organization && (
                <span className="text-xs text-gray-300 font-semibold">• {organization.name}</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {fullName}!
            </h1>
            <p className="text-sm text-gray-200 max-w-xl leading-relaxed">
              Your professional hub for laboratory SOPs, FSSAI regulatory compliance, training certifications, and scientific collaboration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/profile/edit">
              <Button variant="green" size="default" className="gap-2 shadow-md">
                <User className="h-4 w-4" /> Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: QUICK STATS & PROFILE COMPLETION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: STATS & QUICK ACTIONS */}
        <div className="lg:col-span-8 space-y-8">
          {/* STATS COUNTER GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4 text-center hover:border-[#4a9d23] transition-all">
              <p className="text-2xl font-extrabold text-[#4a9d23]">0</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">Forum Topics</p>
            </Card>
            <Card className="p-4 text-center hover:border-[#0a2a4a] dark:hover:border-primary transition-all">
              <p className="text-2xl font-extrabold text-[#0a2a4a] dark:text-foreground">0</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">SOP Downloads</p>
            </Card>
            <Card className="p-4 text-center hover:border-[#4a9d23] transition-all">
              <p className="text-2xl font-extrabold text-[#4a9d23]">0</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">Courses Joined</p>
            </Card>
            <Card className="p-4 text-center hover:border-[#0a2a4a] dark:hover:border-primary transition-all">
              <p className="text-2xl font-extrabold text-[#0a2a4a] dark:text-foreground">0</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">Jobs Bookmarked</p>
            </Card>
          </div>

          {/* QUICK ACTIONS */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#4a9d23]" /> Quick Action Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/forum">
                <Button variant="outline" size="default" className="w-full justify-start gap-2 h-12">
                  <PlusCircle className="h-4 w-4 text-[#4a9d23]" /> Ask Forum Question
                </Button>
              </Link>
              <Link href="/resources">
                <Button variant="outline" size="default" className="w-full justify-start gap-2 h-12">
                  <BookOpen className="h-4 w-4 text-[#0a2a4a] dark:text-primary" /> Browse SOP Library
                </Button>
              </Link>
              <Link href="/jobs">
                <Button variant="outline" size="default" className="w-full justify-start gap-2 h-12">
                  <Briefcase className="h-4 w-4 text-[#4a9d23]" /> Browse Open Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* RECENT ACTIVITY TIMELINE */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#4a9d23]" /> Recent Member Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="py-6 text-center">
                <p className="text-xs text-muted-foreground">No recent activity to show.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: PROFILE COMPLETION & BOOKMARKS */}
        <div className="lg:col-span-4 space-y-8">
          <ProfileCompletion completion={completion} />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-[#0a2a4a] dark:text-foreground">
                Saved Resources & Bookmarks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="py-4 text-center">
                <p className="text-muted-foreground">You have no saved resources.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
