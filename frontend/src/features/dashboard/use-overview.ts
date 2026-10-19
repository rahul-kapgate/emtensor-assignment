import { useQuery } from "@tanstack/react-query";

import { getOverview } from "@/api/overview.api";

export function useOverview() {
  return useQuery({
    queryKey: ["overview"],
    queryFn: getOverview,
  });
}