"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { submitRecruiterApplicationAction, resubmitRecruiterApplicationAction } from "../actions";
import { RecruiterApplicationRow } from "@services/recruiterVerificationService";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";

interface RecruiterApplicationFormProps {
  userId: string;
  activeApp: RecruiterApplicationRow | null;
}

const ORG_TYPES = [
  "Testing Laboratory",
  "Research Institution",
  "Food Manufacturing",
  "Regulatory Body",
  "Academic Institution",
  "Consultancy",
  "Other"
];

export function RecruiterApplicationForm({ userId, activeApp }: RecruiterApplicationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const isMoreInfo = activeApp?.status === "more_information_required";

  // Form states
  const [fullName, setFullName] = React.useState("");
  const [headline, setHeadline] = React.useState("");
  const [orgName, setOrgName] = React.useState(activeApp?.organization_name || "");
  const [orgWebsite, setOrgWebsite] = React.useState(activeApp?.organization_website || "");
  const [orgType, setOrgType] = React.useState(activeApp?.organization_type || "Testing Laboratory");
  const [location, setLocation] = React.useState(activeApp?.location || "");
  const [position, setPosition] = React.useState(activeApp?.position || "");
  const [workEmail, setWorkEmail] = React.useState("");
  const [linkedin, setLinkedin] = React.useState("");
  const [background, setBackground] = React.useState("");
  const [evidence, setEvidence] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isMoreInfo && activeApp) {
        // Resubmit flow
        const result = await resubmitRecruiterApplicationAction(activeApp.id, evidence);
        if (result.success) {
          router.refresh();
        } else {
          setError(result.error || "Failed to resubmit");
        }
      } else {
        // New application flow
        const formattedEvidence = `
Name: ${fullName}
Headline: ${headline}
Work Email: ${workEmail}
LinkedIn: ${linkedin}

Professional Background:
${background}

Verification Evidence:
${evidence}
        `.trim();

        const result = await submitRecruiterApplicationAction({
          user_id: userId,
          organization_name: orgName,
          organization_website: orgWebsite,
          organization_type: orgType,
          location,
          position,
          evidence: formattedEvidence,
        });

        if (result.success) {
          router.refresh();
        } else {
          setError(result.error || "Failed to submit");
        }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {error && (
          <div className="mb-6 rounded-md bg-rose-50 p-4 text-sm text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isMoreInfo && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <Input required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Professional Headline</label>
                    <Input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Senior Food Scientist" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
                    <Input type="email" value={workEmail} onChange={e => setWorkEmail(e.target.value)} placeholder="jane@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
                    <Input type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Organization Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                    <Input required value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Acme Labs" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Organization Website</label>
                    <Input type="url" value={orgWebsite} onChange={e => setOrgWebsite(e.target.value)} placeholder="https://acmelabs.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Organization Type</label>
                    <select
                      className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                      value={orgType}
                      onChange={e => setOrgType(e.target.value)}
                    >
                      {ORG_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Position / Job Title</label>
                    <Input required value={position} onChange={e => setPosition(e.target.value)} placeholder="Head of Quality Control" />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">
              {isMoreInfo ? "Additional Information" : "Verification & Background"}
            </h3>
            
            {!isMoreInfo && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Professional Background</label>
                <Textarea 
                  value={background} 
                  onChange={e => setBackground(e.target.value)} 
                  placeholder="Briefly describe your background and why you need a recruiter account..."
                  className="min-h-[100px]"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {isMoreInfo ? "Provide requested evidence" : "Verification Evidence"}
              </label>
              <Textarea 
                required
                value={evidence} 
                onChange={e => setEvidence(e.target.value)} 
                placeholder={isMoreInfo ? "Provide the information requested by the Super Admin..." : "Provide links to company directory, employment verification, or other proof of affiliation..."}
                className="min-h-[120px]"
              />
              {!isMoreInfo && (
                <p className="text-xs text-slate-500 mt-2">
                  This information will be reviewed securely by Super Admins.
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
              {isSubmitting ? "Submitting..." : isMoreInfo ? "Resubmit Application" : "Submit Application"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
