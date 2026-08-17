import { describe, it, expect } from "vitest";
import { JobService } from "@services/jobService";

describe("JobService Utility Logic", () => {
  describe("formatSalaryRange", () => {
    it("should format INR salary in Lakhs correctly", () => {
      expect(JobService.formatSalaryRange(800000, 1400000, "INR")).toBe("₹8.0L - ₹14.0L / year");
      expect(JobService.formatSalaryRange(600000, null, "INR")).toBe("₹6.0L+ / year");
      expect(JobService.formatSalaryRange(null, null)).toBe("Competitive Salary");
    });
  });

  describe("generateSlug", () => {
    it("should generate clean url-friendly slug for jobs", () => {
      const slug = JobService.generateSlug("Senior Analytical Chemist", "Eurofins Labs");
      expect(slug).toContain("senior-analytical-chemist-eurofins-labs");
    });
  });
});
