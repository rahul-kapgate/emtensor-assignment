export interface ProjectInfo {
  name: string;
  as_of_date: string;
}

export interface TaskSummary {
  total: number;
  completed: number;
  in_progress: number;
  not_started: number;
  unknown: number;
  completion_pct: number;
}

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

export interface MilestoneSummary {
  milestone_id: string;
  milestone_name: string;
  due_date: string;
  reported_status: string;
  releases_tranche_id: string | null;
  linked_task_count: number;
  completed_task_count: number;
  actual_completion_pct: number;
}

export interface DepartmentProgress {
  dept_id: string;
  dept_name: string;
  total_tasks: number;
  completed: number;
  in_progress: number;
  not_started: number;
  completion_pct: number;
}

export interface OverviewIssue {
  id: string;
  severity: string;
  category: string;
  title: string;
  message: string;
}

export interface Overview {
  project: ProjectInfo;
  tasks: TaskSummary;
  budget: BudgetSummary;
  milestones: MilestoneSummary[];
  departments: DepartmentProgress[];

  issues: {
    total: number;
    critical: number;
    warning: number;
    top: OverviewIssue[];
  };
}