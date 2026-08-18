import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request an Invitation — Food Analyst Forum",
  description:
    "Apply to join FAF — the invitation-only professional community for food analysts, laboratory scientists, quality professionals, and industry experts across India.",
  openGraph: {
    title: "Request an Invitation — Food Analyst Forum",
    description:
      "Apply to join FAF — the invitation-only professional community for food analysts, laboratory scientists, and industry experts.",
    type: "website",
  },
  alternates: {
    canonical: "/request-invite",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RequestInviteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
