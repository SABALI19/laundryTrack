const tenants = [
  { rank: 1, name: "Clean Express Pro", revenue: "$12.5K", className: "bg-[var(--color-primary)] text-white" },
  { rank: 2, name: "Premium Wash Co.", revenue: "$9.8K", className: "bg-emerald-200 text-emerald-800" },
  { rank: 3, name: "Super Clean Hub", revenue: "$8.2K", className: "bg-slate-400 text-white" },
  { rank: 4, name: "Elite Laundry", revenue: "$7.6K", className: "bg-slate-500 text-white" },
  { rank: 5, name: "QuickWash Plus", revenue: "$6.9K", className: "bg-slate-600 text-white" },
];

const TopRevenueTenants = () => {
  return (
    <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <h2 className="text-base font-semibold text-slate-900">
        Top Revenue Tenants
      </h2>

      <div className="mt-5 space-y-4">
        {tenants.map((tenant) => (
          <article
            key={tenant.name}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${tenant.className}`}
              >
                {tenant.rank}
              </span>
              <p className="truncate text-[0.82rem] font-semibold text-slate-900">
                {tenant.name}
              </p>
            </div>
            <p className="shrink-0 text-[0.82rem] font-bold text-slate-900">
              {tenant.revenue}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TopRevenueTenants;
