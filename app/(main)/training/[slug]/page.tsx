import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Star, Award, BookOpen, Users } from "lucide-react";
import { CourseService } from "@services/courseService";
import { Badge } from "@components/ui/badge";
import { Card } from "@components/ui/card";
import { Avatar } from "@components/ui/avatar";
import { CurriculumViewer } from "@components/training/curriculum-viewer";
import { EnrollContainer } from "./enroll-container";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await CourseService.getCourseBySlug(slug);

  if (!course) {
    return {
      title: "Course Not Found",
    };
  }

  const title = course.title;
  const description = (course.description || "").slice(0, 160);

  return {
    title: `${title} — Food Analyst Forum LMS`,
    description,
    openGraph: {
      title: `${title} — Food Analyst Forum LMS`,
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

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await CourseService.getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const instructorName = course.instructor?.full_name || "Lead Certification Trainer";
  const durationFormatted = CourseService.formatDuration(240);

  // JSON-LD Course schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "Food Analyst Forum",
      sameAs: "https://foodanalystforum.com",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      instructor: {
        "@type": "Person",
        name: instructorName,
      },
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
        <Link href="/training" className="inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline mb-3">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Learning Portal
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="green" className="text-xs font-extrabold uppercase">{course.level || "Intermediate"}</Badge>
          <Badge variant="outline" className="text-xs border-[#4a9d23]/40 text-[#4a9d23]">NABL ISO 17025 Track</Badge>
          <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-500" /> {course.rating_avg} ({course.rating_count} Ratings)
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground leading-snug">
          {course.title}
        </h1>
      </div>

      {/* COURSE HERO BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0a2a4a] via-[#113a63] to-[#4a9d23] p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-4 max-w-2xl relative z-10">
          <p className="text-sm text-gray-200 leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs text-gray-200 font-semibold pt-2">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-amber-300" /> {durationFormatted}</span>
            <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-amber-300" /> {course.total_lessons} Lessons</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-amber-300" /> {course.enrolled_count} Enrolled</span>
            <span className="flex items-center gap-1.5 text-amber-300"><Award className="h-4 w-4" /> Certificate Granted</span>
          </div>
        </div>

        <Award className="absolute -right-6 -bottom-6 h-44 w-44 text-white/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CURRICULUM MODULES */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#4a9d23]" /> Course Curriculum & Lessons
            </h3>
            <span className="text-xs text-muted-foreground font-semibold">
              {course.modules?.length || 0} Modules
            </span>
          </div>

          <CurriculumViewer modules={course.modules || []} />
        </div>

        {/* INSTRUCTOR & ENROLL SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-5 space-y-4">
            <EnrollContainer course={course} />
          </Card>

          <Card className="p-5 space-y-4">
            <h4 className="text-xs font-extrabold text-[#0a2a4a] dark:text-foreground uppercase tracking-wider">
              About the Instructor
            </h4>
            <div className="flex items-center gap-3">
              <Avatar src={course.instructor?.avatar_url || undefined} fallback={instructorName} size="md" />
              <div>
                <p className="font-bold text-sm text-[#0a2a4a] dark:text-foreground">
                  {instructorName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {course.instructor?.title || "Lead Accreditation Trainer"}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Senior analytical chemist and Lead Assessor with over 15 years experience in NABL ISO 17025 laboratory audits.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
