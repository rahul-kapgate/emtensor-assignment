import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Cpu,
  Filter,
  Flag,
  Search,
  TimerReset,
  UserRound,
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

import { useAnomalies } from "@/features/anomalies/use-anomalies";

import type {
  AnomalyCategory,
  AnomalySeverity,
} from "@/types/anomaly";

const severityOptions = [
  "all",
  "critical",
  "warning",
  "info",
] as const;

const categoryOptions = [
  "all",
  "finance",
  "people",
  "task",
  "component",
  "timesheet",
  "milestone",
] as const;

type SeverityFilter =
  | "all"
  | AnomalySeverity;

type CategoryFilter =
  | "all"
  | AnomalyCategory;

const severityStyles: Record<
  AnomalySeverity,
  string
> = {
  critical:
    "border-red-200 bg-red-50 text-red-700",
  warning:
    "border-amber-200 bg-amber-50 text-amber-700",
  info:
    "border-blue-200 bg-blue-50 text-blue-700",
};

const categoryIcons = {
  finance: CircleDollarSign,
  people: UserRound,
  task: Flag,
  component: Cpu,
  timesheet: TimerReset,
  milestone: CheckCircle2,
};

function formatCategory(
  value: string,
) {
  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase(),
    );
}

function IssuesSkeleton() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({
          length: 3,
        }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-28 rounded-xl"
          />
        ))}
      </div>

      <Skeleton className="h-16" />

      {Array.from({
        length: 5,
      }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-40 rounded-xl"
        />
      ))}
    </div>
  );
}

export function IssuesPage() {
  const {
    anomalies,
    summary,
  } = useAnomalies();

  const [
    severityFilter,
    setSeverityFilter,
  ] =
    useState<SeverityFilter>(
      "all",
    );

  const [
    categoryFilter,
    setCategoryFilter,
  ] =
    useState<CategoryFilter>(
      "all",
    );

  const [
    search,
    setSearch,
  ] = useState("");

  const isLoading =
    anomalies.isLoading ||
    summary.isLoading;

  const isError =
    anomalies.isError ||
    summary.isError;

  const filteredAnomalies =
    useMemo(() => {
      if (!anomalies.data) {
        return [];
      }

      const query =
        search
          .trim()
          .toLowerCase();

      return anomalies.data.filter(
        (item) => {
          const severityMatches =
            severityFilter ===
              "all" ||
            item.severity ===
              severityFilter;

          const categoryMatches =
            categoryFilter ===
              "all" ||
            item.category ===
              categoryFilter;

          const searchMatches =
            !query ||
            item.title
              .toLowerCase()
              .includes(query) ||
            item.message
              .toLowerCase()
              .includes(query) ||
            item.rule
              .toLowerCase()
              .includes(query) ||
            item.record_id
              ?.toLowerCase()
              .includes(query) ||
            item.related_record_id
              ?.toLowerCase()
              .includes(query);

          return (
            severityMatches &&
            categoryMatches &&
            searchMatches
          );
        },
      );
    }, [
      anomalies.data,
      severityFilter,
      categoryFilter,
      search,
    ]);

  if (isLoading) {
    return <IssuesSkeleton />;
  }

  if (
    isError ||
    !anomalies.data ||
    !summary.data
  ) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Unable to load project issues.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 lg:p-8">
      {/* Header */}
      <header>
        <p className="text-sm font-medium text-slate-500">
          Data & Project Risk
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Issues & Anomalies
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Records that break project
          rules or may require review
          before the next delivery or
          funding decision.
        </p>
      </header>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2.5">
                <AlertCircle className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Total Issues
                </p>

                <p className="text-2xl font-semibold text-slate-950">
                  {
                    summary.data
                      .total
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-50 p-2.5">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Critical
                </p>

                <p className="text-2xl font-semibold text-red-700">
                  {
                    summary.data
                      .critical
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 p-2.5">
                <Flag className="h-5 w-5 text-amber-600" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Warnings
                </p>

                <p className="text-2xl font-semibold text-amber-700">
                  {
                    summary.data
                      .warning
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Category summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Issues by Category
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(
              summary.data
                .by_category,
            ).map(
              ([
                category,
                count,
              ]) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setCategoryFilter(
                      category as CategoryFilter,
                    )
                  }
                  className="rounded-lg border bg-white px-3 py-2 text-sm transition hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-800">
                    {formatCategory(
                      category,
                    )}
                  </span>

                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {count}
                  </span>
                </button>
              ),
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target
                      .value,
                  )
                }
                placeholder="Search issues, records or rule codes..."
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />

              {severityOptions.map(
                (severity) => (
                  <button
                    key={severity}
                    type="button"
                    onClick={() =>
                      setSeverityFilter(
                        severity,
                      )
                    }
                    className={[
                      "rounded-lg border px-3 py-2 text-xs font-medium capitalize transition",
                      severityFilter ===
                      severity
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {severity}
                  </button>
                ),
              )}
            </div>

            <select
              value={
                categoryFilter
              }
              onChange={(event) =>
                setCategoryFilter(
                  event.target
                    .value as CategoryFilter,
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
            >
              {categoryOptions.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {formatCategory(
                      category,
                    )}
                  </option>
                ),
              )}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-800">
            {
              filteredAnomalies.length
            }
          </span>{" "}
          of{" "}
          {
            anomalies.data
              .length
          }{" "}
          issues
        </p>

        {(severityFilter !==
          "all" ||
          categoryFilter !==
            "all" ||
          search) && (
          <button
            type="button"
            onClick={() => {
              setSeverityFilter(
                "all",
              );
              setCategoryFilter(
                "all",
              );
              setSearch("");
            }}
            className="text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Issues list */}
      <section className="space-y-4">
        {filteredAnomalies.length ===
        0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-12 text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />

              <p className="mt-3 font-medium text-slate-900">
                No matching issues
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try changing the
                current filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAnomalies.map(
            (issue) => {
              const Icon =
                categoryIcons[
                  issue.category
                ];

              return (
                <Card
                  key={issue.id}
                  className={
                    issue.severity ===
                    "critical"
                      ? "border-l-4 border-l-red-500"
                      : issue.severity ===
                          "warning"
                        ? "border-l-4 border-l-amber-500"
                        : "border-l-4 border-l-blue-500"
                  }
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="rounded-lg bg-slate-100 p-2.5">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold text-slate-950">
                            {
                              issue.title
                            }
                          </h2>

                          <Badge
                            className={`border ${
                              severityStyles[
                                issue
                                  .severity
                              ]
                            }`}
                          >
                            {
                              issue.severity
                            }
                          </Badge>

                          <Badge variant="outline">
                            {
                              issue.category
                            }
                          </Badge>

                          <Badge variant="secondary">
                            {
                              issue.rule
                            }
                          </Badge>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {
                            issue.message
                          }
                        </p>

                        {(issue.record_id ||
                          issue.related_record_id) && (
                          <div className="mt-4 flex flex-wrap gap-2 text-xs">
                            {issue.record_id && (
                              <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600">
                                Record:{" "}
                                {
                                  issue.record_id
                                }
                              </span>
                            )}

                            {issue.related_record_id && (
                              <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600">
                                Related:{" "}
                                {
                                  issue.related_record_id
                                }
                              </span>
                            )}
                          </div>
                        )}

                        {issue.recommendation && (
                          <div className="mt-4 rounded-lg bg-slate-50 p-3">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                              Recommended
                              action
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                              {
                                issue.recommendation
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            },
          )
        )}
      </section>
    </div>
  );
}