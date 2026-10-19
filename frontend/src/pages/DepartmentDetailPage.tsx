import {
  ArrowLeft,
  CalendarDays,
  Users,
  Wallet,
} from "lucide-react";
import {
  Link,
  useParams,
} from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useDepartment } from "@/features/departments/use-departments";
import { formatINR } from "@/lib/format";

const formatDate = (
  value: string | null,
) => {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(value));
};

const formatStatus = (
  status: string | null,
) => {
  if (!status) {
    return "Unknown";
  }

  return status
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
};

const getTaskBadgeClass = (
  status: string | null,
) => {
  if (status === "completed") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "in_progress") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (status === "not_started") {
    return "border-slate-200 bg-slate-50 text-slate-600";
  }

  return "";
};

export function DepartmentDetailPage() {
  const { deptId } = useParams();

  const {
    data,
    isLoading,
    isError,
  } = useDepartment(deptId);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6 lg:p-8">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-20 w-full" />

        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-28"
            />
          ))}
        </div>

        <Skeleton className="h-96" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="font-medium text-slate-900">
              Department not found
            </p>

            <Link
              to="/departments"
              className="mt-3 inline-block text-sm text-slate-600 underline"
            >
              Return to departments
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    department,
    task_summary,
    budget,
    tasks,
    people,
  } = data;

  const budgetUtilization =
    budget.allocated_inr > 0
      ? Math.round(
          (budget.spent_inr /
            budget.allocated_inr) *
            10000,
        ) / 100
      : 0;

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 lg:p-8">
      <Link
        to="/departments"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Departments
      </Link>

      <header>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {department.dept_id}
          </Badge>
        </div>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 lg:text-3xl">
          {department.dept_name}
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          {department.scope}
        </p>
      </header>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">
              Task Progress
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {task_summary.completion_pct}%
            </p>

            <Progress
              value={task_summary.completion_pct}
              className="mt-3 h-2"
            />

            <p className="mt-2 text-xs text-slate-500">
              {task_summary.completed} of{" "}
              {task_summary.total} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Allocated
              </p>

              <Wallet className="h-4 w-4 text-slate-400" />
            </div>

            <p className="mt-2 text-2xl font-semibold">
              {formatINR(
                budget.allocated_inr,
              )}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Department funding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">
              Spent
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {formatINR(
                budget.spent_inr,
              )}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {budgetUtilization}% utilized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Team
              </p>

              <Users className="h-4 w-4 text-slate-400" />
            </div>

            <p className="mt-2 text-2xl font-semibold">
              {people.length}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Project members
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Task Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Task Status
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                Completed
              </p>

              <p className="mt-2 text-2xl font-semibold text-emerald-950">
                {task_summary.completed}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
                In Progress
              </p>

              <p className="mt-2 text-2xl font-semibold text-blue-950">
                {task_summary.in_progress}
              </p>
            </div>

            <div className="rounded-lg bg-slate-100 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
                Not Started
              </p>

              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {task_summary.not_started}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Department Tasks
          </CardTitle>

          <p className="text-sm text-slate-500">
            Planned and actual delivery dates for this workstream.
          </p>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Planned</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>Owner</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.task_id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">
                        {task.task_name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {task.task_id}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`border ${getTaskBadgeClass(
                        task.status,
                      )}`}
                    >
                      {formatStatus(
                        task.status,
                      )}
                    </Badge>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <CalendarDays className="h-3.5 w-3.5" />

                      {formatDate(
                        task.planned_start,
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      to{" "}
                      {formatDate(
                        task.planned_end,
                      )}
                    </p>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-sm text-slate-600">
                    {task.actual_start ? (
                      <>
                        {formatDate(
                          task.actual_start,
                        )}

                        <p className="mt-1 text-xs text-slate-400">
                          to{" "}
                          {formatDate(
                            task.actual_end,
                          )}
                        </p>
                      </>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  <TableCell className="text-sm text-slate-600">
                    {task.owner_researcher_id}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* People */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Department Team
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Allocation</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {people.map((person) => (
                <TableRow
                  key={
                    person.researcher_id
                  }
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">
                        {person.full_name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {
                          person.researcher_id
                        }
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    {person.role}
                  </TableCell>

                  <TableCell>
                    {
                      person.allocation_pct
                    }
                    %
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="capitalize"
                    >
                      {person.status.replace(
                        "_",
                        " ",
                      )}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}