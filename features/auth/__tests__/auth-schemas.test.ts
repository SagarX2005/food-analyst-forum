import { describe, it, expect } from "vitest";
import {
  loginSchema,
  calculatePasswordStrength,
} from "../schemas";

describe("Auth Validation Schemas & Helpers", () => {
  describe("loginSchema", () => {
    it("should validate a correct email and password", () => {
      const result = loginSchema.safeParse({
        email: "analyst@foodlab.com",
        password: "Password123!",
        rememberMe: true,
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email formats", () => {
      const result = loginSchema.safeParse({
        email: "not-an-email",
        password: "Password123!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain("Invalid email address");
      }
    });
  });



  describe("calculatePasswordStrength", () => {
    it("should score weak passwords", () => {
      const { score, label } = calculatePasswordStrength("12345");
      expect(score).toBe(1);
      expect(label).toBe("Weak");
    });

    it("should score strong passwords satisfying all criteria", () => {
      const { score, label } = calculatePasswordStrength("P@ssword123!");
      expect(score).toBe(4);
      expect(label).toBe("Strong");
    });
  });
});
