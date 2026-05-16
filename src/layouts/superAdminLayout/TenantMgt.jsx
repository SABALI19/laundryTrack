import {
  Download,
  MoreVertical,
  Plus,
  Search,
  Upload,
  UsersRound,
  Clock3,
  Building2,
  TrendingUp,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const summaryStats = [
  {
    label: "Total Active Tenants",
    value: "189",
    change: "+8%",
    Icon: Building2,
    iconClass: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  },
  {
    label: "Tenants on Trial",
    value: "23",
    detail: "9.3%",
    Icon: Clock3,
    iconClass: "bg-orange-100 text-orange-500",
  },
  {
    label: "New This Month",
    value: "14",
    change: "+25%",
    Icon: UsersRound,
    iconClass: "bg-emerald-100 text-emerald-600",
  },
];

const subscriptionFilters = ["All", "Basic", "Professional", "Enterprise"];

const getTenantSlug = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const tenants = [
  {
    name: "Clean Express",
    tier: "Professional",
    tierClass: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
    status: "Active",
    statusClass: "bg-emerald-500",
    orders: 342,
    users: 28,
    revenue: "$4,250",
  },
  {
    name: "Wash & Go",
    tier: "Basic",
    tierClass: "bg-emerald-50 text-emerald-700",
    status: "Active",
    statusClass: "bg-emerald-500",
    orders: 198,
    users: 15,
    revenue: "$1,980",
  },
  {
    name: "QuickClean Pro",
    tier: "Trial",
    tierClass: "bg-orange-100 text-orange-600",
    status: "Trial",
    statusClass: "bg-orange-500",
    orders: 45,
    users: 8,
    revenue: "$0",
  },
  {
    name: "Fresh Laundry Co.",
    tier: "Enterprise",
    tierClass: "bg-cyan-100 text-cyan-700",
    status: "Suspended",
    statusClass: "bg-red-500",
    orders: 0,
    users: 0,
    revenue: "$0",
  },
  {
    name: "Sparkle Suds",
    tier: "Professional",
    tierClass: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
    status: "Active",
    statusClass: "bg-emerald-500",
    orders: 287,
    users: 22,
    revenue: "$3,740",
  },
  {
    name: "Bubble Bliss",
    tier: "Basic",
    tierClass: "bg-emerald-50 text-emerald-700",
    status: "Inactive",
    statusClass: "bg-slate-400",
    orders: 12,
    users: 3,
    revenue: "$120",
  },
];

const TenantMgt = () => {
  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-950">
            Tenant Management
          </h1>
          <p className="mt-2 text-xs text-slate-500">247 total tenants</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/super-admin/tenants/new"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add New Tenant
          </Link>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-primary)] bg-white px-5 text-xs font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)]"
          >
            <Download className="h-3.5 w-3.5" />
            Export Tenant List
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-primary)] bg-white px-5 text-xs font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)]"
          >
            <Upload className="h-3.5 w-3.5" />
            Import Tenants
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-primary)] bg-white px-5 text-xs font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)]"
          >
            <MoreVertical className="h-3.5 w-3.5" />
            Bulk Actions
          </button>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {summaryStats.map(({ label, value, change, detail, Icon, iconClass }) => (
          <article
            key={label}
            className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-medium text-slate-950">{label}</h2>
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-5 flex items-end gap-3">
              <p className="text-3xl font-bold tracking-normal text-slate-950">
                {value}
              </p>
              {change && (
                <span className="inline-flex items-center gap-1 pb-1 text-xs font-medium text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {change}
                </span>
              )}
              {detail && (
                <span className="pb-1 text-xs font-medium text-slate-500">
                  {detail}
                </span>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex h-11 w-full max-w-[330px] items-center gap-3 rounded-lg border border-slate-200 bg-white px-4">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="search"
              placeholder="Advanced search tenants..."
              className="w-full border-0 bg-transparent text-[0.78rem] text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          <button
            type="button"
            className="inline-flex items-center gap-2 text-[0.72rem] font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
          >
            Clear all filters
            <X className="h-3 w-3" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-[0.72rem] text-slate-700">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-900">Subscription:</span>
            {subscriptionFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`h-7 rounded-full border px-3 text-[0.7rem] font-medium transition-colors ${
                  filter === "All"
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : "border-slate-200 bg-white text-slate-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">Status:</span>
            <select className="h-8 w-[86px] rounded-md border border-slate-200 bg-white px-2 text-[0.72rem] text-slate-600 outline-none">
              <option>All</option>
              <option>Active</option>
              <option>Trial</option>
              <option>Suspended</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">Created Date:</span>
            <select className="h-8 w-[96px] rounded-md border border-slate-200 bg-white px-2 text-[0.72rem] text-slate-600 outline-none">
              <option>All time</option>
              <option>This month</option>
              <option>This quarter</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">Sort by:</span>
            <select className="h-8 w-[96px] rounded-md border border-slate-200 bg-white px-2 text-[0.72rem] text-slate-600 outline-none">
              <option>Name</option>
              <option>Newest</option>
              <option>Most active</option>
            </select>
          </label>
        </div>
      </section>

      <section className="min-w-0 overflow-hidden rounded-xl bg-white shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
        <div className="max-w-full overflow-x-auto overscroll-x-contain scrollbar-hide [touch-action:pan-x]">
          <table className="w-full min-w-[860px] table-fixed text-left">
            <thead className="bg-slate-50 text-[0.72rem] font-semibold text-slate-900">
              <tr>
                <th className="w-[190px] px-5 py-4">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <span>Business Name</span>
                  </label>
                </th>
                <th className="w-[150px] px-4 py-4">Subscription Tier</th>
                <th className="w-[130px] px-4 py-4">Status</th>
                <th className="w-[118px] px-4 py-4">Orders (30d)</th>
                <th className="w-[118px] px-4 py-4">Active Users</th>
                <th className="w-[145px] px-4 py-4">Monthly Revenue</th>
                <th className="w-[80px] px-4 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map((tenant) => (
                <tr key={tenant.name} className="text-[0.78rem] text-slate-600">
                  <td className="px-5 py-4">
                    <label className="inline-flex min-w-0 items-center gap-3">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 shrink-0 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      />
                      <Link
                        to={`/super-admin/tenants/${getTenantSlug(tenant.name)}`}
                        className="truncate font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
                      >
                        {tenant.name}
                      </Link>
                    </label>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-[0.68rem] font-medium ${tenant.tierClass}`}>
                      {tenant.tier}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${tenant.statusClass}`} />
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">{tenant.orders}</td>
                  <td className="px-4 py-4">{tenant.users}</td>
                  <td className="px-4 py-4">{tenant.revenue}</td>
                  <td className="px-4 py-4 text-center">
                    <button
                      type="button"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100"
                      aria-label={`Open actions for ${tenant.name}`}
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 px-5 py-3 text-[0.72rem] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Showing 1-6 of 247 tenants</span>
          <div className="flex items-center gap-3">
            <button type="button" className="text-slate-500" aria-label="Previous page">
              ‹
            </button>
            <button
              type="button"
              className="flex h-7 min-w-7 items-center justify-center rounded-md bg-[var(--color-primary)] px-2 text-xs font-bold text-white"
            >
              1
            </button>
            <button type="button">2</button>
            <button type="button">3</button>
            <span>...</span>
            <button type="button">42</button>
            <button type="button" className="text-slate-500" aria-label="Next page">
              ›
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TenantMgt;
