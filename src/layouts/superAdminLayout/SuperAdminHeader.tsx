import {
  Bell,
  ChevronDown,
  PanelRightOpen,
  Search,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import adminUserImage from "../../assets/images/download (2).jpg";
import washaLogo from "../../assets/logo/washa-logo-blue.png";
import { useDashboardLayout } from "../DashboardLayoutContext";

const SuperAdminHeader = () => {
  const dashboardLayout = useDashboardLayout();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[52px] w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-5 lg:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/super-admin/dashboard"
            className="flex min-w-0 items-center gap-2"
          >
            <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-md bg-[var(--color-primary)]">
              <img
                src={washaLogo}
                alt="LaundryTrack"
                className="h-5 w-5 object-contain brightness-0 invert"
              />
            </span>
            <span className="truncate text-sm font-semibold text-slate-950">
              LaundryTrack
            </span>
          </Link>
          <span className="hidden rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-[0.68rem] font-medium text-[var(--color-primary)] sm:inline-flex">
            Super Admin
          </span>
        </div>

        <label className="hidden h-9 w-full max-w-[320px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 shadow-sm md:flex">
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <input
            type="search"
            placeholder="Search tenants and users..."
            className="w-full border-0 bg-transparent text-[0.78rem] text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>

        <div className="flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-[var(--color-primary)]"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[0.62rem] font-semibold text-white">
              3
            </span>
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-[var(--color-primary)]"
            aria-label="Super admin settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <img
            src={adminUserImage}
            alt="Super Admin"
            className="h-8 w-8 rounded-full border border-slate-200 object-cover"
          />
          <button
            type="button"
            className="hidden h-8 w-6 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 sm:inline-flex"
            aria-label="Open account menu"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          {dashboardLayout?.hasMobileSidebar && (
            <button
              type="button"
              onClick={dashboardLayout.openMobileSidebar}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] xl:hidden"
              aria-label="Open dashboard sidebar"
            >
              <PanelRightOpen className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
