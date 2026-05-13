import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Building2,
  CircleHelp,
  LayoutDashboard,
  Settings,
} from "lucide-react";

const navigationItems = [
  { label: "Dashboard", href: "/super-admin/dashboard", Icon: LayoutDashboard },
  { label: "Tenant Management", href: "/super-admin/tenants", Icon: Building2 },
  { label: "System Analytics", href: "/super-admin/analytics", Icon: BarChart3 },
  { label: "Platform Settings", href: "/super-admin/settings", Icon: Settings },
  { label: "System Health", href: "/super-admin/health", Icon: Activity },
  { label: "Support & Documentation", href: "/super-admin/support", Icon: CircleHelp },
];

const SuperAdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden w-[280px] shrink-0 border-r border-slate-100 bg-[var(--color-surface)] px-6 py-7 lg:block">
      <nav className="space-y-3">
        {navigationItems.map(({ label, href, Icon }) => {
          const isActive =
            location.pathname === href ||
            (href === "/super-admin/dashboard" && location.pathname === "/super-admin");

          return (
            <Link
              key={label}
              to={href}
              className={`flex min-h-14 items-center gap-4 rounded-xl px-5 py-3 text-[1rem] font-bold transition-colors ${
                isActive
                  ? "bg-[var(--color-primary)] text-white shadow-sm"
                  : "text-slate-900 hover:bg-white hover:text-[var(--color-primary)]"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="leading-snug">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default SuperAdminSidebar;
