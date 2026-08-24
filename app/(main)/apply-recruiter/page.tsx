import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@lib/supabase/server";
import { RecruiterVerificationService } from "@services/recruiterVerificationService";
import { RecruiterApplicationForm } from "./_components/recruiter-application-form";
import { Card, CardContent } from "@components/ui/card";
import { Briefcase, AlertCircle, CheckCircle, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Apply as Recruiter — Food Analyst Forum",
  description: "Apply for a recruiter account to post jobs and hire food analysts.",
};

export default async function ApplyRecruiterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get user profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role_id, roles(name)")
    .eq("id", user.id)
    .single();

  const roleName = profile?.roles?.name;

  if (roleName === "Recruiter" || roleName === "Super Admin") {
    return (
      <div className="mx-auto max-w-3xl py-12 px-4 sm:px-6">
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-emerald-500" />
            <h1 className="text-2xl font-bold text-slate-900">You are already an approved Recruiter</h1>
            <p className="text-slate-600">Your account already has Recruiter privileges.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeApp = await RecruiterVerificationService.getUserActiveApplication(user.id, supabase);

  if (activeApp?.status === "pending") {
    return (
      <div className="mx-auto max-w-3xl py-12 px-4 sm:px-6">
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
            <Info className="h-16 w-16 text-indigo-500" />
            <h1 className="text-2xl font-bold text-slate-900">Application Under Review</h1>
            <p className="text-slate-600 max-w-md mx-auto">
              Your application is currently being reviewed by our team. We will notify you once a decision has been made.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl py-10 px-4 sm:px-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-slate-900">
          <Briefcase className="h-8 w-8 text-indigo-600" />
          Apply as Recruiter
        </h1>
        <p className="text-slate-600">
          Provide your professional and organizational details to apply for Recruiter privileges.
        </p>
      </div>

      {activeApp?.status === "rejected" && (
        <Card className="border-rose-200 bg-rose-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-rose-900">Previous Application Rejected</h3>
              <p className="text-sm text-rose-700 mt-1">{activeApp.rejection_reason}</p>
              <p className="text-sm text-rose-600 mt-2 font-medium">You may submit a new application below.</p>
            </div>
          </div>
        </Card>
      )}

      {activeApp?.status === "more_information_required" && (
        <Card className="border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900">More Information Required</h3>
              <p className="text-sm text-amber-800 mt-1">{activeApp.more_info_request}</p>
              <p className="text-sm text-amber-700 mt-2">
                Please provide the requested information to resubmit your application.
              </p>
            </div>
          </div>
        </Card>
      )}

      <RecruiterApplicationForm userId={user.id} activeApp={activeApp} />
    </div>
  );
}
