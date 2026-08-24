// app/admin/recruiter-verification/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecruiterVerificationService } from "@services/recruiterVerificationService";
import { RecruiterApplicationDetails } from "./_components/recruiter-application-details";
import { createClient } from "@lib/supabase/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const app = await RecruiterVerificationService.getApplicationById(id, supabase);
    return {
      title: `Review: ${app.user?.full_name || "Applicant"} — Admin`,
    };
  } catch {
    return {
      title: "Recruiter Application Detail — Admin",
    };
  }
}

export const dynamic = "force-dynamic";

export default async function RecruiterVerificationDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  try {
    const supabase = await createClient();
    const application = await RecruiterVerificationService.getApplicationById(id, supabase);
    
    if (!application) {
      notFound();
    }

    return (
      <div className="py-4">
        <RecruiterApplicationDetails application={application} />
      </div>
    );
  } catch {
    notFound();
  }
}
