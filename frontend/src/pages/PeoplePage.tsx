import {
  ArrowRight,
  Search,
  UserRound,
  Users,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

import { usePeople } from "@/features/people/use-people";
import { formatINR } from "@/lib/format";

function formatStatus(
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

function PeopleSkeleton() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-[600px] w-full" />
    </div>
  );
}

export function PeoplePage() {
  const {
    data,
    isLoading,
    isError,
  } = usePeople();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    department,
    setDepartment,
  ] = useState("all");

  const [
    status,
    setStatus,
  ] = useState("all");

  const departments =
    useMemo(() => {
      if (!data) {
        return [];
      }

      return [
        ...new Set(
          data.map(
            (person) =>
              person.dept_id,
          ),
        ),
      ].sort();
    }, [data]);

  const filteredPeople =
    useMemo(() => {
      if (!data) {
        return [];
      }

      const query =
        search
          .trim()
          .toLowerCase();

      return data.filter(
        (person) => {
          const matchesSearch =
            !query ||
            person.full_name
              .toLowerCase()
              .includes(query) ||
            person.researcher_id
              .toLowerCase()
              .includes(query) ||
            person.email
              .toLowerCase()
              .includes(query) ||
            person.role
              .toLowerCase()
              .includes(query);

          const matchesDepartment =
            department === "all" ||
            person.dept_id ===
              department;

          const matchesStatus =
            status === "all" ||
            person.status ===
              status;

          return (
            matchesSearch &&
            matchesDepartment &&
            matchesStatus
          );
        },
      );
    }, [
      data,
      search,
      department,
      status,
    ]);

  if (isLoading) {
    return <PeopleSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Unable to load project people.
        </div>
      </div>
    );
  }

  const activeCount =
    data.filter(
      (person) =>
        person.status ===
        "active",
    ).length;

  const exitedCount =
    data.filter(
      (person) =>
        person.status ===
        "exited",
    ).length;

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 lg:p-8">
      {/* Header */}
      <header>
        <p className="text-sm font-medium text-slate-500">
          Project Workforce
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          People
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Researchers and project staff
          across all departments, including
          allocation, role and employment
          status.
        </p>
      </header>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2.5">
                <Users className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Total People
                </p>

                <p className="text-2xl font-semibold text-slate-950">
                  {data.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">
              Active
            </p>

            <p className="mt-2 text-2xl font-semibold text-emerald-700">
              {activeCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">
              Exited
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-700">
              {exitedCount}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
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
                placeholder="Search name, ID, email or role..."
                className="pl-9"
              />
            </div>

            <select
              value={department}
              onChange={(event) =>
                setDepartment(
                  event.target
                    .value,
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
            >
              <option value="all">
                All departments
              </option>

              {departments.map(
                (dept) => (
                  <option
                    key={dept}
                    value={dept}
                  >
                    {dept}
                  </option>
                ),
              )}
            </select>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target
                    .value,
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
            >
              <option value="all">
                All statuses
              </option>

              <option value="active">
                Active
              </option>

              <option value="on_leave">
                On leave
              </option>

              <option value="exited">
                Exited
              </option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-800">
            {filteredPeople.length}
          </span>{" "}
          of {data.length} people
        </p>

        {(search ||
          department !== "all" ||
          status !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setDepartment(
                "all",
              );
              setStatus("all");
            }}
            className="text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* People table */}
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Researcher
                </TableHead>

                <TableHead>
                  Department
                </TableHead>

                <TableHead>
                  Role
                </TableHead>

                <TableHead>
                  Allocation
                </TableHead>

                <TableHead>
                  Monthly Cost
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredPeople.map(
                (person) => (
                  <TableRow
                    key={
                      person.researcher_id
                    }
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                          <UserRound className="h-4 w-4 text-slate-500" />
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {
                              person.full_name
                            }
                          </p>

                          <p className="text-xs text-slate-500">
                            {
                              person.researcher_id
                            }
                            {" · "}
                            {person.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">
                        {
                          person.dept_id
                        }
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm text-slate-600">
                      {person.role}
                    </TableCell>

                    <TableCell>
                      <div className="w-32">
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-slate-500">
                            Project
                          </span>

                          <span className="font-medium text-slate-700">
                            {
                              person.project_allocation_pct
                            }
                            %
                          </span>
                        </div>

                        <Progress
                          value={
                            person.project_allocation_pct
                          }
                          className="h-1.5"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="font-medium text-slate-700">
                      {formatINR(
                        person.monthly_cost_inr,
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={
                          person.status ===
                          "active"
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                            : person.status ===
                                "exited"
                              ? "border border-slate-200 bg-slate-100 text-slate-600"
                              : "border border-amber-200 bg-amber-50 text-amber-700"
                        }
                      >
                        {formatStatus(
                          person.status,
                        )}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Link
                        to={`/people/${person.researcher_id}`}
                        aria-label={`View ${person.full_name}`}
                        className="inline-flex rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>

          {filteredPeople.length ===
            0 && (
            <div className="py-16 text-center">
              <UserRound className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 font-medium text-slate-800">
                No people found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your
                search or filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}