import { useQuery } from "@tanstack/react-query";

import {
  getComponentDependencies,
  getComponentImpact,
  getTaskDependencies,
  getTaskImpact,
} from "@/api/dependencies.api";

export function useTaskDependencies() {
  return useQuery({
    queryKey: ["dependencies", "tasks"],
    queryFn: getTaskDependencies,
  });
}

export function useComponentDependencies() {
  return useQuery({
    queryKey: [
      "dependencies",
      "components",
    ],
    queryFn: getComponentDependencies,
  });
}

export function useTaskImpact(
  taskId: string | null,
) {
  return useQuery({
    queryKey: [
      "dependencies",
      "task-impact",
      taskId,
    ],

    queryFn: () =>
      getTaskImpact(taskId!),

    enabled: Boolean(taskId),
  });
}

export function useComponentImpact(
  componentId: string | null,
) {
  return useQuery({
    queryKey: [
      "dependencies",
      "component-impact",
      componentId,
    ],

    queryFn: () =>
      getComponentImpact(
        componentId!,
      ),

    enabled: Boolean(componentId),
  });
}