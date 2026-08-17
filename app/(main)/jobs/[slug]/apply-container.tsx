"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { Button } from "@components/ui/button";
import { ApplyModal } from "@components/jobs/apply-modal";
import type { FullJob } from "@services/jobService";

interface QuickApplyContainerProps {
  job: FullJob;
}

export function QuickApplyContainer({ job }: QuickApplyContainerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  return (
    <div className="space-y-3">
      {successMsg && (
        <div className="p-3 rounded-xl bg-[#4a9d23]/10 border border-[#4a9d23]/30 text-xs font-semibold text-[#4a9d23]">
          {successMsg}
        </div>
      )}

      <Button
        variant="green"
        size="lg"
        onClick={() => setIsOpen(true)}
        className="w-full gap-2 shadow-md"
      >
        <Send className="h-4 w-4" /> Quick Apply Now
      </Button>

      <ApplyModal
        job={job}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => setSuccessMsg("Application submitted successfully!")}
      />
    </div>
  );
}
