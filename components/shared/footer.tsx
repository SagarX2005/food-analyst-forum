import Link from "next/link";
import { FlaskConical, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#0a2a4a] text-white mt-20 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Summary */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                <FlaskConical className="h-6 w-6 text-[#4a9d23]" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-white">
                  FOOD <span className="text-[#4a9d23]">ANALYST</span> FORUM
                </span>
                <span className="text-[9px] font-semibold text-gray-300 tracking-wider">
                  KNOWLEDGE • INTEGRITY • SAFETY
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-300 max-w-md leading-relaxed">
              India’s premier platform for food analysts, laboratory scientists, quality assurance managers, and regulatory professionals empowering excellence in food testing.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#4a9d23] font-semibold">
              <ShieldCheck className="h-4 w-4" />
              Empowering 5000+ Analysts & 1000+ Accredited Laboratories
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-[#4a9d23] transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-[#4a9d23] transition-colors">About Us</Link></li>
              <li><Link href="/forum" className="hover:text-[#4a9d23] transition-colors">Discussion Forum</Link></li>
              <li><Link href="/flims" className="hover:text-[#4a9d23] transition-colors">FLIMS Platform</Link></li>
              <li><Link href="/resources" className="hover:text-[#4a9d23] transition-colors">SOP Library</Link></li>
            </ul>
          </div>

          {/* Opportunities */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">Opportunities</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/training" className="hover:text-[#4a9d23] transition-colors">FSSAI Training</Link></li>
              <li><Link href="/training" className="hover:text-[#4a9d23] transition-colors">NABL 17025 Workshops</Link></li>
              <li><Link href="/jobs" className="hover:text-[#4a9d23] transition-colors">Job Opportunities</Link></li>
              <li><Link href="/news" className="hover:text-[#4a9d23] transition-colors">FSSAI Regulatory News</Link></li>
              <li><Link href="/contact" className="hover:text-[#4a9d23] transition-colors">Contact Support</Link></li>
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
                <MapPin className="h-4 w-4 text-[#4a9d23] mt-0.5 shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Food Analyst Forum. Knowledge • Integrity • Safety. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Help Center</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
