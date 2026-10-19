import {
  ArrowRight,
  Building2,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

import { useDepartments } from "@/features/departments/use-departments";
import { formatINR } from "@/lib/format";

function DepartmentsSkeleton() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <Skeleton className="h-8 w-52" />
        <Skeleton className="mt-2 h-4 w-80" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 8 }).map(
          (_, index) => (
            <Skeleton
              key={index}
              className="h-72 rounded-xl"
            />
          ),
        )}
      </div>
    </div>
  );
}

export function DepartmentsPage() {
  const {
    data,
    isLoading,
    isError,
  } = useDepartments();

  if (isLoading) {
    return <DepartmentsSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Unable to load departments.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 lg:p-8">
      <header>
        <p className="text-sm font-medium text-slate-500">
          Workstreams
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Departments
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Review progress, spending, people and delivery
          status across all departments participating in
          SHAKTI-1.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.map((department) => {
          const budget = department.budget;

          return (
            <Card
              key={department.dept_id}
              className="transition hover:border-slate-300 hover:shadow-sm"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-3">
                    <div className="rounded-lg bg-slate-100 p-2.5">
                      <Building2 className="h-5 w-5 text-slate-700" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {department.dept_id}
                        </Badge>
                      </div>

                      <h2 className="mt-2 font-semibold text-slate-950">
                        {department.dept_name}
                      </h2>
                    </div>
                  </div>
                </div>

                <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                  {department.scope}
                </p>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Task completion
                    </span>

                    <span className="font-medium text-slate-800">
                      {department.completion_pct}%
                    </span>
                  </div>

                  <Progress
                    value={Math.min(
                      department.completion_pct,
                      100,
                    )}
                    className="h-2"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    {department.completed_tasks} of{" "}
                    {department.task_count} tasks completed
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      People
                    </p>

                    <div className="mt-1 flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-slate-400" />

                      <span className="text-sm font-medium text-slate-800">
                        {department.people_count}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Spent
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {budget
                        ? formatINR(
                            budget.spent_inr,
                          )
                        : "—"}
                    </p>
                  </div>
                </div>

                {budget && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Budget utilization
                      </span>

                      <span className="font-medium text-slate-700">
                        {budget.utilization_pct}%
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {formatINR(
                          budget.allocated_inr,
                        )}{" "}
                        allocated
                      </span>

                      <span>
                        {formatINR(
                          budget.remaining_inr,
                        )}{" "}
                        remaining
                      </span>
                    </div>
                  </div>
                )}

                <Link
                  to={`/departments/${department.dept_id}`}
                  className="mt-5 flex items-center justify-between rounded-lg border px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                >
                  View department

                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}