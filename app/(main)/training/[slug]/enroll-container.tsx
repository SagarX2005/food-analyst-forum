"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PlayCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@components/ui/button";
import { CourseService, type FullCourse } from "@services/courseService";
import { useAuth } from "@hooks/use-auth";
import { MembershipGate } from "@components/invitations/membership-gate";

interface EnrollContainerProps {
  course: FullCourse;
}

export function EnrollContainer({ course }: EnrollContainerProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [isEnrolled, setIsEnrolled] = React.useState(course.is_enrolled || false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleEnroll = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await CourseService.enrollUser(course.id, user.id);
      setIsEnrolled(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Enrollment failed";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-xl border p-3 text-xs font-semibold">
          {error}
        </div>
      )}

      {isEnrolled ? (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-[#4a9d23]/30 bg-[#4a9d23]/10 p-3 text-xs font-bold text-[#4a9d23]">
            <CheckCircle2 className="h-4 w-4" /> You are enrolled in this course!
          </div>
          <Button
            variant="green"
            size="lg"
            onClick={() => router.push("/training/dashboard")}
            className="w-full gap-2 shadow-md"
          >
            <PlayCircle className="h-4 w-4" /> Continue Learning
          </Button>
        </div>
      ) : !user ? (
        <MembershipGate compact title="Members Only" description="" />
      ) : (
        <Button
          variant="green"
          size="lg"
          onClick={handleEnroll}
          disabled={isSubmitting}
          className="w-full gap-2 shadow-md"
        >
          <PlayCircle className="h-4 w-4" />{" "}
          {isSubmitting ? "Enrolling..." : "Enroll in Course — Free"}
        </Button>
      )}
    </div>
  );
}
