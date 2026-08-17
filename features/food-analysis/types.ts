export interface FoodReport {
  id: string;
  sampleName: string;
  category: string;
  composition: Record<string, number>;
  status: "pending" | "analyzing" | "completed" | "flagged";
  createdAt: string;
}
