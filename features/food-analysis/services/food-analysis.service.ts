import { BaseService } from "@services/base-service";
import type { FoodReport } from "../types";

export class FoodAnalysisService extends BaseService {
  public async getReports() {
    return this.client.get<FoodReport[]>("/api/food-analysis/reports");
  }
}

export const foodAnalysisService = new FoodAnalysisService();
