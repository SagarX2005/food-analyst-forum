"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@lib/zod-resolver";
import { CheckCircle, Send, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { accessRequestSchema, type AccessRequestInput } from "@features/invitations/schemas";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Select } from "@components/ui/select";
import { useRouter } from "next/navigation";

const PROFESSION_OPTIONS = [
  { value: "", label: "Select your profession / area..." },
  { value: "Food Analyst / Analytical Chemist", label: "Food Analyst / Analytical Chemist" },
  { value: "Microbiologist", label: "Microbiologist" },
  { value: "Quality Assurance Professional", label: "Quality Assurance Professional" },
  { value: "Food Safety Officer", label: "Food Safety Officer" },
  { value: "NABL / Accreditation Auditor", label: "NABL / Accreditation Auditor" },
  { value: "Regulatory Affairs Specialist", label: "Regulatory Affairs Specialist" },
  { value: "Research Scientist", label: "Research Scientist" },
  { value: "Lab Manager / Supervisor", label: "Lab Manager / Supervisor" },
  { value: "Academia / Researcher", label: "Academia / Researcher" },
  { value: "Industry Professional", label: "Industry Professional" },
  { value: "Other", label: "Other" },
];

const EXPERIENCE_OPTIONS = [
  { value: "", label: "Select years of experience..." },
  { value: "0", label: "Less than 1 year" },
  { value: "1", label: "1–2 years" },
  { value: "3", label: "3–5 years" },
  { value: "6", label: "6–10 years" },
  { value: "11", label: "11–15 years" },
  { value: "16", label: "16–20 years" },
  { value: "21", label: "21+ years" },
];

interface FieldLabelProps {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}

function FieldLabel({ htmlFor, children, required = true }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-bold text-slate-700">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-500">{message}</p>;
}

export function InvitationRequestForm() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<AccessRequestInput>({
    resolver: zodResolver(accessRequestSchema),
    mode: "onTouched",
    defaultValues: {
      full_name: "",
      email: "",
      professional_title: "",
      organization: "",
      profession: "",
      experience_years: undefined,
      region: "",
      reason: "",
      linkedin_url: "",
      website_url: "",
    },
  });

  const nextStep = async () => {
    // Validate Step 1 fields before proceeding
    const isStep1Valid = await trigger([
      "full_name",
      "email",
      "professional_title",
      "organization",
      "profession",
      "experience_years",
      "region",
      "linkedin_url",
      "website_url",
    ]);

    if (isStep1Valid) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: AccessRequestInput) => {
    try {
      setServerError(null);
      const res = await fetch("/api/invitations/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = (await res.json()) as { success?: boolean; message?: string; code?: string };

      if (!res.ok || !json.success) {
        setServerError(
          json.message ??
            (json.code === "DUPLICATE_REQUEST"
              ? "An invitation request already exists for this email."
              : "Submission failed. Please try again."),
        );
        return;
      }

      router.push("/request-invite/success");
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {/* Header */}
      <div className="space-y-2 border-b border-slate-100 pb-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-extrabold tracking-widest text-[#4a9d23] uppercase">
            Step {step} of 2
          </p>
          <div className="flex gap-1.5">
            <div
              className={`h-1.5 w-6 rounded-full transition-colors ${step >= 1 ? "bg-[#4a9d23]" : "bg-slate-200"}`}
            />
            <div
              className={`h-1.5 w-6 rounded-full transition-colors ${step >= 2 ? "bg-[#4a9d23]" : "bg-slate-200"}`}
            />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-[#0a2a4a]">
          {step === 1 ? "Tell us about yourself" : "Why join FAF?"}
        </h2>
        <p className="text-sm font-medium text-slate-500">
          {step === 1
            ? "Professional details help us curate the community."
            : "We review every application manually to ensure a high-quality environment."}
        </p>
      </div>

      {serverError && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
          <div className="mt-0.5">
            <CheckCircle className="h-4 w-4 text-red-500" />
          </div>
          {serverError}
        </div>
      )}

      {/* Step 1 Fields */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="full_name">Full Name</FieldLabel>
              <Input
                id="full_name"
                {...register("full_name")}
                placeholder="Dr. Priya Sharma"
                autoComplete="name"
                className="h-11 border-slate-200 bg-slate-50 focus:bg-white"
                aria-invalid={!!errors.full_name}
              />
              <FieldError message={errors.full_name?.message} />
            </div>
            <div>
              <FieldLabel htmlFor="email">Work Email Address</FieldLabel>
              <Input
                id="email"
                {...register("email")}
                type="email"
                placeholder="analyst@foodlab.com"
                autoComplete="email"
                className="h-11 border-slate-200 bg-slate-50 focus:bg-white"
                aria-invalid={!!errors.email}
              />
              <FieldError message={errors.email?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="professional_title">Professional Title</FieldLabel>
              <Input
                id="professional_title"
                {...register("professional_title")}
                placeholder="Senior Food Analyst"
                className="h-11 border-slate-200 bg-slate-50 focus:bg-white"
                aria-invalid={!!errors.professional_title}
              />
              <FieldError message={errors.professional_title?.message} />
            </div>
            <div>
              <FieldLabel htmlFor="organization">Organization / Laboratory</FieldLabel>
              <Input
                id="organization"
                {...register("organization")}
                placeholder="Eurofins Scientific India"
                className="h-11 border-slate-200 bg-slate-50 focus:bg-white"
                aria-invalid={!!errors.organization}
              />
              <FieldError message={errors.organization?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="profession">Profession / Area of Work</FieldLabel>
              <Select
                id="profession"
                options={PROFESSION_OPTIONS}
                onChange={(e) => setValue("profession", e.target.value)}
                className="h-11 border-slate-200 bg-slate-50 focus:bg-white"
                aria-invalid={!!errors.profession}
              />
              <FieldError message={errors.profession?.message} />
            </div>
            <div>
              <FieldLabel htmlFor="experience_years">Years of Experience</FieldLabel>
              <Select
                id="experience_years"
                options={EXPERIENCE_OPTIONS}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v !== "") setValue("experience_years", parseInt(v, 10));
                }}
                className="h-11 border-slate-200 bg-slate-50 focus:bg-white"
                aria-invalid={!!errors.experience_years}
              />
              <FieldError message={errors.experience_years?.message} />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="region">Country / Region</FieldLabel>
            <Input
              id="region"
              {...register("region")}
              placeholder="India — Maharashtra"
              className="h-11 border-slate-200 bg-slate-50 focus:bg-white"
              aria-invalid={!!errors.region}
            />
            <FieldError message={errors.region?.message} />
          </div>

          <div className="border-t border-slate-100 pt-2">
            <p className="mb-4 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              Optional Links
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="linkedin_url" required={false}>
                  LinkedIn Profile
                </FieldLabel>
                <Input
                  id="linkedin_url"
                  {...register("linkedin_url")}
                  placeholder="https://linkedin.com/in/yourname"
                  type="url"
                  className="h-11 border-slate-200 bg-slate-50 focus:bg-white"
                  aria-invalid={!!errors.linkedin_url}
                />
                <FieldError message={errors.linkedin_url?.message} />
              </div>
              <div>
                <FieldLabel htmlFor="website_url" required={false}>
                  Professional Website
                </FieldLabel>
                <Input
                  id="website_url"
                  {...register("website_url")}
                  placeholder="https://yourlab.com"
                  type="url"
                  className="h-11 border-slate-200 bg-slate-50 focus:bg-white"
                  aria-invalid={!!errors.website_url}
                />
                <FieldError message={errors.website_url?.message} />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button
              type="button"
              onClick={nextStep}
              variant="navy"
              size="lg"
              className="w-full min-w-[200px] justify-center gap-2 font-bold shadow-md transition-all hover:shadow-lg sm:w-auto"
            >
              Continue to Step 2
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2 Fields */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
          <div>
            <FieldLabel htmlFor="reason">Professional Background & Goals</FieldLabel>
            <p className="mb-3 text-xs text-slate-500">
              Describe your background, what you hope to gain from FAF membership, and how you plan
              to contribute to the community.
            </p>
            <Textarea
              id="reason"
              {...register("reason")}
              placeholder="e.g. I manage a food testing laboratory in Pune and specialize in LC-MS/MS pesticide residue analysis. I am looking to connect with peers and access validated SOPs..."
              rows={8}
              className="resize-none border-slate-200 bg-slate-50 p-4 text-sm focus:bg-white"
              aria-invalid={!!errors.reason}
            />
            <FieldError message={errors.reason?.message} />
          </div>

          <div className="flex flex-col items-center gap-4 pt-6 sm:flex-row">
            <Button
              type="button"
              onClick={prevStep}
              variant="outline"
              size="lg"
              className="w-full font-bold sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              type="submit"
              variant="green"
              size="lg"
              disabled={isSubmitting}
              className="w-full justify-center gap-2 font-bold shadow-md transition-all hover:shadow-lg sm:w-auto sm:flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  Submit Application
                  <Send className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          <p className="mt-2 text-center text-[11px] font-medium text-slate-400 sm:text-right">
            By submitting, you agree to our community guidelines.
          </p>
        </div>
      )}
    </form>
  );
}
