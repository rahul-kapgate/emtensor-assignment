import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  IndianRupee,
  ListChecks,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

import { useOverview } from "@/features/dashboard/use-overview";
import { formatINR } from "@/lib/format";

const clampPercentage = (value: number) => {
  return Math.min(Math.max(value, 0), 100);
};

const formatDate = (value: string) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const formatStatus = (value: string) => {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getMilestoneStatusClass = (status: string) => {
  const normalized = status.toLowerCase();

  if (normalized === "completed") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (
    normalized === "delayed" ||
    normalized === "at_risk"
  ) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
};

const getIssueStyles = (severity: string) => {
  if (severity === "critical") {
    return {
      dot: "bg-red-500",
      badge:
        "border-red-200 bg-red-50 text-red-700",
    };
  }

  if (severity === "warning") {
    return {
      dot: "bg-amber-500",
      badge:
        "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  return {
    dot: "bg-blue-500",
    badge:
      "border-blue-200 bg-blue-50 text-blue-700",
  };
};

function OverviewSkeleton() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-96 max-w-full" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-32 rounded-xl"
          />
        ))}
      </div>

      <Skeleton className="h-24 rounded-xl" />

      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-[420px] rounded-xl" />
        <Skeleton className="h-[420px] rounded-xl" />
      </div>

      <Skeleton className="h-[320px] rounded-xl" />
    </div>
  );
}

export function OverviewPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useOverview();

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="w-full max-w-lg">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <div className="rounded-full bg-red-50 p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Unable to load project overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Check that the FastAPI backend is running and try again.
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Try again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const metrics = [
    {
      label: "Total Grant",
      value: formatINR(
        data.budget.total_grant_inr,
      ),
      description: "Approved programme grant",
      icon: IndianRupee,
    },
    {
      label: "Funds Received",
      value: formatINR(
        data.budget.received_inr,
      ),
      description: `${data.budget.grant_received_pct}% of grant released`,
      icon: WalletCards,
    },
    {
      label: "Total Spent",
      value: formatINR(
        data.budget.spent_inr,
      ),
      description: `${data.budget.allocation_utilization_pct}% of allocations used`,
      icon: CircleDollarSign,
    },
    {
      label: "Project Progress",
      value: `${data.tasks.completion_pct}%`,
      description: `${data.tasks.completed} of ${data.tasks.total} tasks completed`,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-[1600px] space-y-8 p-6 lg:p-8">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Project Intelligence Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 lg:text-3xl">
              {data.project.name}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Overall delivery, funding, milestones and project risks.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock3 className="h-4 w-4" />

            <span>
              Data as of{" "}
              <span className="font-medium text-slate-700">
                {formatDate(
                  data.project.as_of_date,
                )}
              </span>
            </span>
          </div>
        </header>

        {/* KPI Cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <Card key={metric.label}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {metric.label}
                      </p>

                      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                        {metric.value}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {metric.description}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-100 p-2.5">
                      <Icon className="h-5 w-5 text-slate-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Task Summary */}
        <section className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <ListChecks className="h-5 w-5 text-slate-500" />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Total Tasks
                  </p>
                  <p className="text-xl font-semibold text-slate-950">
                    {data.tasks.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Completed
                  </p>
                  <p className="text-xl font-semibold text-slate-950">
                    {data.tasks.completed}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  In Progress
                </p>

                <p className="mt-1 text-xl font-semibold text-slate-950">
                  {data.tasks.in_progress}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Not Started
                </p>

                <p className="mt-1 text-xl font-semibold text-slate-950">
                  {data.tasks.not_started}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Issues Summary */}
        <section>
          <Card className="border-red-200 bg-red-50/60">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-red-100 p-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>

                <div>
                  <p className="font-semibold text-red-950">
                    {data.issues.total} issues require attention
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    Review anomalies that may affect delivery,
                    audit readiness or funding.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Badge className="border border-red-200 bg-white text-red-700 hover:bg-white">
                  {data.issues.critical} critical
                </Badge>

                <Badge className="border border-amber-200 bg-white text-amber-700 hover:bg-white">
                  {data.issues.warning} warnings
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Milestones + Departments */}
        <section className="grid gap-6 xl:grid-cols-2">
          {/* Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Milestones
              </CardTitle>

              <p className="text-sm text-slate-500">
                Reported status compared with actual linked-task completion.
              </p>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {data.milestones.map(
                  (milestone) => {
                    const progress =
                      clampPercentage(
                        milestone.actual_completion_pct,
                      );

                    return (
                      <div
                        key={
                          milestone.milestone_id
                        }
                        className="rounded-xl border border-slate-200 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900">
                              {
                                milestone.milestone_name
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                milestone.milestone_id
                              }{" "}
                              · Due{" "}
                              {formatDate(
                                milestone.due_date,
                              )}
                            </p>
                          </div>

                          <Badge
                            className={`w-fit border ${getMilestoneStatusClass(
                              milestone.reported_status,
                            )}`}
                          >
                            {formatStatus(
                              milestone.reported_status,
                            )}
                          </Badge>
                        </div>

                        <div className="mt-4">
                          <div className="mb-2 flex items-center justify-between text-xs">
                            <span className="text-slate-500">
                              Actual task completion
                            </span>

                            <span className="font-medium text-slate-700">
                              {progress}%
                            </span>
                          </div>

                          <Progress
                            value={progress}
                            className="h-2"
                          />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs text-slate-500">
                            {
                              milestone.completed_task_count
                            }{" "}
                            of{" "}
                            {
                              milestone.linked_task_count
                            }{" "}
                            linked tasks completed
                          </p>

                          {milestone.releases_tranche_id && (
                            <Badge
                              variant="outline"
                              className="text-xs"
                            >
                              Releases{" "}
                              {
                                milestone.releases_tranche_id
                              }
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </CardContent>
          </Card>

          {/* Department Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Department Progress
              </CardTitle>

              <p className="text-sm text-slate-500">
                Delivery status across the programme's eight departments.
              </p>
            </CardHeader>

            <CardContent>
              <div className="space-y-5">
                {data.departments.map(
                  (department) => {
                    const progress =
                      clampPercentage(
                        department.completion_pct,
                      );

                    return (
                      <div
                        key={department.dept_id}
                      >
                        <div className="mb-2 flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="shrink-0"
                              >
                                {department.dept_id}
                              </Badge>

                              <p className="truncate text-sm font-medium text-slate-900">
                                {
                                  department.dept_name
                                }
                              </p>
                            </div>
                          </div>

                          <span className="shrink-0 text-sm font-semibold text-slate-700">
                            {progress}%
                          </span>
                        </div>

                        <Progress
                          value={progress}
                          className="h-2"
                        />

                        <p className="mt-2 text-xs text-slate-500">
                          {department.completed} completed
                          {" · "}
                          {department.in_progress} in progress
                          {" · "}
                          {department.not_started} not started
                        </p>
                      </div>
                    );
                  },
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Top Issues */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base">
                    Issues Requiring Attention
                  </CardTitle>

                  <p className="mt-1 text-sm text-slate-500">
                    Highest-priority anomalies detected from the source data.
                  </p>
                </div>

                <Badge variant="outline">
                  Top {data.issues.top.length}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              {data.issues.top.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />

                  <p className="mt-3 font-medium text-slate-900">
                    No priority issues detected
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    There are currently no high-priority anomalies to review.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {data.issues.top.map(
                    (issue) => {
                      const styles =
                        getIssueStyles(
                          issue.severity,
                        );

                      return (
                        <div
                          key={issue.id}
                          className="flex gap-4 py-4 first:pt-0 last:pb-0"
                        >
                          <span
                            className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`}
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-slate-900">
                                {issue.title}
                              </p>

                              <Badge
                                className={`border text-[10px] uppercase ${styles.badge}`}
                              >
                                {issue.severity}
                              </Badge>

                              <Badge
                                variant="outline"
                                className="text-[10px] uppercase text-slate-500"
                              >
                                {issue.category}
                              </Badge>
                            </div>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {issue.message}
                            </p>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}