import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    const result = cn("bg-red-500", "text-white");
    expect(result).toBe("bg-red-500 text-white");
  });

  it("handles conditional classes and tailwind conflicts", () => {
    const result = cn("px-2 py-1", false && "hidden", "px-4");
    expect(result).toBe("py-1 px-4");
  });
});
