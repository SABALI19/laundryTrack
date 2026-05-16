const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const revenueData = [
  { month: "Jan", base: 178, growth: 44 },
  { month: "Feb", base: 192, growth: 52 },
  { month: "Mar", base: 208, growth: 58 },
  { month: "Apr", base: 225, growth: 72 },
  { month: "May", base: 246, growth: 64 },
  { month: "Jun", base: 255, growth: 78 },
  { month: "Jul", base: 274, growth: 82 },
  { month: "Aug", base: 286, growth: 86 },
  { month: "Sep", base: 302, growth: 92 },
  { month: "Oct", base: 318, growth: 100 },
  { month: "Nov", base: 334, growth: 114 },
  { month: "Dec", base: 346, growth: 116 },
];

const yAxisLabels = [500, 400, 300, 200, 100, 0];
const maxRevenue = 500;

const RevenueAnalytics = () => {
  return (
    <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-slate-900">
          Revenue Analytics
        </h2>
        <button
          type="button"
          className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 transition-colors hover:border-[var(--color-primary)]"
        >
          Monthly
        </button>
      </div>

      <div className="mt-6 grid grid-cols-[32px_1fr] gap-x-3">
        <div className="flex h-[185px] flex-col justify-between text-[0.7rem] font-medium text-slate-400">
          {yAxisLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="min-w-0">
          <div className="relative h-[185px]">
            <div className="absolute inset-0 flex flex-col justify-between">
              {yAxisLabels.map((label) => (
                <span key={label} className="h-px w-full bg-slate-200/80" />
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-between gap-2 px-1">
              {revenueData.map(({ month, base, growth }) => {
                const baseHeight = (base / maxRevenue) * 100;
                const growthHeight = (growth / maxRevenue) * 100;

                return (
                  <div
                    key={month}
                    className="flex h-full flex-1 items-end justify-center"
                  >
                    <div className="flex h-full w-full max-w-[34px] items-end">
                      <span
                        className="block w-1/2 rounded-t-sm bg-[var(--color-primary)]"
                        style={{ height: `${baseHeight}%` }}
                      />
                      <span
                        className="block w-1/2 rounded-t-sm bg-teal-500"
                        style={{ height: `${baseHeight + growthHeight}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-2 grid grid-cols-12 text-center text-[0.7rem] font-medium text-slate-400">
            {months.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RevenueAnalytics;
