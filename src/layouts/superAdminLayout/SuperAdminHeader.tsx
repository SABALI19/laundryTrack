import { Bell, ChevronDown, Search, Settings, Sparkles } from "lucide-react";
import avatarImage from "../../assets/images/download (2).jpg";

const SuperAdminHeader = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-[var(--color-surface)]">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <h1 className="truncate text-xl font-bold text-slate-900">LaundryTrack</h1>
          <span className="hidden rounded-full bg-[var(--color-primary-soft)] px-4 py-2 text-sm font-bold text-[var(--color-primary)] sm:inline-flex">
            Super Admin
          </span>
        </div>

        <label className="hidden h-14 w-[min(32vw,420px)] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 shadow-sm lg:flex">
          <Search className="h-5 w-5 text-slate-500" />
          <input
            type="search"
            placeholder="Search tenants and users..."
            className="w-full border-0 bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-white"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-0 flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-xs font-bold text-white">
              3
            </span>
          </button>
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-white sm:inline-flex"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
          <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
          <button
            type="button"
            className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-80"
            aria-label="Open profile menu"
          >
            <img
              src={avatarImage}
              alt="Super admin avatar"
              className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-sm"
            />
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-6 lg:hidden">
        <label className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            type="search"
            placeholder="Search tenants and users..."
            className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
