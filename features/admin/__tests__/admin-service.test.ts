import { describe, it, expect } from "vitest";
import { AdminService } from "@services/adminService";

describe("AdminService Utility Logic", () => {
  describe("getHealthMetrics", () => {
    it("should return operational metrics for all core platform services", () => {
      const metrics = AdminService.getHealthMetrics();
      expect(metrics.length).toBeGreaterThanOrEqual(4);
      expect(metrics[0]?.service).toContain("PostgreSQL");
      expect(metrics[0]?.status).toBe("operational");
      expect(metrics[0]?.uptimePct).toBeGreaterThan(99);
    });
  });

  describe("getModerationItems", () => {
    it("should return reported flags for moderation queue", async () => {
      const items = await AdminService.getModerationItems();
      expect(items.length).toBeGreaterThan(0);
      expect(items[0]?.status).toBe("pending");
    });
  });
});
