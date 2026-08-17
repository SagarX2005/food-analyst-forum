import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accept Invitation — Food Analyst Forum",
  description: "Accept your invitation and create your Food Analyst Forum account.",
  robots: { index: false, follow: false }, // Do not index — token in URL
};

export default function AcceptInviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
