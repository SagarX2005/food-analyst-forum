// app/request-invite/page.tsx
// Phase 10A — Public invitation request page

import Link from "next/link";
import { FlaskConical, CheckCircle2 } from "lucide-react";
import { InvitationRequestForm } from "@components/invitations/invitation-request-form";

export default function RequestInvitePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row -mt-16">
      {/* LEFT: Story */}
      <div className="w-full md:w-5/12 bg-[#0a2a4a] text-white p-8 md:p-16 flex flex-col justify-between">
        <div className="pt-16 md:pt-0">
          <Link href="/" className="inline-flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-[#4a9d23]">
              <FlaskConical className="h-5 w-5" />
            </div>
            <span className="font-extrabold tracking-tight">FOOD ANALYST FORUM</span>
          </Link>
          
          <div className="mt-16 md:mt-24 space-y-10 max-w-md">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#4a9d23]">Invitation Only</p>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
                A professional network built for the people shaping food analysis.
              </h1>
            </div>
            
            <div className="space-y-5">
              {[
                { title: "Community", desc: "Connect with 5000+ certified analysts" },
                { title: "Knowledge", desc: "Access validated SOPs & templates" },
                { title: "Career", desc: "Exclusive opportunities from top labs" },
                { title: "Learning", desc: "Expert-led compliance training" }
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#4a9d23] mt-0.5" />
                  <div>
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="text-sm text-slate-300">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-20 text-sm text-slate-400 space-y-2">
          <p>
            Already have an invitation? <Link href="/accept-invite" className="text-white font-bold hover:text-[#4a9d23] transition-colors">Accept here</Link>
          </p>
          <p>
            Already a member? <Link href="/login" className="text-white font-bold hover:text-[#4a9d23] transition-colors">Sign in</Link>
          </p>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="w-full md:w-7/12 p-8 md:p-16 lg:p-24 overflow-y-auto bg-white pt-24 md:pt-16">
        <div className="max-w-xl mx-auto">
          <InvitationRequestForm />
        </div>
      </div>
    </div>
  );
}
