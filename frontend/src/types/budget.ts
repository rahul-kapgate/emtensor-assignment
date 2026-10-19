export interface BudgetSummary {
  total_grant_inr: number;
  received_inr: number;
  allocated_inr: number;
  spent_inr: number;

  grant_received_pct: number;
  allocation_utilization_pct: number;
  received_utilization_pct: number;

  unallocated_inr: number;
  unspent_allocated_inr: number;
  received_remaining_inr: number;
}

export interface DepartmentBudget {
  dept_id: string;
  dept_name: string;

  budget_inr: number;
  allocated_inr: number;
  spent_inr: number;
  remaining_inr: number;
  utilization_pct: number;
}

export interface TrancheBudget {
  tranche_id: string;
  status: "released" | "pending";

  amount_inr: number;
  allocated_inr: number;
  spent_inr: number;
  remaining_inr: number;

  expected_release: string;
  actual_release: string | null;

  condition_milestone_id: string;
}

export interface CategoryBudget {
  category: string;
  allocated_inr: number;
  spent_inr: number;
  remaining_inr: number;
}