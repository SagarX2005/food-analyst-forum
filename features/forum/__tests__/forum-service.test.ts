import { describe, it, expect } from "vitest";
import { ForumService } from "@services/forumService";

describe("ForumService Utility Logic", () => {
  describe("calculateReadingTime", () => {
    it("should return 1 min for short content", () => {
      const text = "This is a short post about LC-MS/MS pesticide testing protocols.";
      const minutes = ForumService.calculateReadingTime(text);
      expect(minutes).toBe(1);
    });

    it("should calculate reading time correctly for longer text", () => {
      const longText = Array(600).fill("word").join(" ");
      const minutes = ForumService.calculateReadingTime(longText);
      expect(minutes).toBe(3);
    });
  });

  describe("generateSlug", () => {
    it("should generate clean url-friendly slug", () => {
      const title = "Best Practices for HPLC Mobile Phase Optimization in Food Labs!";
      const slug = ForumService.generateSlug(title);
      expect(slug).toContain("best-practices-for-hplc-mobile-phase-optimization-in-food-labs");
    });
  });
});
