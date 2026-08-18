import Link from "next/link";
import { CheckCircle2, Clock, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@components/ui/button";

export default function RequestSuccessPage() {
  return (
    <div className="-mt-16 flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-[#4a9d23] p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 shadow-inner">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Application Received
          </h1>
          <p className="mt-2 text-sm font-medium text-white/90">
            Thank you for applying to the Food Analyst Forum.
          </p>
        </div>

        <div className="space-y-8 p-8">
          <p className="text-center text-sm leading-relaxed text-slate-600">
            FAF is a curated professional network. Your application has been queued for manual
            review to ensure community quality.
          </p>

          <div className="relative ml-3 space-y-8 border-l-2 border-slate-100 pb-2">
            <div className="relative">
              <div className="absolute top-1 -left-[9px] h-4 w-4 rounded-full border-[3px] border-[#4a9d23] bg-white shadow-sm" />
              <div className="pl-6">
                <p className="text-sm font-bold text-[#0a2a4a]">Step 1: Application Submitted</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  We have successfully received your request and professional details.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0.5 -left-[11px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-400">
                <Clock className="h-3 w-3" />
              </div>
              <div className="pl-6">
                <p className="text-sm font-bold text-slate-700">Step 2: Under Review</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Our curation team is reviewing your background and credentials.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0.5 -left-[11px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-400">
                <Mail className="h-3 w-3" />
              </div>
              <div className="pl-6">
                <p className="text-sm font-bold text-slate-700">Step 3: Invitation Sent</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  If approved, you&apos;ll receive an exclusive invitation link via email.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0.5 -left-[11px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-400">
                <ShieldCheck className="h-3 w-3" />
              </div>
              <div className="pl-6">
                <p className="text-sm font-bold text-slate-700">Step 4: Account Activation</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Accept the invite to activate your account and join the community.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/">
              <Button
                variant="outline"
                className="h-11 w-full border-slate-200 font-bold hover:bg-slate-50"
              >
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
