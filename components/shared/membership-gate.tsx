"use client";

import React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@components/ui/button";

interface MembershipGateProps {
  title?: string;
  description?: string;
}

export function MembershipGate({
  title = "Continue the conversation",
  description = "This content is available to verified FAF members.",
}: MembershipGateProps) {
  return (
    <div className="rounded-xl border border-[#0a2a4a]/10 bg-slate-50/50 p-8 sm:p-12 text-center shadow-sm relative overflow-hidden transition-all duration-300 hover:border-[#0a2a4a]/20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center max-w-sm mx-auto space-y-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0a2a4a]/5 text-[#0a2a4a] mb-2">
          <Lock className="h-5 w-5" />
        </div>
        
        <div className="space-y-2">
          <p className="text-[11px] font-extrabold tracking-widest text-[#4a9d23] uppercase">Member Access</p>
          <h3 className="text-2xl font-bold text-[#0a2a4a] tracking-tight">{title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="pt-5 space-y-4 w-full">
          <Link href="/request-invite" className="block w-full">
            <Button variant="navy" size="lg" className="w-full shadow-md hover:shadow-lg transition-all font-semibold">
              Request an Invitation
            </Button>
          </Link>
          <p className="text-[13px] text-slate-500">
            Already a member?{" "}
            <Link href="/login" className="font-bold text-[#0a2a4a] hover:text-[#4a9d23] hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
