export interface TaskDependencyNode {
  id: string;
  label: string;
  dept_id: string;
  status: string | null;

  planned_start: string | null;
  planned_end: string | null;
  actual_start: string | null;
  actual_end: string | null;
}

export interface TaskDependencyEdge {
  source: string;
  target: string;
  type: string;
  lag_days: number;
}

export interface TaskDependencyGraph {
  nodes: TaskDependencyNode[];
  edges: TaskDependencyEdge[];
}

export interface ComponentDependencyNode {
  id: string;
  label: string;
  type: string;
  status: string;
  dept_id: string;
}

export interface ComponentDependencyEdge {
  source: string;
  target: string;
  dependency_type: string;
}

export interface ComponentDependencyGraph {
  nodes: ComponentDependencyNode[];
  edges: ComponentDependencyEdge[];
}

export interface TaskImpactItem {
  task_id: string;
  task_name: string;
  dept_id: string;
  status: string | null;
  depth: number;
}

export interface ImpactedMilestone {
  milestone_id: string;
  milestone_name: string;
  due_date: string;
  reported_status: string;
  releases_tranche_id: string | null;
}

export interface TaskImpact {
  task: {
    task_id: string;
    task_name: string;
    dept_id: string;
    status: string | null;
  };

  downstream_task_count: number;

  impacted_departments: string[];

  impacted_milestones: ImpactedMilestone[];

  downstream_tasks: TaskImpactItem[];
}

export interface ComponentImpactItem {
  component_id: string;
  component_name: string;
  dept_id: string;
  status: string;
  dependency_type: string;
  depth: number;
}

export interface ComponentImpact {
  component: {
    component_id: string;
    component_name: string;
    dept_id: string;
    status: string;
  };

  downstream_component_count: number;

  downstream_components: ComponentImpactItem[];
}