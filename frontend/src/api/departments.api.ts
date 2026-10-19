import { api } from "@/lib/api";

import type {
  DepartmentDetail,
  DepartmentSummary,
} from "@/types/department";

export async function getDepartments() {
  const response =
    await api.get<DepartmentSummary[]>(
      "/departments",
    );

  return response.data;
}

export async function getDepartment(
  deptId: string,
) {
  const response =
    await api.get<DepartmentDetail>(
      `/departments/${deptId}`,
    );

  return response.data;
}