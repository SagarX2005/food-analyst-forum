import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Download, Bookmark, ShieldCheck, Building2, Clock, GitBranch } from "lucide-react";
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
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <Link href="/resources" className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline mb-3">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Resource Library
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="green" className="text-xs">{categoryName}</Badge>
          <Badge variant="outline" className="text-xs border-[#4a9d23]/40 text-[#4a9d23]">v1.0</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Download className="h-3.5 w-3.5 text-[#4a9d23]" /> {res.downloads_count} Downloads
          </span>
          <span className="text-xs text-amber-500 font-bold flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-500" /> {res.rating_avg} ({res.rating_count} reviews)
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground leading-snug">
          {res.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* DOCUMENT PREVIEW & DESCRIPTION */}
        <div className="lg:col-span-8 space-y-8">
          <DocumentPreviewerContainer resource={res} />

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#0a2a4a] dark:text-foreground">
              Document Scope & Description
            </h3>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {res.description}
            </p>

            <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <Clock className="h-4 w-4 text-[#4a9d23]" /> Published on {new Date(res.created_at).toLocaleDateString()}
              </span>
              <span className="font-semibold text-foreground">Format: {res.file_format?.toUpperCase()} ({formattedSize})</span>
            </div>
          </Card>

          {/* VERSION HISTORY TIMELINE */}
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-[#4a9d23]" /> Document Version History
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-[#4a9d23]/30 bg-[#4a9d23]/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0a2a4a] dark:text-foreground">Version 1.0 (Current Release)</span>
                  <p className="text-muted-foreground mt-0.5">Initial NABL & FSSAI accredited release.</p>
                </div>
                <span className="text-[11px] text-muted-foreground">{new Date(res.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* UPLOADER & DOWNLOAD METRICS SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-5 space-y-4">
            <h4 className="text-xs font-extrabold text-[#0a2a4a] dark:text-foreground uppercase tracking-wider">
              Document Publisher
            </h4>
            <div className="flex items-center gap-3">
              <Avatar src={res.uploader?.avatar_url || undefined} fallback={uploaderName} size="lg" />
              <div>
                <p className="font-bold text-sm text-[#0a2a4a] dark:text-foreground flex items-center gap-1">
                  {uploaderName} <ShieldCheck className="h-3.5 w-3.5 text-[#4a9d23]" />
                </p>
                <p className="text-xs text-muted-foreground">{uploaderRole}</p>
                {orgName && <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-0.5"><Building2 className="h-3 w-3" /> {orgName}</p>}
              </div>
            </div>
            {res.uploader?.bio && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {res.uploader.bio}
              </p>
            )}
            <Link href={`/u/${res.uploader?.id}`} className="block">
              <button className="w-full py-2 rounded-xl bg-accent text-xs font-bold text-[#4a9d23] hover:bg-[#4a9d23]/10 transition-colors">
                View Member Credentials
              </button>
            </Link>
          </Card>

          <Card className="p-5 space-y-3">
            <h4 className="text-xs font-extrabold text-[#0a2a4a] dark:text-foreground uppercase tracking-wider">
              Quick Actions
            </h4>
            <button className="w-full py-2.5 rounded-xl border border-border flex items-center justify-center gap-2 text-xs font-bold hover:border-[#4a9d23] transition-colors">
              <Bookmark className="h-4 w-4 text-[#4a9d23]" /> Bookmark to Saved SOPs
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
