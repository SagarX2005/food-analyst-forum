import Link from "next/link";
import { FlaskConical, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-border mt-20 border-t bg-[#0a2a4a] text-white transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Summary */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                <FlaskConical className="h-6 w-6 text-[#4a9d23]" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-white">
                  FOOD <span className="text-[#4a9d23]">ANALYST</span> FORUM
                </span>
                <span className="text-[9px] font-semibold tracking-wider text-gray-300">
                  KNOWLEDGE • INTEGRITY • SAFETY
                </span>
              </div>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-gray-300">
              India’s premier platform for food analysts, laboratory scientists, quality assurance
              managers, and regulatory professionals empowering excellence in food testing.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4a9d23]">
              <ShieldCheck className="h-4 w-4" />
              Empowering 5000+ Analysts & 1000+ Accredited Laboratories
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/" className="transition-colors hover:text-[#4a9d23]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-[#4a9d23]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/forum" className="transition-colors hover:text-[#4a9d23]">
                  Discussion Forum
                </Link>
              </li>
              <li>
                <Link href="/flims" className="transition-colors hover:text-[#4a9d23]">
                  FLIMS Platform
                </Link>
              </li>
              <li>
                <Link href="/resources" className="transition-colors hover:text-[#4a9d23]">
                  SOP Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Opportunities */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">Opportunities</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/training" className="transition-colors hover:text-[#4a9d23]">
                  FSSAI Training
                </Link>
              </li>
              <li>
                <Link href="/training" className="transition-colors hover:text-[#4a9d23]">
                  NABL 17025 Workshops
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="transition-colors hover:text-[#4a9d23]">
                  Job Opportunities
                </Link>
              </li>
              <li>
                <Link href="/news" className="transition-colors hover:text-[#4a9d23]">
                  FSSAI Regulatory News
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-[#4a9d23]">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">Contact Us</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#4a9d23]" />
                <span>support@foodanalystforum.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#4a9d23]" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#4a9d23]" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-gray-400 sm:flex-row">
          <p>© 2026 Food Analyst Forum. Knowledge • Integrity • Safety. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/about" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
