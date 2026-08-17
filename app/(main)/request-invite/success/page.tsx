import Link from "next/link";
import { CheckCircle2, Clock, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@components/ui/button";

export default function RequestSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 -mt-16">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-[#4a9d23] p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 mb-4 shadow-inner">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Application Received</h1>
          <p className="text-white/90 text-sm mt-2 font-medium">
            Thank you for applying to the Food Analyst Forum.
          </p>
        </div>

        <div className="p-8 space-y-8">
          <p className="text-sm text-slate-600 leading-relaxed text-center">
            FAF is a curated professional network. Your application has been queued for manual review to ensure community quality.
          </p>

          <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-2">
            <div className="relative">
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-[3px] border-[#4a9d23] bg-white shadow-sm" />
              <div className="pl-6">
                <p className="text-sm font-bold text-[#0a2a4a]">Step 1: Application Submitted</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">We have successfully received your request and professional details.</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[11px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-slate-200 text-slate-400">
                <Clock className="h-3 w-3" />
              </div>
              <div className="pl-6">
                <p className="text-sm font-bold text-slate-700">Step 2: Under Review</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Our curation team is reviewing your background and credentials.</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[11px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-slate-200 text-slate-400">
                <Mail className="h-3 w-3" />
              </div>
              <div className="pl-6">
                <p className="text-sm font-bold text-slate-700">Step 3: Invitation Sent</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">If approved, you&apos;ll receive an exclusive invitation link via email.</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[11px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-slate-200 text-slate-400">
                <ShieldCheck className="h-3 w-3" />
              </div>
              <div className="pl-6">
                <p className="text-sm font-bold text-slate-700">Step 4: Account Activation</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Accept the invite to activate your account and join the community.</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/">
              <Button variant="outline" className="w-full font-bold h-11 border-slate-200 hover:bg-slate-50">
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
