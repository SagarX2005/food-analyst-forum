// features/invitations/schemas.ts
// Phase 10A — Zod validation schemas for the invitation system
import { z } from "zod";
import { ALLOWED_APPROVAL_ROLES } from "./config";

const MAX_TEXT = 500;
const MAX_REASON = 2000;
const URL_REGEX = /^https?:\/\/.+\..+/;

// ---------------------------------------------------------------------------
// Public: Access Request submission form
// ---------------------------------------------------------------------------
export const accessRequestSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(120, "Full name must be under 120 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be under 255 characters"),

  professional_title: z
    .string()
    .trim()
    .min(2, "Professional title is required")
    .max(MAX_TEXT, `Professional title must be under ${MAX_TEXT} characters`),

  organization: z
    .string()
    .trim()
    .min(2, "Organization name is required")
    .max(MAX_TEXT, `Organization name must be under ${MAX_TEXT} characters`),

  profession: z
    .string()
    .trim()
    .min(2, "Profession / area of work is required")
    .max(MAX_TEXT, `Profession must be under ${MAX_TEXT} characters`),

  experience_years: z
    .number({ invalid_type_error: "Please enter your years of experience" })
    .int("Years of experience must be a whole number")
    .min(0, "Experience cannot be negative")
    .max(60, "Please enter a realistic value for years of experience"),

  region: z
    .string()
    .trim()
    .min(2, "Country / region is required")
    .max(120, "Region must be under 120 characters"),

  reason: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters explaining your reason for joining")
    .max(MAX_REASON, `Reason must be under ${MAX_REASON} characters`),

  linkedin_url: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === "" ? undefined : v))
    .refine(
      (v) => v === undefined || URL_REGEX.test(v),
      "LinkedIn URL must be a valid URL starting with http:// or https://",
    )
    .refine(
      (v) => v === undefined || v.toLowerCase().includes("linkedin.com"),
      "LinkedIn URL must be a linkedin.com URL",
    ),

  website_url: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === "" ? undefined : v))
    .refine(
      (v) => v === undefined || URL_REGEX.test(v),
      "Website URL must be a valid URL starting with http:// or https://",
    ),
});

export type AccessRequestInput = z.infer<typeof accessRequestSchema>;

// ---------------------------------------------------------------------------
// Admin: Approve request schema
// ---------------------------------------------------------------------------
export const approveRequestSchema = z.object({
  request_id: z.string().uuid("Invalid request ID"),
  // Role is validated server-side against ALLOWED_APPROVAL_ROLES;
  // this schema ensures it's a non-empty string before even hitting the route.
  approved_role: z.enum(ALLOWED_APPROVAL_ROLES, {
    errorMap: () => ({
      message: `Role must be one of: ${ALLOWED_APPROVAL_ROLES.join(", ")}`,
    }),
  }),
});

export type ApproveRequestInput = z.infer<typeof approveRequestSchema>;

// ---------------------------------------------------------------------------
// Admin: Reject request schema
// ---------------------------------------------------------------------------
export const rejectRequestSchema = z.object({
  request_id: z.string().uuid("Invalid request ID"),
  rejection_reason: z
    .string()
    .trim()
    .min(10, "Please provide a reason of at least 10 characters")
    .max(1000, "Rejection reason must be under 1000 characters"),
});

export type RejectRequestInput = z.infer<typeof rejectRequestSchema>;

// ---------------------------------------------------------------------------
// Public: Accept invitation form (account setup)
// ---------------------------------------------------------------------------
export const acceptInviteSchema = z
  .object({
    token: z.string().min(1, "Invalid invitation link"),

    full_name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(120, "Full name must be under 120 characters"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),

    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;
