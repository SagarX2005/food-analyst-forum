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
    <div className="mx-auto max-w-5xl space-y-8 py-4">
      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <Link
          href="/training"
          className="mb-3 inline-flex items-center gap-1 text-xs font-bold text-[#4a9d23] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Learning Portal
        </Link>

        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="green" className="text-xs font-extrabold uppercase">
            {course.level || "Intermediate"}
          </Badge>
          <Badge variant="outline" className="border-[#4a9d23]/40 text-xs text-[#4a9d23]">
            NABL ISO 17025 Track
          </Badge>
          <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-500" /> {course.rating_avg} (
            {course.rating_count} Ratings)
          </span>
        </div>

        <h1 className="dark:text-foreground text-2xl leading-snug font-extrabold text-[#0a2a4a] sm:text-3xl">
          {course.title}
        </h1>
      </div>

      {/* COURSE HERO BANNER */}
      <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a2a4a] via-[#113a63] to-[#4a9d23] p-6 text-white shadow-xl sm:p-8 md:flex-row md:items-center">
        <div className="relative z-10 max-w-2xl space-y-4">
          <p className="text-sm leading-relaxed text-gray-200">{course.description}</p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-gray-200">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-300" /> {durationFormatted}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-amber-300" /> {course.total_lessons} Lessons
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-amber-300" /> {course.enrolled_count} Enrolled
            </span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <Award className="h-4 w-4" /> Certificate Granted
            </span>
          </div>
        </div>

        <Award className="absolute -right-6 -bottom-6 h-44 w-44 text-white/10" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* CURRICULUM MODULES */}
        <div className="space-y-6 lg:col-span-8">
          <div className="flex items-center justify-between">
            <h3 className="dark:text-foreground flex items-center gap-2 text-lg font-bold text-[#0a2a4a]">
              <BookOpen className="h-5 w-5 text-[#4a9d23]" /> Course Curriculum & Lessons
            </h3>
            <span className="text-muted-foreground text-xs font-semibold">
              {course.modules?.length || 0} Modules
            </span>
          </div>

          <CurriculumViewer modules={course.modules || []} />
        </div>

        {/* INSTRUCTOR & ENROLL SIDEBAR */}
        <div className="space-y-6 lg:col-span-4">
          <Card className="space-y-4 p-5">
            <EnrollContainer course={course} />
          </Card>

          <Card className="space-y-4 p-5">
            <h4 className="dark:text-foreground text-xs font-extrabold tracking-wider text-[#0a2a4a] uppercase">
              About the Instructor
            </h4>
            <div className="flex items-center gap-3">
              <Avatar
                src={course.instructor?.avatar_url || undefined}
                fallback={instructorName}
                size="md"
              />
              <div>
                <p className="dark:text-foreground text-sm font-bold text-[#0a2a4a]">
                  {instructorName}
                </p>
                <p className="text-muted-foreground text-xs">
                  {course.instructor?.title || "Lead Accreditation Trainer"}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Senior analytical chemist and Lead Assessor with over 15 years experience in NABL ISO
              17025 laboratory audits.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
