export interface Person {
  researcher_id: string;
  full_name: string;
  dept_id: string;
  role: string;
  email: string;

  project_allocation_pct: number;
  monthly_cost_inr: number;

  joined_on: string;
  left_on: string | null;

  status: string;
}

export interface PersonTask {
  task_id: string;
  task_name: string;
  dept_id: string;

  status:
    | "completed"
    | "in_progress"
    | "not_started"
    | null;

  planned_start: string | null;
  planned_end: string | null;

  actual_start: string | null;
  actual_end: string | null;
}

export interface PersonDetail {
  researcher: Person;

  tasks: PersonTask[];

  timesheet: {
    entry_count: number;
    total_hours: number;
  };
}