const metrics = [
  {
    id: "support_tickets",
    label: "Support Tickets (30d)",
    sublabel: "Avg resolution: 4.2 hours",
    value: 127,
    valueColor: "text-slate-800",
  },
  {
    id: "at_risk",
    label: "At-Risk Tenants",
    sublabel: "Health score < 60",
    value: 8,
    valueColor: "text-red-500",
  },
  {
    id: "nps",
    label: "NPS Score",
    sublabel: "Net Promoter Score",
    value: 67,
    valueColor: "text-green-500",
  },
  {
    id: "feature_requests",
    label: "Feature Requests",
    sublabel: "Active submissions",
    value: 34,
    valueColor: "text-slate-800",
  },
];

const CustomerSuccessMetrics = () => {
  return (
    <section className="h-full rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <h2 className="mb-5 text-base font-semibold text-slate-900">
        Customer Success Metrics
      </h2>

      {/* flex-col + flex-1 on rows distributes them evenly to match card height */}
      <div className="flex h-[calc(100%-2.5rem)] flex-col divide-y divide-slate-100">
        {metrics.map(({ id, label, sublabel, value, valueColor }) => (
          <div
            key={id}
            className="flex flex-1 items-center justify-between gap-8 py-3 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="text-[0.82rem] font-semibold leading-tight text-slate-800">
                {label}
              </p>
              <p className="mt-1 text-[0.72rem] leading-tight text-slate-500">
                {sublabel}
              </p>
            </div>
            <span
              className={`shrink-0 text-2xl font-bold tabular-nums ${valueColor}`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerSuccessMetrics;