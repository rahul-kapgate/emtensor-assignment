import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Mail,
  UserRound,
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

import { usePerson } from "@/features/people/use-people";
import { formatINR } from "@/lib/format";

function formatDate(
  value: string | null,
) {
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
}

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

export function PersonDetailPage() {
  const {
    researcherId,
  } = useParams();

  const {
    data,
    isLoading,
    isError,
  } = usePerson(
    researcherId,
  );

  if (isLoading) {
    return (
      <div className="space-y-6 p-6 lg:p-8">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40" />

        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>

        <Skeleton className="h-80" />
      </div>
    );
  }

  if (
    isError ||
    !data
  ) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="font-medium text-slate-900">
              Researcher not found
            </p>

            <Link
              to="/people"
              className="mt-3 inline-block text-sm underline"
            >
              Return to people
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    researcher,
    tasks,
    timesheet,
  } = data;

  return (
    <div className="mx-auto max-w-[1500px] space-y-8 p-6 lg:p-8">
      <Link
        to="/people"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950"
      >
        <ArrowLeft className="h-4 w-4" />
        People
      </Link>

      {/* Profile */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <UserRound className="h-6 w-6 text-slate-600" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold text-slate-950">
                  {researcher.full_name}
                </h1>

                <Badge variant="outline">
                  {
                    researcher.researcher_id
                  }
                </Badge>

                <Badge
                  className={
                    researcher.status ===
                    "active"
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : researcher.status ===
                          "exited"
                        ? "border border-slate-200 bg-slate-100 text-slate-600"
                        : "border border-amber-200 bg-amber-50 text-amber-700"
                  }
                >
                  {formatStatus(
                    researcher.status,
                  )}
                </Badge>
              </div>

              <p className="mt-2 text-sm text-slate-600">
                {researcher.role}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {
                    researcher.email
                  }
                </div>

                <div>
                  Department:{" "}
                  <Badge variant="outline">
                    {
                      researcher.dept_id
                    }
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Joined{" "}
                  {formatDate(
                    researcher.joined_on,
                  )}
                </div>
              </div>

              {researcher.left_on && (
                <p className="mt-3 text-sm text-slate-500">
                  Left project on{" "}
                  {formatDate(
                    researcher.left_on,
                  )}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">
              Project Allocation
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {
                researcher.project_allocation_pct
              }
              %
            </p>

            <Progress
              value={
                researcher.project_allocation_pct
              }
              className="mt-3 h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Monthly Cost
              </p>

              <Wallet className="h-4 w-4 text-slate-400" />
            </div>

            <p className="mt-2 text-2xl font-semibold">
              {formatINR(
                researcher.monthly_cost_inr,
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">
              Tasks Owned
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {tasks.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Logged Hours
              </p>

              <Clock3 className="h-4 w-4 text-slate-400" />
            </div>

            <p className="mt-2 text-2xl font-semibold">
              {
                timesheet.total_hours
              }
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {
                timesheet.entry_count
              }{" "}
              timesheet entries
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Owned Tasks
          </CardTitle>

          <p className="text-sm text-slate-500">
            Work packages assigned to
            this researcher.
          </p>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {tasks.length ===
          0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              No tasks are currently
              owned by this researcher.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Task
                  </TableHead>

                  <TableHead>
                    Department
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead>
                    Planned
                  </TableHead>

                  <TableHead>
                    Actual
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {tasks.map(
                  (task) => (
                    <TableRow
                      key={
                        task.task_id
                      }
                    >
                      <TableCell>
                        <p className="font-medium text-slate-900">
                          {
                            task.task_name
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {
                            task.task_id
                          }
                        </p>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {
                            task.dept_id
                          }
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary">
                          {formatStatus(
                            task.status,
                          )}
                        </Badge>
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-sm text-slate-600">
                        {formatDate(
                          task.planned_start,
                        )}
                        {" → "}
                        {formatDate(
                          task.planned_end,
                        )}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-sm text-slate-600">
                        {task.actual_start
                          ? `${formatDate(
                              task.actual_start,
                            )} → ${formatDate(
                              task.actual_end,
                            )}`
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}