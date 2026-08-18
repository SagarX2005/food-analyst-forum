"use client";

import * as React from "react";
import { Upload, AlertCircle, Loader2 } from "lucide-react";
import { UploadService, type BucketName } from "@services/uploadService";
import { cn } from "@lib/utils";

interface FileUploaderProps {
  bucket: BucketName;
  userId: string;
  onUploadSuccess: (publicUrl: string) => void;
  accept?: string;
  label?: string;
  currentUrl?: string | null;
  className?: string;
}

export function FileUploader({
  bucket,
  userId,
  onUploadSuccess,
  accept = "image/*",
  label = "Upload Image",
  currentUrl,
  className,
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [preview, setPreview] = React.useState<string | null>(currentUrl || null);
  const [error, setError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      setError(null);
      setIsUploading(true);
      setProgress(10);

      // Create local preview if image
      if (selectedFile.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(selectedFile));
      }

      const url = await UploadService.uploadFile({
        bucket,
        file: selectedFile,
        userId,
        onProgress: (p) => setProgress(p),
      });

      setPreview(url);
      onUploadSuccess(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setError(msg);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-border/80 bg-accent/30 hover:bg-accent/60 group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all hover:border-[#4a9d23]",
          isUploading && "pointer-events-none opacity-60",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {preview && accept.includes("image") ? (
          <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-2xl border-2 border-[#4a9d23] shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4a9d23]/10 text-[#4a9d23] transition-transform group-hover:scale-110">
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
          </div>
        )}

        <div className="space-y-1">
          <p className="dark:text-foreground text-xs font-bold text-[#0a2a4a]">{label}</p>
          <p className="text-muted-foreground text-[11px]">Click to browse file (Max 5MB)</p>
        </div>

        {isUploading && (
          <div className="bg-muted mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full">
            <div
              className="h-full bg-[#4a9d23] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {error && (
        <div className="text-destructive flex items-center gap-1.5 text-xs font-semibold">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}
    </div>
  );
}
