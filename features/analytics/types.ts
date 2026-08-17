export interface MetricSummary {
  id: string;
  metricName: string;
  value: number;
  changePercentage: number;
  period: "daily" | "weekly" | "monthly";
}
