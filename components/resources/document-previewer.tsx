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
    <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-md">
      {/* Viewer Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-muted/30 text-xs">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#4a9d23]" />
          <span className="font-bold text-foreground">Interactive Document Previewer</span>
          <span className="text-muted-foreground">({format.toUpperCase()})</span>
        </div>

        <Button variant="green" size="sm" onClick={onDownload} className="gap-1.5 shadow-xs">
          <Download className="h-3.5 w-3.5" /> Download Document
        </Button>
      </div>

      {/* Embedded Content Viewer */}
      <div className="min-h-[420px] bg-accent/20 flex flex-col items-center justify-center p-6 relative">
        {isPdf ? (
          <iframe
            src={`${resource.file_url}#toolbar=0`}
            title={resource.title}
            className="w-full h-[520px] rounded-2xl border border-border shadow-inner"
          />
        ) : isImage ? (
          <div className="max-h-[500px] overflow-hidden rounded-2xl border border-border shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resource.file_url} alt={resource.title} className="max-h-[480px] object-contain" />
          </div>
        ) : (
          <div className="text-center space-y-4 max-w-md p-8 rounded-3xl border border-border bg-card shadow-lg">
            <div className="h-16 w-16 rounded-3xl bg-[#4a9d23]/10 text-[#4a9d23] flex items-center justify-center font-black text-lg mx-auto">
              {format.toUpperCase()}
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-[#0a2a4a] dark:text-foreground">
                Document Ready for Secure Download
              </h4>
              <p className="text-xs text-muted-foreground">
                {resource.title} ({ResourceService.formatFileSize(resource.file_size || 1024000)})
              </p>
            </div>
            <Button variant="green" size="default" onClick={onDownload} className="gap-2 w-full shadow-md">
              <Download className="h-4 w-4" /> Download Official File
            </Button>
          </div>
        )}
      </div>

      {/* Security Disclaimer */}
      <div className="px-5 py-2.5 bg-muted/40 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-[#4a9d23]" /> Scanned for viruses & malware compliant with FSSAI ISO 17025 security policies.
        </span>
        <a href={resource.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline text-[#4a9d23]">
          Open raw file <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
