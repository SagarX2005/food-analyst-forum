import type { Database } from "./database.types";

export * from "./database.types";

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export type Theme = "light" | "dark" | "system";

// Domain Entity Helpers derived from Database
export type Role = Database["public"]["Tables"]["roles"]["Row"];
export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ForumCategory = Database["public"]["Tables"]["forum_categories"]["Row"];
export type ForumPost = Database["public"]["Tables"]["forum_posts"]["Row"];
export type ForumComment = Database["public"]["Tables"]["forum_comments"]["Row"];
export type ForumLike = Database["public"]["Tables"]["forum_likes"]["Row"];
export type ResourceCategory = Database["public"]["Tables"]["resource_categories"]["Row"];
export type Resource = Database["public"]["Tables"]["resources"]["Row"];
export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export type JobApplication = Database["public"]["Tables"]["job_applications"]["Row"];
export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type CourseEnrollment = Database["public"]["Tables"]["course_enrollments"]["Row"];
export type News = Database["public"]["Tables"]["news"]["Row"];
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
