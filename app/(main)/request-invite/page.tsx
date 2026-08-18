// app/request-invite/page.tsx
// Phase 10A — Public invitation request page

import Link from "next/link";
import { FlaskConical, CheckCircle2 } from "lucide-react";
import { InvitationRequestForm } from "@components/invitations/invitation-request-form";

export default function RequestInvitePage() {
  return (
    <div className="-mt-16 flex min-h-screen flex-col bg-slate-50 md:flex-row">
      {/* LEFT: Story */}
      <div className="flex w-full flex-col justify-between bg-[#0a2a4a] p-8 text-white md:w-5/12 md:p-16">
        <div className="pt-16 md:pt-0">
          <Link
            href="/"
            className="inline-flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-[#4a9d23]">
              <FlaskConical className="h-5 w-5" />
            </div>
            <span className="font-extrabold tracking-tight">FOOD ANALYST FORUM</span>
          </Link>

          <div className="mt-16 max-w-md space-y-10 md:mt-24">
            <div className="space-y-4">
              <p className="text-xs font-bold tracking-widest text-[#4a9d23] uppercase">
                Invitation Only
              </p>
              <h1 className="text-3xl leading-tight font-extrabold tracking-tight md:text-5xl">
                A professional network built for the people shaping food analysis.
              </h1>
            </div>

            <div className="space-y-5">
              {[
                { title: "Community", desc: "Connect with 5000+ certified analysts" },
                { title: "Knowledge", desc: "Access validated SOPs & templates" },
                { title: "Career", desc: "Exclusive opportunities from top labs" },
                { title: "Learning", desc: "Expert-led compliance training" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#4a9d23]" />
                  <div>
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="text-sm text-slate-300">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-2 text-sm text-slate-400 md:mt-20">
          <p>
            Already have an invitation?{" "}
            <Link
              href="/accept-invite"
              className="font-bold text-white transition-colors hover:text-[#4a9d23]"
            >
              Accept here
            </Link>
          </p>
          <p>
            Already a member?{" "}
            <Link
              href="/login"
              className="font-bold text-white transition-colors hover:text-[#4a9d23]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="w-full overflow-y-auto bg-white p-8 pt-24 md:w-7/12 md:p-16 md:pt-16 lg:p-24">
        <div className="mx-auto max-w-xl">
          <InvitationRequestForm />
        </div>
      </div>
    </div>
  );
}
