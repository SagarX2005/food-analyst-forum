import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiClient, ApiError } from "../api-client";

describe("ApiClient", () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient("https://api.example.com");
    vi.restoreAllMocks();
  });

  it("handles successful GET request", async () => {
    const mockData = { id: "1", name: "Sample" };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockData }),
    } as Response);

    const response = await client.get<{ id: string; name: string }>("/test");
    expect(response.success).toBe(true);
    expect(response.data).toEqual(mockData);
  });

  it("throws ApiError on HTTP failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: { message: "Not Found", code: "NOT_FOUND" } }),
    } as Response);

    await expect(client.get("/missing")).rejects.toThrow(ApiError);
  });
});
