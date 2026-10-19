import { useQuery } from "@tanstack/react-query";

import {
  getDepartment,
  getDepartments,
} from "@/api/departments.api";

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });
}

export function useDepartment(
  deptId: string | undefined,
) {
  return useQuery({
    queryKey: [
      "departments",
      deptId,
    ],

    queryFn: () =>
      getDepartment(deptId!),

    enabled: Boolean(deptId),
  });
}