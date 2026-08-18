import { z } from "zod";

/**
 * Strong password criteria:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character (@$!%*?&#)
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Calculates password strength score (0 to 4)
 */
export function calculatePasswordStrength(password: string): {
  score: number;
  label: "Weak" | "Fair" | "Good" | "Strong";
  color: string;
} {
  if (!password) return { score: 0, label: "Weak", color: "bg-gray-200" };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  switch (score) {
    case 1:
      return { score: 1, label: "Weak", color: "bg-red-500" };
    case 2:
      return { score: 2, label: "Fair", color: "bg-orange-500" };
    case 3:
      return { score: 3, label: "Good", color: "bg-[#4a9d23]" };
    case 4:
      return { score: 4, label: "Strong", color: "bg-[#4a9d23]" };
    default:
      return { score: 0, label: "Weak", color: "bg-[#c0392b]" };
  }
}
