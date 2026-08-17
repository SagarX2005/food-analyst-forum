import { describe, it, expect } from "vitest";
import { ProfileService, type FullProfile } from "@services/profileService";

describe("ProfileCompletion Math & Logic", () => {
  it("should return 0% completion for null profile", () => {
    const res = ProfileService.calculateProfileCompletion(null);
    expect(res.percentage).toBe(0);
    expect(res.completedSteps.length).toBe(0);
  });

  it("should calculate correct completion percentage for partial profile", () => {
    const mockProfile: Record<string, unknown> = {
      id: "usr_123",
      full_name: "Priya Sharma",
      headline: "Microbiology Analyst",
      title: "Microbiology Analyst",
      bio: "10+ years experience in pathogen risk assessment and food microbiology.",
      location: "Mumbai, MH",
      skills: ["Microbiology", "ISO 17025"],
    };

    const res = ProfileService.calculateProfileCompletion(mockProfile as unknown as FullProfile);
    expect(res.percentage).toBeGreaterThan(0);
    expect(res.completedSteps).toContain("Full Name");
    expect(res.completedSteps).toContain("Job Title");
    expect(res.completedSteps).toContain("Professional Bio");
  });

  it("should return 100% completion for complete profile", () => {
    const mockProfile: Record<string, unknown> = {
      id: "usr_456",
      full_name: "Dr. Sarah Jenkins",
      headline: "Senior Lead Chemist",
      title: "Senior Lead Chemist",
      bio: "Lead scientist specializing in pesticide residue analysis.",
      avatar_url: "https://example.com/avatar.jpg",
      organization_id: "org_789",
      skills: ["HPLC", "LC-MS/MS"],
      location: "Delhi, India",
      website: "https://sarahchem.com",
    };

    const res = ProfileService.calculateProfileCompletion(mockProfile as unknown as FullProfile);
    expect(res.percentage).toBe(100);
    expect(res.missingSteps.length).toBe(0);
  });
});
