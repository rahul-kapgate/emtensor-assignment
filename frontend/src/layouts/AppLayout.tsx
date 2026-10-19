import { NavLink, Outlet } from "react-router-dom";
import {
  AlertTriangle,
  Building2,
  GitBranch,
  LayoutDashboard,
  Users,
  Wallet,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    to: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Departments",
    to: "/departments",
    icon: Building2,
  },
  {
    label: "Dependencies",
    to: "/dependencies",
    icon: GitBranch,
  },
  {
    label: "Budget",
    to: "/budget",
    icon: Wallet,
  },
  {
    label: "People",
    to: "/people",
    icon: Users,
  },
  {
    label: "Issues",
    to: "/issues",
    icon: AlertTriangle,
  },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 w-64 border-r bg-white">
        <div className="border-b px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Project Intelligence
          </p>

          <h1 className="mt-1 font-semibold text-slate-900">
            SHAKTI-1
          </h1>
        </div>

        <nav className="space-y-1 p-3">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4" />

                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className="ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}