import { describe, it, expect } from "vitest";
import { CourseService } from "@services/courseService";

describe("CourseService Utility Logic", () => {
  describe("calculateProgress", () => {
    it("should calculate progress percentage accurately", () => {
      expect(CourseService.calculateProgress(3, 10)).toBe(30);
      expect(CourseService.calculateProgress(0, 5)).toBe(0);
      expect(CourseService.calculateProgress(5, 5)).toBe(100);
      expect(CourseService.calculateProgress(0, 0)).toBe(0);
    });
  });

  describe("formatDuration", () => {
    it("should format minutes into hours and minutes string", () => {
      expect(CourseService.formatDuration(270)).toBe("4 hrs 30 mins");
      expect(CourseService.formatDuration(60)).toBe("1 hrs");
      expect(CourseService.formatDuration(45)).toBe("45 mins");
    });
  });

  describe("getLearningPaths", () => {
    it("should return curated learning tracks for laboratory accreditation", () => {
      const paths = CourseService.getLearningPaths();
      expect(paths.length).toBeGreaterThanOrEqual(3);
      expect(paths[0]?.title).toContain("ISO 17025");
    });
  });
});
