export interface DepartmentBudget {
  dept_id: string;
  dept_name: string;
  budget_inr: number;
  allocated_inr: number;
  spent_inr: number;
  remaining_inr: number;
  utilization_pct: number;
}

export interface DepartmentSummary {
  dept_id: string;
  dept_name: string;
  scope: string;
  head_researcher_id: string;

  people_count: number;

  task_count: number;
  completed_tasks: number;
  completion_pct: number;

  budget: DepartmentBudget | null;
}

export interface DepartmentTask {
  task_id: string;
  task_name: string;

  status:
    | "completed"
    | "in_progress"
    | "not_started"
    | null;

  owner_researcher_id: string;

  planned_start: string | null;
  planned_end: string | null;

  actual_start: string | null;
  actual_end: string | null;
}

export interface DepartmentPerson {
  researcher_id: string;
  full_name: string;
  role: string;
  allocation_pct: number;
  status: string;
}

export interface DepartmentDetail {
  department: {
    dept_id: string;
    dept_name: string;
    scope: string;
    total_budget_inr: number;
    head_researcher_id: string;
  };

  task_summary: {
    total: number;
    completed: number;
    in_progress: number;
    not_started: number;
    completion_pct: number;
  };

  budget: {
    allocated_inr: number;
    spent_inr: number;
    remaining_inr: number;
  };

  tasks: DepartmentTask[];

  people: DepartmentPerson[];
}