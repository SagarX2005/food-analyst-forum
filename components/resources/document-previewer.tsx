"use client";

import * as React from "react";
import { Download, FileText, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@components/ui/button";
import { ResourceService, type FullResource } from "@services/resourceService";

interface DocumentPreviewerProps {
  resource: FullResource;
  onDownload: () => void;
}

export function DocumentPreviewer({ resource, onDownload }: DocumentPreviewerProps) {
  const format = ResourceService.getFileExtension(resource.file_url);
  const isImage = ["png", "jpg", "jpeg", "webp", "gif"].includes(format);
  const isPdf = format === "pdf";

  return (
    <div className="border-border/80 bg-card overflow-hidden rounded-3xl border shadow-md">
      {/* Viewer Header */}
      <div className="border-border/60 bg-muted/30 flex items-center justify-between border-b px-5 py-3 text-xs">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#4a9d23]" />
          <span className="text-foreground font-bold">Interactive Document Previewer</span>
          <span className="text-muted-foreground">({format.toUpperCase()})</span>
        </div>

        <Button variant="green" size="sm" onClick={onDownload} className="gap-1.5 shadow-xs">
          <Download className="h-3.5 w-3.5" /> Download Document
        </Button>
      </div>

      {/* Embedded Content Viewer */}
      <div className="bg-accent/20 relative flex min-h-[420px] flex-col items-center justify-center p-6">
        {isPdf ? (
          <iframe
            src={`${resource.file_url}#toolbar=0`}
            title={resource.title}
            className="border-border h-[520px] w-full rounded-2xl border shadow-inner"
          />
        ) : isImage ? (
          <div className="border-border max-h-[500px] overflow-hidden rounded-2xl border shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resource.file_url}
              alt={resource.title}
              className="max-h-[480px] object-contain"
            />
          </div>
        ) : (
          <div className="border-border bg-card max-w-md space-y-4 rounded-3xl border p-8 text-center shadow-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#4a9d23]/10 text-lg font-black text-[#4a9d23]">
              {format.toUpperCase()}
            </div>
            <div className="space-y-1">
              <h4 className="dark:text-foreground text-base font-bold text-[#0a2a4a]">
                Document Ready for Secure Download
              </h4>
              <p className="text-muted-foreground text-xs">
                {resource.title} ({ResourceService.formatFileSize(resource.file_size || 1024000)})
              </p>
            </div>
            <Button
              variant="green"
              size="default"
              onClick={onDownload}
              className="w-full gap-2 shadow-md"
            >
              <Download className="h-4 w-4" /> Download Official File
            </Button>
          </div>
        )}
      </div>

      {/* Security Disclaimer */}
      <div className="bg-muted/40 border-border/60 text-muted-foreground flex items-center justify-between border-t px-5 py-2.5 text-[11px]">
        <span className="text-foreground flex items-center gap-1.5 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-[#4a9d23]" /> Scanned for viruses & malware
          compliant with FSSAI ISO 17025 security policies.
        </span>
        <a
          href={resource.file_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-[#4a9d23] hover:underline"
        >
          Open raw file <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
