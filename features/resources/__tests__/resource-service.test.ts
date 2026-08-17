import { describe, it, expect } from "vitest";
import { ResourceService } from "@services/resourceService";

describe("ResourceService Utility Logic", () => {
  describe("formatFileSize", () => {
    it("should format bytes correctly into human readable strings", () => {
      expect(ResourceService.formatFileSize(0)).toBe("0 Bytes");
      expect(ResourceService.formatFileSize(1024)).toBe("1 KB");
      expect(ResourceService.formatFileSize(2500000)).toBe("2.4 MB");
      expect(ResourceService.formatFileSize(1073741824)).toBe("1 GB");
    });
  });

  describe("getFileExtension", () => {
    it("should extract clean file extension from URL or path", () => {
      expect(ResourceService.getFileExtension("https://example.com/sop-17025.pdf?v=1")).toBe("pdf");
      expect(ResourceService.getFileExtension("/documents/validation_protocol.docx")).toBe("docx");
      expect(ResourceService.getFileExtension("spreadsheet.xlsx")).toBe("xlsx");
      expect(ResourceService.getFileExtension("archive.zip")).toBe("zip");
    });
  });

  describe("getCollections", () => {
    it("should return curated knowledge collections", () => {
      const collections = ResourceService.getCollections();
      expect(collections.length).toBeGreaterThan(0);
      expect(collections[0]).toHaveProperty("id");
      expect(collections[0]).toHaveProperty("title");
    });
  });
});
