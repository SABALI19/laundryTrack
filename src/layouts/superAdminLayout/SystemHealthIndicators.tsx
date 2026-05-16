const indicators = [
  { label: "API Response Time", value: "142ms", percent: 24, color: "bg-emerald-600" },
  { label: "Database Performance", value: "95.2%", percent: 84, color: "bg-[var(--color-primary)]" },
  { label: "Storage Utilization", value: "67.8%", percent: 67, color: "bg-[var(--color-primary)]" },
  { label: "Active Connections", value: "2,847", percent: 61, color: "bg-[var(--color-primary)]" },
];

const SystemHealthIndicators = () => {
  return (
    <section className="min-h-[250px] rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-slate-900">System Health Indicators</h2>
        <span className="inline-flex items-center gap-2 text-xs text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          All systems operational
        </span>
      </div>

      <div className="mt-6 grid gap-x-6 gap-y-5 md:grid-cols-2">
        {indicators.map((indicator) => (
          <div key={indicator.label}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.8rem] text-slate-600">{indicator.label}</p>
              <p className="text-[0.8rem] font-bold text-slate-900">{indicator.value}</p>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--color-primary-soft)]">
              <div
                className={`h-full rounded-full ${indicator.color}`}
                style={{ width: `${indicator.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SystemHealthIndicators;
