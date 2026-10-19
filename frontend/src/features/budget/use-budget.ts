import { useQuery } from "@tanstack/react-query";

import {
  getBudgetCategories,
  getBudgetSummary,
  getBudgetTranches,
  getDepartmentBudgets,
} from "@/api/budget.api";

export function useBudget() {
  const summary = useQuery({
    queryKey: ["budget", "summary"],
    queryFn: getBudgetSummary,
  });

  const departments = useQuery({
    queryKey: ["budget", "departments"],
    queryFn: getDepartmentBudgets,
  });

  const tranches = useQuery({
    queryKey: ["budget", "tranches"],
    queryFn: getBudgetTranches,
  });

  const categories = useQuery({
    queryKey: ["budget", "categories"],
    queryFn: getBudgetCategories,
  });

  return {
    summary,
    departments,
    tranches,
    categories,
  };
}