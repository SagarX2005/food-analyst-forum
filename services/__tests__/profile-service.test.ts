import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ProfileService, type ProfileUpdate } from "@services/profileService";
import { createClient } from "@lib/supabase/client";

vi.mock("@lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

describe("ProfileService", () => {
  let mockSupabase: { from: Mock };
  let mockFrom: Mock;
  let mockSelect: Mock;
  let mockEq: Mock;
  let mockIs: Mock;
  let mockSingle: Mock;
  let mockUpdate: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSingle = vi.fn();
    mockIs = vi.fn(() => ({ single: mockSingle }));
    mockEq = vi.fn(() => ({ is: mockIs, select: mockSelect }));
    mockSelect = vi.fn(() => ({ eq: mockEq, single: mockSingle }));
    mockUpdate = vi.fn(() => ({ eq: mockEq }));
    mockFrom = vi.fn(() => ({
      select: mockSelect,
      update: mockUpdate,
    }));

    mockSupabase = {
      from: mockFrom,
    };

    (createClient as Mock).mockReturnValue(mockSupabase);
  });

  describe("getProfileByUsername", () => {
    it("should query by id if string is a valid UUID", async () => {
      const uuid = "123e4567-e89b-12d3-a456-426614174000";
      mockSingle.mockResolvedValue({ data: { id: uuid, username: "test" }, error: null });

      const res = await ProfileService.getProfileByUsername(uuid);

      expect(mockFrom).toHaveBeenCalledWith("profiles");
      expect(mockEq).toHaveBeenCalledWith("id", uuid);
      expect(res?.id).toBe(uuid);
    });

    it("should query by username if string is not a valid UUID", async () => {
      const username = "johndoe";
      mockSingle.mockResolvedValue({ data: { id: "123", username }, error: null });

      const res = await ProfileService.getProfileByUsername(username);

      expect(mockFrom).toHaveBeenCalledWith("profiles");
      expect(mockEq).toHaveBeenCalledWith("username", username);
      expect(res?.username).toBe(username);
    });

    it("should return null if error occurs", async () => {
      mockSingle.mockResolvedValue({ data: null, error: new Error("not found") });

      const res = await ProfileService.getProfileByUsername("missing");

      expect(res).toBeNull();
    });
  });

  describe("updateProfile", () => {
    it("should build payload and update successfully", async () => {
      const userId = "user-1";
      const updates = {
        full_name: "Jane Doe",
        username: "janedoe",
        skills: ["React", "TypeScript"],
        cover_url: "http://cover.jpg",
      };

      const mockData = { id: userId, ...updates };
      mockSingle.mockResolvedValue({ data: mockData, error: null });
      // update -> eq -> select -> single
      mockEq.mockReturnValue({ select: mockSelect });

      const res = await ProfileService.updateProfile(userId, updates as unknown as ProfileUpdate);

      expect(mockFrom).toHaveBeenCalledWith("profiles");
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          full_name: "Jane Doe",
          username: "janedoe",
          skills: ["React", "TypeScript"],
          cover_url: "http://cover.jpg",
          location: null, // should fall back to null
          website: null,
          linkedin_url: null,
          github_url: null,
        })
      );
      expect(mockEq).toHaveBeenCalledWith("id", userId);
      expect(res).toEqual(mockData);
    });

    it("should throw error if update fails", async () => {
      const userId = "user-1";
      mockSingle.mockResolvedValue({ data: null, error: new Error("Update failed") });
      mockEq.mockReturnValue({ select: mockSelect });

      await expect(
        ProfileService.updateProfile(userId, {} as unknown as ProfileUpdate)
      ).rejects.toThrow("Profile update failed: Update failed");
    });
  });
});
