import BussinessInformation from "../components/common/BussinessInformation.jsx";
import Card from "../components/Card";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  LayoutGrid,
  OctagonAlert,
  Package,
  Settings,
  UsersRound,
} from "lucide-react";

const navigationItems = [
  { label: "Dashboard", href: "/admin/dashboard", Icon: LayoutGrid },
  { label: "All Orders", href: "/admin/orders", Icon: Package },
  { label: "Disputes", href: "/admin/disputes", Icon: OctagonAlert },
  { label: "Performance Analytics", href: "/admin/analytics", Icon: BarChart3 },
  { label: "Staff Management", Icon: UsersRound },
  { label: "System Settings", Icon: Settings },
];

const ranges = [
  { key: "today", label: "Today" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
  { key: "custom", label: "Custom Range", fullWidth: true },
];

const AdminSidebar = ({
  activeRange = "today",
  className = "",
  onNavigate,
  onRangeChange,
}) => {
  const location = useLocation();

  return (
    <aside className={`w-full space-y-4 ${className}`}>
      <div>
        <h2 className="text-[0.82rem] font-semibold text-slate-900">
          Navigation
        </h2>

        <div className="mt-3 space-y-1">
          {navigationItems.map((item) => {
            const isActive = item.href && location.pathname === item.href;
            const itemClassName = `flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
              isActive
                ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "text-slate-600 hover:bg-slate-50"
            }`;

            if (!item.href) {
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`${itemClassName} cursor-not-allowed opacity-60`}
                  disabled
                >
                  <item.Icon className="h-3.5 w-3.5" />
                  <span className="text-[0.76rem] font-medium">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={onNavigate}
                className={itemClassName}
              >
                <item.Icon className="h-3.5 w-3.5" />
                <span className="text-[0.76rem] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <Card className="rounded-[1.1rem] border-slate-100 p-4 shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
        <h2 className="text-[0.82rem] font-semibold text-slate-900">
          Date Range
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {ranges.map((range) => {
            const isRangeActive = activeRange === range.key;

            return (
              <button
                key={range.key}
                type="button"
                onClick={() => onRangeChange?.(range.key)}
                className={`rounded-xl px-3 py-2 text-[0.76rem] font-medium transition-colors ${
                  isRangeActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-slate-100 text-slate-600"
                } ${
                  range.fullWidth && !isRangeActive
                    ? "col-span-2 border border-slate-200 bg-white"
                    : range.fullWidth
                      ? "col-span-2"
                      : ""
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </Card>

      <BussinessInformation />
    </aside>
  );
};

export default AdminSidebar;
