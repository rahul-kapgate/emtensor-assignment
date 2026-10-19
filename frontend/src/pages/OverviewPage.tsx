import { AlertTriangle } from "lucide-react";

import { useOverview } from "@/features/dashboard/use-overview";
import { formatINR } from "@/lib/format";

export function OverviewPage() {
  const {
    data,
    isLoading,
    isError,
  } = useOverview();

  if (isLoading) {
    return (
      <div className="p-8">
        Loading project overview...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-8 text-red-600">
        Unable to load project overview.
      </div>
    );
  }

  const metrics = [
    {
      label: "Total Grant",
      value: formatINR(
        data.budget.total_grant_inr
      ),
    },
    {
      label: "Funds Received",
      value: formatINR(
        data.budget.received_inr
      ),
    },
    {
      label: "Spent",
      value: formatINR(
        data.budget.spent_inr
      ),
    },
    {
      label: "Project Progress",
      value: `${data.tasks.completion_pct}%`,
    },
  ];

  return (
    <div className="p-8">
      <header>
        <p className="text-sm text-slate-500">
          As of {data.project.as_of_date}
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-slate-950">
          {data.project.name}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Project health and funding overview
        </p>
      </header>

      <div className="mt-8 grid grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border bg-white p-5"
          >
            <p className="text-sm text-slate-500">
              {metric.label}
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />

          <div>
            <p className="font-semibold text-red-900">
              {data.issues.total} issues require attention
            </p>

            <p className="text-sm text-red-700">
              {data.issues.critical} critical ·{" "}
              {data.issues.warning} warnings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}