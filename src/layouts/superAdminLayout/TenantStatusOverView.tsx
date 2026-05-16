import { ChevronLeft, ChevronRight, MoreHorizontal, Search } from "lucide-react";

const tenants = [
  {
    name: "Clean Express",
    plan: "Premium",
    planClass: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
    status: "Active",
    statusClass: "bg-emerald-500",
    orders: 342,
    storage: "7.2/10GB",
    storageClass: "bg-[var(--color-primary)]",
    active: "2 min ago",
  },
  {
    name: "Wash & Go",
    plan: "Pro",
    planClass: "bg-emerald-50 text-emerald-700",
    status: "Active",
    statusClass: "bg-emerald-500",
    orders: 198,
    storage: "2.5/5GB",
    storageClass: "bg-[var(--color-primary)]",
    active: "15 min ago",
  },
  {
    name: "QuickClean Pro",
    plan: "Trial",
    planClass: "bg-amber-100 text-amber-700",
    status: "Trial",
    statusClass: "bg-amber-500",
    orders: 45,
    storage: "0.8/5GB",
    storageClass: "bg-[var(--color-primary-soft)]",
    active: "1 hour ago",
  },
  {
    name: "Fresh Laundry Co.",
    plan: "Premium",
    planClass: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
    status: "Suspended",
    statusClass: "bg-red-500",
    orders: 0,
    storage: "10/10GB",
    storageClass: "bg-red-500",
    active: "3 days ago",
  },
];

const filters = ["All", "Premium", "Pro", "Trial"];

const TenantStatusOverView = () => {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl bg-white shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-base font-semibold text-slate-900">Tenant Status Overview</h2>
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`h-7 rounded-full border px-3 text-[0.7rem] font-medium transition-colors ${
                filter === "All"
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              }`}
            >
              {filter}
            </button>
          ))}
          <label className="flex h-8 w-full items-center gap-2 rounded-md border border-slate-200 px-3 text-xs sm:w-[195px]">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="search"
              placeholder="Search tenants..."
              className="w-full border-0 bg-transparent text-[0.72rem] outline-none placeholder:text-slate-400"
            />
          </label>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto overscroll-x-contain scrollbar-hide [touch-action:pan-x]">
        <table className="w-full min-w-[760px] table-fixed text-left">
          <thead className="bg-slate-50 text-[0.72rem] font-semibold text-slate-900">
            <tr>
              <th className="w-[138px] px-5 py-4">Business Name</th>
              <th className="w-[116px] px-4 py-4">Plan</th>
              <th className="w-[120px] px-4 py-4">Status</th>
              <th className="w-[98px] px-4 py-4">Orders (30d)</th>
              <th className="w-[108px] px-4 py-4">Storage</th>
              <th className="w-[108px] px-4 py-4">Last Active</th>
              <th className="w-[72px] px-4 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenants.map((tenant) => (
              <tr key={tenant.name} className="text-[0.78rem] text-slate-600">
                <td className="px-5 py-4 font-semibold leading-snug text-slate-900">{tenant.name}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-3 py-1 text-[0.7rem] font-medium ${tenant.planClass}`}>
                    {tenant.plan}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${tenant.statusClass}`} />
                    {tenant.status}
                  </span>
                </td>
                <td className="px-4 py-4">{tenant.orders}</td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2 text-[0.7rem] text-slate-500">
                    <span className={`h-3 w-0.5 rounded-full ${tenant.storageClass}`} />
                    {tenant.storage}
                  </span>
                </td>
                <td className="px-4 py-4">{tenant.active}</td>
                <td className="px-4 py-4 text-right">
                  <button
                    type="button"
                    className="rounded-full p-1 text-slate-700 hover:bg-slate-100"
                    aria-label={`Open actions for ${tenant.name}`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 px-5 py-3 text-[0.72rem] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>Showing 1-4 of 247 tenants</span>
        <div className="flex items-center gap-3">
          <button type="button" className="text-slate-500" aria-label="Previous page">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="flex h-7 min-w-7 items-center justify-center rounded-md bg-[var(--color-primary)] px-2 text-xs font-bold text-white"
          >
            1
          </button>
          <button type="button">2</button>
          <button type="button">3</button>
          <button type="button" className="text-slate-500" aria-label="Next page">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TenantStatusOverView;
