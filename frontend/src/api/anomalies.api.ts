import { api } from "@/lib/api";

import type {
  Anomaly,
  AnomalySummary,
} from "@/types/anomaly";

export async function getAnomalies() {
  const response =
    await api.get<Anomaly[]>(
      "/anomalies",
    );

  return response.data;
}

export async function getAnomalySummary() {
  const response =
    await api.get<AnomalySummary>(
      "/anomalies/summary",
    );

  return response.data;
}