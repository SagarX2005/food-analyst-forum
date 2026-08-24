"use client";

import * as React from "react";
import Link from "next/link";
import { User, BookOpen, Sparkles, PlusCircle, Clock, Briefcase } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { useAuth } from "@hooks/use-auth";
import {
  ProfileService,
  type ProfileCompletionResult,
  type FullProfile,
} from "@services/profileService";
import { ProfileCompletion } from "@components/profile/profile-completion";

import { RecruiterVerificationService, type RecruiterApplicationRow } from "@services/recruiterVerificationService";

export default function DashboardPage() {
  const { user, profile, role, organization } = useAuth();
  const [completion, setCompletion] = React.useState<ProfileCompletionResult>({
    percentage: 0,
    completedSteps: [],
    missingSteps: [],
  });
  const [recruiterApp, setRecruiterApp] = React.useState<RecruiterApplicationRow | null>(null);

  React.useEffect(() => {
    if (user && role !== "Recruiter" && role !== "Super Admin") {
      RecruiterVerificationService.getUserActiveApplication(user.id)
        .then((app) => setRecruiterApp(app))
        .catch(console.error);
    }
  }, [user, role]);

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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a2a4a] via-[#113a63] to-[#4a9d23] p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="green" className="text-xs font-bold uppercase">
                {role} Dashboard
              </Badge>
              {organization && (
                <span className="text-xs font-semibold text-gray-300">• {organization.name}</span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
              Welcome back, {fullName}!
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-gray-200">
              Your professional hub for laboratory SOPs, FSSAI regulatory compliance, training
              certifications, and scientific collaboration.
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

      {/* RECRUITER VERIFICATION BANNER */}
      {role === "User" && (
        <Card className={`border ${recruiterApp?.status === 'rejected' ? 'border-rose-200 bg-rose-50' : recruiterApp?.status === 'more_information_required' ? 'border-amber-200 bg-amber-50' : recruiterApp?.status === 'pending' ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200'}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Briefcase className={`h-5 w-5 ${recruiterApp?.status === 'rejected' ? 'text-rose-600' : recruiterApp?.status === 'more_information_required' ? 'text-amber-600' : recruiterApp?.status === 'pending' ? 'text-indigo-600' : 'text-slate-700'}`} />
                <h3 className="font-bold text-lg text-slate-900">
                  {!recruiterApp ? "Become a Recruiter" : 
                   recruiterApp.status === "pending" ? "Recruiter Application Under Review" :
                   recruiterApp.status === "rejected" ? "Application Rejected" :
                   recruiterApp.status === "more_information_required" ? "More Information Requested" : 
                   "Become a Recruiter"}
                </h3>
              </div>
              <p className="text-sm text-slate-600">
                {!recruiterApp && "Recruiter status is verified by Food Analyst Forum and requires Super Admin approval. Post jobs and find top talent."}
                {recruiterApp?.status === "pending" && "Your application is currently being reviewed by a Super Admin. We will notify you once a decision is made."}
                {recruiterApp?.status === "rejected" && "Your previous application was rejected. You may apply again if circumstances have changed."}
                {recruiterApp?.status === "more_information_required" && "The Super Admin has requested additional information before approving your application."}
              </p>
            </div>
            <div>
              {(!recruiterApp || recruiterApp.status === "rejected" || recruiterApp.status === "more_information_required") && (
                <Link href="/apply-recruiter">
                  <Button className="whitespace-nowrap">
                    {!recruiterApp ? "Apply Now" : recruiterApp.status === "rejected" ? "Reapply" : "Provide Information"}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* 2-COLUMN LAYOUT: QUICK STATS & PROFILE COMPLETION */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* LEFT COLUMN: STATS & QUICK ACTIONS */}
        <div className="space-y-8 lg:col-span-8">
          {/* STATS COUNTER GRID */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card className="p-4 text-center transition-all hover:border-[#4a9d23]">
              <p className="text-2xl font-extrabold text-[#4a9d23]">0</p>
              <p className="text-muted-foreground mt-1 text-xs font-semibold">Forum Topics</p>
            </Card>
            <Card className="dark:hover:border-primary p-4 text-center transition-all hover:border-[#0a2a4a]">
              <p className="dark:text-foreground text-2xl font-extrabold text-[#0a2a4a]">0</p>
              <p className="text-muted-foreground mt-1 text-xs font-semibold">SOP Downloads</p>
            </Card>
            <Card className="p-4 text-center transition-all hover:border-[#4a9d23]">
              <p className="text-2xl font-extrabold text-[#4a9d23]">0</p>
              <p className="text-muted-foreground mt-1 text-xs font-semibold">Courses Joined</p>
            </Card>
            <Card className="dark:hover:border-primary p-4 text-center transition-all hover:border-[#0a2a4a]">
              <p className="dark:text-foreground text-2xl font-extrabold text-[#0a2a4a]">0</p>
              <p className="text-muted-foreground mt-1 text-xs font-semibold">Jobs Bookmarked</p>
            </Card>
          </div>

          {/* QUICK ACTIONS */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="dark:text-foreground flex items-center gap-2 text-lg text-[#0a2a4a]">
                <Sparkles className="h-5 w-5 text-[#4a9d23]" /> Quick Action Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link href="/forum">
                <Button
                  variant="outline"
                  size="default"
                  className="h-12 w-full justify-start gap-2"
                >
                  <PlusCircle className="h-4 w-4 text-[#4a9d23]" /> Ask Forum Question
                </Button>
              </Link>
              <Link href="/resources">
                <Button
                  variant="outline"
                  size="default"
                  className="h-12 w-full justify-start gap-2"
                >
                  <BookOpen className="dark:text-primary h-4 w-4 text-[#0a2a4a]" /> Browse SOP
                  Library
                </Button>
              </Link>
              <Link href="/jobs">
                <Button
                  variant="outline"
                  size="default"
                  className="h-12 w-full justify-start gap-2"
                >
                  <Briefcase className="h-4 w-4 text-[#4a9d23]" /> Browse Open Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* RECENT ACTIVITY TIMELINE */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="dark:text-foreground flex items-center gap-2 text-lg text-[#0a2a4a]">
                <Clock className="h-5 w-5 text-[#4a9d23]" /> Recent Member Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="py-6 text-center">
                <p className="text-muted-foreground text-xs">No recent activity to show.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: PROFILE COMPLETION & BOOKMARKS */}
        <div className="space-y-8 lg:col-span-4">
          <ProfileCompletion completion={completion} />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="dark:text-foreground text-base text-[#0a2a4a]">
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
