"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Upload, ArrowLeft, FileCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Select } from "@components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { FileUploader } from "@components/shared/file-uploader";
import { ResourceService, type ResourceCategoryRow } from "@services/resourceService";
import { useAuth } from "@hooks/use-auth";

export default function UploadResourcePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = React.useState<ResourceCategoryRow[]>([]);

  const [categoryId, setCategoryId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [fileUrl, setFileUrl] = React.useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadCats() {
      const data = await ResourceService.getCategories();
      setCategories(data);
      if (data.length > 0 && data[0]) setCategoryId(data[0].id);
    }
    loadCats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login?redirectTo=/resources/upload");
      return;
    }

    if (!fileUrl) {
      setError("Please attach a valid document file before publishing.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const res = await ResourceService.createResource({
        uploaderId: user.id,
        categoryId: categoryId || categories[0]?.id || "",
        title,
        description,
        fileUrl,
        fileSize: 2450000,
      });

      router.push(`/resources/${res.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish resource";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-4">
      <div>
        <Link
          href="/resources"
          className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Resource Library
        </Link>
        <h1 className="dark:text-foreground flex items-center gap-2 text-3xl font-extrabold text-[#0a2a4a]">
          <Upload className="h-7 w-7 text-[#4a9d23]" /> Upload Knowledge Document
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Publish accredited SOPs, validation protocols, regulatory guidelines, or calculation
          templates.
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-xl border p-4 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* FILE ATTACHMENT SECTION */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="dark:text-foreground flex items-center gap-2 text-lg text-[#0a2a4a]">
              <FileCheck className="h-5 w-5 text-[#4a9d23]" /> Attach Document File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploader
              bucket="resources"
              userId={user?.id || "anonymous"}
              label="Upload SOP or Document File"
              accept=".pdf,.docx,.xlsx,.pptx,.zip,image/*"
              currentUrl={fileUrl}
              onUploadSuccess={(url) => setFileUrl(url)}
            />
          </CardContent>
        </Card>

        {/* METADATA ENTRY */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="dark:text-foreground text-lg text-[#0a2a4a]">
              Document Metadata & Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
                Category
              </label>
              <Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
              />
            </div>

            <div>
              <label className="text-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
                Document Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ISO 17025 Measurement Uncertainty Calculation Template (Excel)"
                required
              />
            </div>

            <div>
              <label className="text-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
                Description & Scope
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the scope, analytical method, applicability, and revision details of this document..."
                rows={5}
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="green"
                size="lg"
                disabled={isSubmitting}
                className="shadow-md"
              >
                {isSubmitting ? "Publishing Resource..." : "Publish Resource Document"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
