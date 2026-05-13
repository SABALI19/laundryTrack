import { ChevronLeft, ChevronRight, MoreHorizontal, Search } from "lucide-react";
import Button from "../../components/Button";

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
    <section className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_18px_rgba(15,23,42,0.10)]">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-slate-900">Tenant Status Overview</h2>
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={filter === "All" ? "primary" : "secondary"}
              size="sm"
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                filter === "All"
                  ? "border-[var(--color-primary)]"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {filter}
            </Button>
          ))}
          <label className="flex h-10 w-full items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm sm:w-[230px]">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="search"
              placeholder="Search tenants..."
              className="w-full border-0 bg-transparent outline-none placeholder:text-slate-400"
            />
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-[var(--color-surface)] text-sm font-bold text-slate-800">
            <tr>
              <th className="px-6 py-5">Business Name</th>
              <th className="px-6 py-5">Plan</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Orders (30d)</th>
              <th className="px-6 py-5">Storage</th>
              <th className="px-6 py-5">Last Active</th>
              <th className="px-6 py-5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {tenants.map((tenant) => (
              <tr key={tenant.name} className="text-base text-slate-600">
                <td className="px-6 py-6 font-bold text-slate-900">{tenant.name}</td>
                <td className="px-6 py-6">
                  <span className={`rounded-full px-4 py-1.5 text-sm font-bold ${tenant.planClass}`}>
                    {tenant.plan}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <span className="inline-flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${tenant.statusClass}`} />
                    {tenant.status}
                  </span>
                </td>
                <td className="px-6 py-6">{tenant.orders}</td>
                <td className="px-6 py-6">
                  <span className="inline-flex items-center gap-2 text-sm">
                    <span className={`h-4 w-1 rounded-full ${tenant.storageClass}`} />
                    {tenant.storage}
                  </span>
                </td>
                <td className="px-6 py-6">{tenant.active}</td>
                <td className="px-6 py-6">
                  <button
                    type="button"
                    className="rounded-full p-1 text-slate-700 hover:bg-slate-100"
                    aria-label={`Open actions for ${tenant.name}`}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 px-5 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>Showing 1-4 of 247 tenants</span>
        <div className="flex items-center gap-4">
          <button type="button" className="text-slate-500" aria-label="Previous page">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <Button size="sm" className="rounded-lg px-4 py-2" fontWeight="bold">
            1
          </Button>
          <button type="button">2</button>
          <button type="button">3</button>
          <button type="button" className="text-slate-500" aria-label="Next page">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TenantStatusOverView;
