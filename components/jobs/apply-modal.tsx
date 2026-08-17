"use client";

import * as React from "react";
import { Send, FileText, X } from "lucide-react";
import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import { FileUploader } from "@components/shared/file-uploader";
import { JobService, type FullJob } from "@services/jobService";
import { useAuth } from "@hooks/use-auth";

interface ApplyModalProps {
  job: FullJob | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApplyModal({ job, isOpen, onClose, onSuccess }: ApplyModalProps) {
  const { user } = useAuth();
  const [resumeUrl, setResumeUrl] = React.useState<string | null>(null);
  const [coverLetter, setCoverLetter] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!resumeUrl) {
      setError("Please attach or upload your CV / Resume file before applying.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await JobService.applyForJob({
        jobId: job.id,
        applicantId: user.id,
        resumeUrl,
        coverLetter,
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Application submission failed";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#4a9d23] uppercase tracking-wider">Quick Application</span>
            <h3 className="text-xl font-extrabold text-[#0a2a4a] dark:text-foreground leading-snug">
              {job.title}
            </h3>
            <p className="text-xs text-muted-foreground">{job.organization?.name || "Accredited Laboratory"}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-foreground mb-1 block uppercase tracking-wider flex items-center gap-1">
              <FileText className="h-4 w-4 text-[#4a9d23]" /> Attach Resume / CV (PDF or DOCX)
            </label>
            <FileUploader
              bucket="resumes"
              userId={user?.id || "anonymous"}
              label="Upload CV Document"
              accept=".pdf,.docx"
              currentUrl={resumeUrl}
              onUploadSuccess={(url) => setResumeUrl(url)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground mb-1 block uppercase tracking-wider">
              Cover Letter & Brief Bio Summary
            </label>
            <Textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Highlight your laboratory analytical experience, LC-MS instrumentation skills, and NABL auditor background..."
              rows={4}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="green" size="default" disabled={isSubmitting} className="gap-2 shadow-md">
              <Send className="h-4 w-4" /> {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
