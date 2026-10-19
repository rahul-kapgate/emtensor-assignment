import {
  CircleDollarSign,
  IndianRupee,
  Layers3,
  Landmark,
  WalletCards,
} from "lucide-react";

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

import { useBudget } from "@/features/budget/use-budget";
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

function formatCategory(
  value: string,
) {
  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

function BudgetSkeleton() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <Skeleton
              key={index}
              className="h-32 rounded-xl"
            />
          ),
        )}
      </div>

      <Skeleton className="h-96" />
      <Skeleton className="h-80" />
    </div>
  );
}

export function BudgetPage() {
  const {
    summary,
    departments,
    tranches,
    categories,
  } = useBudget();

  const isLoading =
    summary.isLoading ||
    departments.isLoading ||
    tranches.isLoading ||
    categories.isLoading;

  const isError =
    summary.isError ||
    departments.isError ||
    tranches.isError ||
    categories.isError;

  if (isLoading) {
    return <BudgetSkeleton />;
  }

  if (
    isError ||
    !summary.data ||
    !departments.data ||
    !tranches.data ||
    !categories.data
  ) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Unable to load budget information.
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: "Total Grant",
      value: formatINR(
        summary.data.total_grant_inr,
      ),
      description:
        "Approved programme funding",
      icon: Landmark,
    },
    {
      label: "Funds Received",
      value: formatINR(
        summary.data.received_inr,
      ),
      description: `${summary.data.grant_received_pct}% of total grant released`,
      icon: WalletCards,
    },
    {
      label: "Allocated",
      value: formatINR(
        summary.data.allocated_inr,
      ),
      description:
        "Assigned to departments and categories",
      icon: Layers3,
    },
    {
      label: "Spent",
      value: formatINR(
        summary.data.spent_inr,
      ),
      description: `${summary.data.allocation_utilization_pct}% of allocated funds used`,
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 lg:p-8">
      {/* Header */}
      <header>
        <p className="text-sm font-medium text-slate-500">
          Financial Oversight
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Budget & Funding
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Track grant releases, department allocations,
          expenditures and remaining funds.
        </p>
      </header>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">
                      {metric.label}
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-slate-950">
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

      {/* Funding health */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">
              Unallocated Grant
            </p>

            <p className="mt-2 text-xl font-semibold">
              {formatINR(
                summary.data.unallocated_inr,
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">
              Unspent Allocations
            </p>

            <p className="mt-2 text-xl font-semibold">
              {formatINR(
                summary.data.unspent_allocated_inr,
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">
              Released Funds Remaining
            </p>

            <p className="mt-2 text-xl font-semibold">
              {formatINR(
                summary.data.received_remaining_inr,
              )}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Tranches */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Funding Tranches
          </CardTitle>

          <p className="text-sm text-slate-500">
            Government funding releases and their
            associated milestones.
          </p>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Tranche
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Amount
                </TableHead>

                <TableHead>
                  Allocated
                </TableHead>

                <TableHead>
                  Spent
                </TableHead>

                <TableHead>
                  Expected
                </TableHead>

                <TableHead>
                  Actual
                </TableHead>

                <TableHead>
                  Milestone
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {tranches.data.map(
                (tranche) => (
                  <TableRow
                    key={
                      tranche.tranche_id
                    }
                  >
                    <TableCell className="font-medium">
                      {
                        tranche.tranche_id
                      }
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={
                          tranche.status ===
                          "released"
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border border-amber-200 bg-amber-50 text-amber-700"
                        }
                      >
                        {
                          tranche.status
                        }
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {formatINR(
                        tranche.amount_inr,
                      )}
                    </TableCell>

                    <TableCell>
                      {formatINR(
                        tranche.allocated_inr,
                      )}
                    </TableCell>

                    <TableCell>
                      {formatINR(
                        tranche.spent_inr,
                      )}
                    </TableCell>

                    <TableCell>
                      {formatDate(
                        tranche.expected_release,
                      )}
                    </TableCell>

                    <TableCell>
                      {formatDate(
                        tranche.actual_release,
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">
                        {
                          tranche.condition_milestone_id
                        }
                      </Badge>
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Department budgets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Department Utilization
          </CardTitle>

          <p className="text-sm text-slate-500">
            Allocation and expenditure across
            participating departments.
          </p>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {departments.data.map(
              (department) => (
                <div
                  key={
                    department.dept_id
                  }
                >
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {
                          department.dept_name
                        }
                      </p>

                      <p className="text-xs text-slate-500">
                        {
                          department.dept_id
                        }
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium text-slate-900">
                        {formatINR(
                          department.spent_inr,
                        )}
                      </p>

                      <p className="text-xs text-slate-500">
                        of{" "}
                        {formatINR(
                          department.allocated_inr,
                        )}
                      </p>
                    </div>
                  </div>

                  <Progress
                    value={Math.min(
                      Math.max(
                        department.utilization_pct,
                        0,
                      ),
                      100,
                    )}
                    className="h-2"
                  />

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {
                        department.utilization_pct
                      }
                      % utilized
                    </span>

                    <span>
                      {formatINR(
                        department.remaining_inr,
                      )}{" "}
                      remaining
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Spending by Category
          </CardTitle>

          <p className="text-sm text-slate-500">
            Compare allocations and expenditure across
            cost categories.
          </p>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Category
                </TableHead>

                <TableHead>
                  Allocated
                </TableHead>

                <TableHead>
                  Spent
                </TableHead>

                <TableHead>
                  Remaining
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {categories.data.map(
                (category) => (
                  <TableRow
                    key={
                      category.category
                    }
                  >
                    <TableCell className="font-medium">
                      {formatCategory(
                        category.category,
                      )}
                    </TableCell>

                    <TableCell>
                      {formatINR(
                        category.allocated_inr,
                      )}
                    </TableCell>

                    <TableCell>
                      {formatINR(
                        category.spent_inr,
                      )}
                    </TableCell>

                    <TableCell>
                      {formatINR(
                        category.remaining_inr,
                      )}
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}