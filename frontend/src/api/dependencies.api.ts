import { api } from "@/lib/api";

import type {
  ComponentDependencyGraph,
  ComponentImpact,
  TaskDependencyGraph,
  TaskImpact,
} from "@/types/dependency";

export async function getTaskDependencies() {
  const response =
    await api.get<TaskDependencyGraph>(
      "/dependencies/tasks",
    );

  return response.data;
}

export async function getComponentDependencies() {
  const response =
    await api.get<ComponentDependencyGraph>(
      "/dependencies/components",
    );

  return response.data;
}

export async function getTaskImpact(
  taskId: string,
) {
  const response =
    await api.get<TaskImpact>(
      `/dependencies/tasks/${taskId}/impact`,
    );

  return response.data;
}

export async function getComponentImpact(
  componentId: string,
) {
  const response =
    await api.get<ComponentImpact>(
      `/dependencies/components/${componentId}/impact`,
    );

  return response.data;
}