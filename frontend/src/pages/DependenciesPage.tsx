import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";

import {
  AlertTriangle,
  Boxes,
  GitBranch,
  Search,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useComponentDependencies,
  useComponentImpact,
  useTaskDependencies,
  useTaskImpact,
} from "@/features/dependencies/use-dependencies";

type DependencyMode =
  | "tasks"
  | "components";

const departmentPositions: Record<
  string,
  number
> = {
  CIV: 0,
  EEE: 1,
  MEC: 2,
  ECE: 3,
  CSE: 4,
  PHY: 5,
  PRC: 6,
  PMO: 7,
};

function formatStatus(
  value: string | null,
) {
  if (!value) {
    return "Unknown";
  }

  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase(),
    );
}

function getStatusStyle(
  status: string | null,
) {
  if (status === "completed") {
    return {
      background:
        "rgb(236 253 245)",
      border:
        "1px solid rgb(167 243 208)",
    };
  }

  if (
    status === "installed" ||
    status === "tested"
  ) {
    return {
      background:
        "rgb(236 253 245)",
      border:
        "1px solid rgb(167 243 208)",
    };
  }

  if (status === "in_progress") {
    return {
      background:
        "rgb(239 246 255)",
      border:
        "1px solid rgb(191 219 254)",
    };
  }

  if (
    status === "delivered" ||
    status === "ordered"
  ) {
    return {
      background:
        "rgb(255 251 235)",
      border:
        "1px solid rgb(253 230 138)",
    };
  }

  return {
    background: "white",
    border:
      "1px solid rgb(226 232 240)",
  };
}

function DependenciesSkeleton() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-14 w-full" />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Skeleton className="h-[650px]" />
        <Skeleton className="h-[650px]" />
      </div>
    </div>
  );
}

export function DependenciesPage() {
  const [
    mode,
    setMode,
  ] =
    useState<DependencyMode>(
      "tasks",
    );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedTaskId,
    setSelectedTaskId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    selectedComponentId,
    setSelectedComponentId,
  ] =
    useState<string | null>(
      null,
    );

  const taskGraph =
    useTaskDependencies();

  const componentGraph =
    useComponentDependencies();

  const taskImpact =
    useTaskImpact(
      selectedTaskId,
    );

  const componentImpact =
    useComponentImpact(
      selectedComponentId,
    );

  const isLoading =
    mode === "tasks"
      ? taskGraph.isLoading
      : componentGraph.isLoading;

  const isError =
    mode === "tasks"
      ? taskGraph.isError
      : componentGraph.isError;

  const taskNodes =
    useMemo<Node[]>(() => {
      if (!taskGraph.data) {
        return [];
      }

      return taskGraph.data.nodes.map(
        (task, index) => {
          const departmentIndex =
            departmentPositions[
              task.dept_id
            ] ?? 0;

          return {
            id: task.id,

            position: {
              x:
                departmentIndex *
                280,
              y:
                (index % 10) *
                110,
            },

            data: {
              label: (
                <div className="w-[190px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                      {task.id}
                    </span>

                    <span className="text-[10px] text-slate-400">
                      {
                        task.dept_id
                      }
                    </span>
                  </div>

                  <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-900">
                    {task.label}
                  </p>

                  <p className="mt-2 text-[10px] text-slate-500">
                    {formatStatus(
                      task.status,
                    )}
                  </p>
                </div>
              ),
            },

            style: {
              ...getStatusStyle(
                task.status,
              ),
              borderRadius:
                "10px",
              padding:
                "10px",
              width: 215,
            },
          };
        },
      );
    }, [taskGraph.data]);

  const taskEdges =
    useMemo<Edge[]>(() => {
      if (!taskGraph.data) {
        return [];
      }

      return taskGraph.data.edges.map(
        (edge, index) => ({
          id: `task-edge-${index}`,
          source: edge.source,
          target: edge.target,

          markerEnd: {
            type:
              MarkerType.ArrowClosed,
          },

          style: {
            strokeWidth: 1.5,
          },
        }),
      );
    }, [taskGraph.data]);

  const componentNodes =
    useMemo<Node[]>(() => {
      if (!componentGraph.data) {
        return [];
      }

      return componentGraph.data.nodes.map(
        (
          component,
          index,
        ) => {
          const departmentIndex =
            departmentPositions[
              component.dept_id
            ] ?? 0;

          return {
            id: component.id,

            position: {
              x:
                departmentIndex *
                280,
              y:
                (index % 10) *
                110,
            },

            data: {
              label: (
                <div className="w-[190px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                      {component.id}
                    </span>

                    <span className="text-[10px] text-slate-400">
                      {
                        component.dept_id
                      }
                    </span>
                  </div>

                  <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-900">
                    {
                      component.label
                    }
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      {formatStatus(
                        component.status,
                      )}
                    </span>

                    <span className="text-[10px] text-slate-400">
                      {
                        component.type
                      }
                    </span>
                  </div>
                </div>
              ),
            },

            style: {
              ...getStatusStyle(
                component.status,
              ),
              borderRadius:
                "10px",
              padding:
                "10px",
              width: 215,
            },
          };
        },
      );
    }, [
      componentGraph.data,
    ]);

  const componentEdges =
    useMemo<Edge[]>(() => {
      if (!componentGraph.data) {
        return [];
      }

      return componentGraph.data.edges.map(
        (edge, index) => ({
          id: `component-edge-${index}`,
          source:
            edge.source,
          target:
            edge.target,

          label:
            edge.dependency_type,

          markerEnd: {
            type:
              MarkerType.ArrowClosed,
          },

          style: {
            strokeWidth: 1.5,
          },

          labelStyle: {
            fontSize: 9,
          },
        }),
      );
    }, [
      componentGraph.data,
    ]);

  const searchResults =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return [];
      }

      if (
        mode === "tasks"
      ) {
        return (
          taskGraph.data?.nodes
            .filter(
              (node) =>
                node.id
                  .toLowerCase()
                  .includes(
                    query,
                  ) ||
                node.label
                  .toLowerCase()
                  .includes(
                    query,
                  ),
            )
            .slice(0, 8) ??
          []
        );
      }

      return (
        componentGraph.data
          ?.nodes
          .filter(
            (node) =>
              node.id
                .toLowerCase()
                .includes(
                  query,
                ) ||
              node.label
                .toLowerCase()
                .includes(
                  query,
                ),
          )
          .slice(0, 8) ??
        []
      );
    }, [
      search,
      mode,
      taskGraph.data,
      componentGraph.data,
    ]);

  const handleSearchSelect = (
    id: string,
  ) => {
    if (
      mode === "tasks"
    ) {
      setSelectedTaskId(
        id,
      );
    } else {
      setSelectedComponentId(
        id,
      );
    }

    setSearch("");
  };

  if (isLoading) {
    return (
      <DependenciesSkeleton />
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Unable to load dependency data.
        </div>
      </div>
    );
  }

  const nodes =
    mode === "tasks"
      ? taskNodes
      : componentNodes;

  const edges =
    mode === "tasks"
      ? taskEdges
      : componentEdges;

  return (
    <div className="mx-auto max-w-[1800px] space-y-6 p-6 lg:p-8">
      {/* Header */}
      <header>
        <p className="text-sm font-medium text-slate-500">
          Delivery Relationships
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Dependencies
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Understand which tasks and
          technical components depend
          on one another and what may
          be affected when something
          slips.
        </p>
      </header>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode(
                    "tasks",
                  );
                  setSearch("");
                }}
                className={[
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
                  mode ===
                  "tasks"
                    ? "bg-slate-900 text-white"
                    : "border bg-white text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                <GitBranch className="h-4 w-4" />

                Task Dependencies
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode(
                    "components",
                  );
                  setSearch("");
                }}
                className={[
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
                  mode ===
                  "components"
                    ? "bg-slate-900 text-white"
                    : "border bg-white text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                <Boxes className="h-4 w-4" />

                Components
              </button>
            </div>

            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={search}
                onChange={(
                  event,
                ) =>
                  setSearch(
                    event.target
                      .value,
                  )
                }
                placeholder={
                  mode === "tasks"
                    ? "Search task ID or name..."
                    : "Search component..."
                }
                className="pl-9"
              />

              {searchResults.length >
                0 && (
                <div className="absolute left-0 right-0 top-12 z-50 max-h-80 overflow-auto rounded-xl border bg-white p-2 shadow-lg">
                  {searchResults.map(
                    (result) => (
                      <button
                        key={
                          result.id
                        }
                        type="button"
                        onClick={() =>
                          handleSearchSelect(
                            result.id,
                          )
                        }
                        className="block w-full rounded-lg px-3 py-2 text-left transition hover:bg-slate-50"
                      >
                        <p className="text-xs font-semibold text-slate-500">
                          {
                            result.id
                          }
                        </p>

                        <p className="mt-1 text-sm text-slate-800">
                          {
                            result.label
                          }
                        </p>
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Graph */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base">
                  {mode ===
                  "tasks"
                    ? "Task Dependency Graph"
                    : "Component Dependency Graph"}
                </CardTitle>

                <p className="mt-1 text-sm text-slate-500">
                  Click a node to
                  inspect downstream
                  impact.
                </p>
              </div>

              <Badge variant="outline">
                {nodes.length} nodes
                {" · "}
                {edges.length} links
              </Badge>
            </div>
          </CardHeader>

          <div className="h-[680px] bg-slate-50">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              minZoom={0.1}
              maxZoom={1.5}
              onNodeClick={(
                _,
                node,
              ) => {
                if (
                  mode ===
                  "tasks"
                ) {
                  setSelectedTaskId(
                    node.id,
                  );
                } else {
                  setSelectedComponentId(
                    node.id,
                  );
                }
              }}
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
        </Card>

        {/* Impact panel */}
        <Card className="h-fit xl:sticky xl:top-6">
          <CardHeader>
            <CardTitle className="text-base">
              Impact Analysis
            </CardTitle>

            <p className="text-sm text-slate-500">
              See what depends on the
              selected item.
            </p>
          </CardHeader>

          <CardContent>
            {mode ===
            "tasks" ? (
              !selectedTaskId ? (
                <EmptyImpact />
              ) : taskImpact.isLoading ? (
                <Skeleton className="h-80" />
              ) : taskImpact.data ? (
                <TaskImpactPanel
                  data={
                    taskImpact.data
                  }
                />
              ) : (
                <ImpactError />
              )
            ) : !selectedComponentId ? (
              <EmptyImpact />
            ) : componentImpact.isLoading ? (
              <Skeleton className="h-80" />
            ) : componentImpact.data ? (
              <ComponentImpactPanel
                data={
                  componentImpact.data
                }
              />
            ) : (
              <ImpactError />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyImpact() {
  return (
    <div className="flex flex-col items-center py-14 text-center">
      <GitBranch className="h-8 w-8 text-slate-300" />

      <p className="mt-4 font-medium text-slate-800">
        Select an item
      </p>

      <p className="mt-1 max-w-64 text-sm leading-6 text-slate-500">
        Click a node in the graph or
        search above to see its
        downstream impact.
      </p>
    </div>
  );
}

function ImpactError() {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 text-red-600" />

        <p className="text-sm text-red-700">
          Unable to load impact
          information.
        </p>
      </div>
    </div>
  );
}

function TaskImpactPanel({
  data,
}: {
  data: import(
    "@/types/dependency"
  ).TaskImpact;
}) {
  return (
    <div>
      <Badge variant="outline">
        {data.task.task_id}
      </Badge>

      <h3 className="mt-3 font-semibold text-slate-950">
        {data.task.task_name}
      </h3>

      <div className="mt-2 flex gap-2">
        <Badge variant="secondary">
          {data.task.dept_id}
        </Badge>

        <Badge variant="outline">
          {formatStatus(
            data.task.status,
          )}
        </Badge>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">
            Downstream tasks
          </p>

          <p className="mt-1 text-xl font-semibold">
            {
              data.downstream_task_count
            }
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">
            Departments
          </p>

          <p className="mt-1 text-xl font-semibold">
            {
              data.impacted_departments
                .length
            }
          </p>
        </div>
      </div>

      {data.impacted_departments
        .length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Departments affected
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {data.impacted_departments.map(
              (dept) => (
                <Badge
                  key={dept}
                  variant="outline"
                >
                  {dept}
                </Badge>
              ),
            )}
          </div>
        </div>
      )}

      {data.impacted_milestones
        .length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Milestones at risk
          </p>

          <div className="mt-2 space-y-2">
            {data.impacted_milestones.map(
              (milestone) => (
                <div
                  key={
                    milestone.milestone_id
                  }
                  className="rounded-lg border p-3"
                >
                  <p className="text-sm font-medium text-slate-800">
                    {
                      milestone.milestone_name
                    }
                  </p>

                  {milestone.releases_tranche_id && (
                    <p className="mt-1 text-xs text-slate-500">
                      Releases{" "}
                      {
                        milestone.releases_tranche_id
                      }
                    </p>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      )}

      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Downstream work
        </p>

        {data.downstream_tasks
          .length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No downstream tasks.
          </p>
        ) : (
          <div className="mt-3 max-h-72 space-y-2 overflow-auto">
            {data.downstream_tasks.map(
              (task) => (
                <div
                  key={task.task_id}
                  className="rounded-lg border p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline">
                      {task.task_id}
                    </Badge>

                    <span className="text-xs text-slate-400">
                      Level{" "}
                      {task.depth}
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-medium text-slate-800">
                    {task.task_name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {task.dept_id}
                    {" · "}
                    {formatStatus(
                      task.status,
                    )}
                  </p>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ComponentImpactPanel({
  data,
}: {
  data: import(
    "@/types/dependency"
  ).ComponentImpact;
}) {
  return (
    <div>
      <Badge variant="outline">
        {
          data.component
            .component_id
        }
      </Badge>

      <h3 className="mt-3 font-semibold text-slate-950">
        {
          data.component
            .component_name
        }
      </h3>

      <div className="mt-2 flex gap-2">
        <Badge variant="secondary">
          {
            data.component
              .dept_id
          }
        </Badge>

        <Badge variant="outline">
          {formatStatus(
            data.component
              .status,
          )}
        </Badge>
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4">
        <p className="text-xs text-slate-500">
          Downstream components
        </p>

        <p className="mt-1 text-2xl font-semibold text-slate-950">
          {
            data.downstream_component_count
          }
        </p>
      </div>

      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Affected components
        </p>

        {data.downstream_components
          .length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            Nothing else depends on
            this component.
          </p>
        ) : (
          <div className="mt-3 max-h-96 space-y-2 overflow-auto">
            {data.downstream_components.map(
              (component) => (
                <div
                  key={
                    component.component_id
                  }
                  className="rounded-lg border p-3"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {
                        component.component_id
                      }
                    </Badge>

                    <span className="text-xs text-slate-400">
                      Level{" "}
                      {
                        component.depth
                      }
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-medium text-slate-800">
                    {
                      component.component_name
                    }
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {
                        component.dept_id
                      }
                    </Badge>

                    <Badge variant="outline">
                      {
                        component.dependency_type
                      }
                    </Badge>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}