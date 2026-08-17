import { BaseService } from "@services/base-service";
import type { MetricSummary } from "../types";

export class AnalyticsService extends BaseService {
  public async getOverviewMetrics() {
    return this.client.get<MetricSummary[]>("/api/analytics/overview");
  }
}

export const analyticsService = new AnalyticsService();
