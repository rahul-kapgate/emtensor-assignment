import { useQuery } from "@tanstack/react-query";

import {
  getAnomalies,
  getAnomalySummary,
} from "@/api/anomalies.api";

export function useAnomalies() {
  const anomalies = useQuery({
    queryKey: ["anomalies"],
    queryFn: getAnomalies,
  });

  const summary = useQuery({
    queryKey: [
      "anomalies",
      "summary",
    ],
    queryFn: getAnomalySummary,
  });

  return {
    anomalies,
    summary,
  };
}