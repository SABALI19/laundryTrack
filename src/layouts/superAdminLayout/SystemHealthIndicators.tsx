const indicators = [
  { label: "API Response Time", value: "142ms", percent: 24, color: "bg-emerald-600" },
  { label: "Database Performance", value: "95.2%", percent: 84, color: "bg-[var(--color-primary)]" },
  { label: "Storage Utilization", value: "67.8%", percent: 67, color: "bg-[var(--color-primary)]" },
  { label: "Active Connections", value: "2,847", percent: 61, color: "bg-[var(--color-primary)]" },
];

const SystemHealthIndicators = () => {
  return (
    <section className="min-h-[310px] rounded-2xl bg-white p-7 shadow-[0_4px_18px_rgba(15,23,42,0.10)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-slate-900">System Health Indicators</h2>
        <span className="inline-flex items-center gap-3 text-sm text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
          All systems operational
        </span>
      </div>

      <div className="mt-8 grid gap-x-8 gap-y-7 md:grid-cols-2">
        {indicators.map((indicator) => (
          <div key={indicator.label}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-base text-slate-600">{indicator.label}</p>
              <p className="font-bold text-slate-900">{indicator.value}</p>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-[var(--color-primary-soft)]">
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
