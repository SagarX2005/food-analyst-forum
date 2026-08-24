// app/admin/recruiter-verification/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecruiterVerificationService } from "@services/recruiterVerificationService";
import { RecruiterApplicationDetails } from "./_components/recruiter-application-details";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const app = await RecruiterVerificationService.getApplicationById(id);
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
    const application = await RecruiterVerificationService.getApplicationById(id);
    
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
