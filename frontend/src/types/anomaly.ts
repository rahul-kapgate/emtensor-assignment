export type AnomalySeverity =
  | "critical"
  | "warning"
  | "info";

export type AnomalyCategory =
  | "finance"
  | "people"
  | "task"
  | "component"
  | "timesheet"
  | "milestone";

export interface Anomaly {
  id: string;
  rule: string;
  severity: AnomalySeverity;
  category: AnomalyCategory;

  record_id: string | null;
  related_record_id: string | null;

  title: string;
  message: string;
  recommendation: string | null;
}

export interface AnomalySummary {
  total: number;
  critical: number;
  warning: number;

  by_category: Record<string, number>;
}