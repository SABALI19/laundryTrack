const performanceMetrics = [
  {
    label: "API Response Time",
    value: "142ms",
    percent: 25,
    color: "bg-emerald-500",
  },
  {
    label: "Uptime",
    value: "99.9%",
    percent: 99,
    color: "bg-emerald-500",
  },
  {
    label: "Error Rate",
    value: "0.1%",
    percent: 5,
    color: "bg-emerald-500",
  },
];

const SystemPerformance = () => {
  return (
    <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <h2 className="text-base font-semibold text-slate-900">
        System Performance
      </h2>

      <div className="mt-6 space-y-5">
        {performanceMetrics.map((metric) => (
          <div key={metric.label}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.8rem] text-slate-600">{metric.label}</p>
              <p className="text-[0.8rem] font-bold text-slate-900">
                {metric.value}
              </p>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--color-primary-soft)]">
              <div
                className={`h-full rounded-full ${metric.color}`}
                style={{ width: `${metric.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SystemPerformance;
