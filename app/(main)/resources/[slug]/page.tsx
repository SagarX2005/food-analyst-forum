import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Download,
  Bookmark,
  ShieldCheck,
  Building2,
  Clock,
  GitBranch,
} from "lucide-react";
import { ResourceService } from "@services/resourceService";
import { Badge } from "@components/ui/badge";
import { Avatar } from "@components/ui/avatar";
import { Card } from "@components/ui/card";
import { DocumentPreviewerContainer } from "./preview-container";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await ResourceService.getResourceBySlug(slug);

  if (!res) {
    return {
      title: "Document Not Found",
    };
  }

  const title = res.title;
  const description = (res.description || "").slice(0, 160);

  return {
    title: `${title} — Food Analyst Resource Library`,
    description,
    openGraph: {
      title: `${title} — Food Analyst Forum`,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const res = await ResourceService.getResourceBySlug(slug);

  if (!res) {
    notFound();
  }

  const uploaderName = res.uploader?.full_name || "Food Analyst Professional";
  const uploaderRole = res.uploader?.roles?.name || "User";
  const orgName = res.uploader?.organizations?.name;
  const categoryName = res.category?.name || "Standard Operating Procedure";
  const formattedSize = ResourceService.formatFileSize(res.file_size || 1024000);

  // JSON-LD DigitalDocument schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: res.title,
    description: res.description,
    fileFormat: res.file_format,
    datePublished: res.created_at,
    author: {
      "@type": "Person",
      name: uploaderName,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: res.rating_avg,
      reviewCount: res.rating_count,
    },
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-4">
      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <Link
          href="/resources"
          className="mb-3 inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Resource Library
        </Link>

        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="green" className="text-xs">
            {categoryName}
          </Badge>
          <Badge variant="outline" className="border-[#4a9d23]/40 text-xs text-[#4a9d23]">
            v1.0
          </Badge>
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <Download className="h-3.5 w-3.5 text-[#4a9d23]" /> {res.downloads_count} Downloads
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-500" /> {res.rating_avg} ({res.rating_count}{" "}
            reviews)
          </span>
        </div>

        <h1 className="dark:text-foreground text-2xl leading-snug font-extrabold text-[#0a2a4a] sm:text-3xl">
          {res.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* DOCUMENT PREVIEW & DESCRIPTION */}
        <div className="space-y-8 lg:col-span-8">
          <DocumentPreviewerContainer resource={res} />

          <Card className="space-y-4 p-6">
            <h3 className="dark:text-foreground text-lg font-bold text-[#0a2a4a]">
              Document Scope & Description
            </h3>
            <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
              {res.description}
            </p>

            <div className="border-border/60 text-muted-foreground flex items-center justify-between border-t pt-4 text-xs">
              <span className="text-foreground flex items-center gap-1.5 font-semibold">
                <Clock className="h-4 w-4 text-[#4a9d23]" /> Published on{" "}
                {new Date(res.created_at).toLocaleDateString()}
              </span>
              <span className="text-foreground font-semibold">
                Format: {res.file_format?.toUpperCase()} ({formattedSize})
              </span>
            </div>
          </Card>

          {/* VERSION HISTORY TIMELINE */}
          <Card className="space-y-4 p-6">
            <h3 className="dark:text-foreground flex items-center gap-2 text-lg font-bold text-[#0a2a4a]">
              <GitBranch className="h-5 w-5 text-[#4a9d23]" /> Document Version History
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between rounded-xl border border-[#4a9d23]/30 bg-[#4a9d23]/5 p-3">
                <div>
                  <span className="dark:text-foreground font-bold text-[#0a2a4a]">
                    Version 1.0 (Current Release)
                  </span>
                  <p className="text-muted-foreground mt-0.5">
                    Initial NABL & FSSAI accredited release.
                  </p>
                </div>
                <span className="text-muted-foreground text-[11px]">
                  {new Date(res.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* UPLOADER & DOWNLOAD METRICS SIDEBAR */}
        <div className="space-y-6 lg:col-span-4">
          <Card className="space-y-4 p-5">
            <h4 className="dark:text-foreground text-xs font-extrabold tracking-wider text-[#0a2a4a] uppercase">
              Document Publisher
            </h4>
            <div className="flex items-center gap-3">
              <Avatar
                src={res.uploader?.avatar_url || undefined}
                fallback={uploaderName}
                size="lg"
              />
              <div>
                <p className="dark:text-foreground flex items-center gap-1 text-sm font-bold text-[#0a2a4a]">
                  {uploaderName} <ShieldCheck className="h-3.5 w-3.5 text-[#4a9d23]" />
                </p>
                <p className="text-muted-foreground text-xs">{uploaderRole}</p>
                {orgName && (
                  <p className="text-muted-foreground flex items-center gap-1 pt-0.5 text-[11px]">
                    <Building2 className="h-3 w-3" /> {orgName}
                  </p>
                )}
              </div>
            </div>
            {res.uploader?.bio && (
              <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
                {res.uploader.bio}
              </p>
            )}
            <Link href={`/u/${res.uploader?.id}`} className="block">
              <button className="bg-accent w-full rounded-xl py-2 text-xs font-bold text-[#4a9d23] transition-colors hover:bg-[#4a9d23]/10">
                View Member Credentials
              </button>
            </Link>
          </Card>

          <Card className="space-y-3 p-5">
            <h4 className="dark:text-foreground text-xs font-extrabold tracking-wider text-[#0a2a4a] uppercase">
              Quick Actions
            </h4>
            <button className="border-border flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition-colors hover:border-[#4a9d23]">
              <Bookmark className="h-4 w-4 text-[#4a9d23]" /> Bookmark to Saved SOPs
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
