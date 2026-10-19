import { api } from "@/lib/api";

import type {
  BudgetSummary,
  CategoryBudget,
  DepartmentBudget,
  TrancheBudget,
} from "@/types/budget";

export async function getBudgetSummary() {
  const response =
    await api.get<BudgetSummary>(
      "/budget/summary",
    );

  return response.data;
}

export async function getDepartmentBudgets() {
  const response =
    await api.get<DepartmentBudget[]>(
      "/budget/departments",
    );

  return response.data;
}

export async function getBudgetTranches() {
  const response =
    await api.get<TrancheBudget[]>(
      "/budget/tranches",
    );

  return response.data;
}

export async function getBudgetCategories() {
  const response =
    await api.get<CategoryBudget[]>(
      "/budget/categories",
    );

  return response.data;
}