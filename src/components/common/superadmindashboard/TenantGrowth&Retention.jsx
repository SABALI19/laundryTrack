const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const growthBars = [
  { month: "Jan", value: 15 },
  { month: "Feb", value: 23 },
  { month: "Mar", value: 18 },
  { month: "Apr", value: 32 },
  { month: "May", value: 28 },
  { month: "Jun", value: 45 },
];

const retentionPoints = [
  { x: 8, y: 20 },
  { x: 25, y: 18 },
  { x: 42, y: 21 },
  { x: 59, y: 16 },
  { x: 76, y: 17 },
  { x: 92, y: 15 },
];

const retentionPath =
  "M 8 20 C 14 19, 19 19, 25 18 S 36 19, 42 21 S 54 18, 59 16 S 70 17, 76 17 S 87 16, 92 15";

const leftAxisLabels = [50, 40, 30, 20, 10, 0];
const rightAxisLabels = [100, 80, 60, 40, 20, 0];

const TenantGrowthRetention = () => {
  return (
    <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-slate-900">
          Tenant Growth & Retention
        </h2>
        <button
          type="button"
          className="text-xs font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
        >
          View Details
        </button>
      </div>

      <div className="mt-6 grid grid-cols-[28px_1fr_28px] gap-x-3">
        <div className="flex h-[185px] flex-col justify-between text-[0.7rem] font-medium text-slate-400">
          {leftAxisLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="min-w-0">
          <div className="relative h-[185px]">
            <div className="absolute inset-0 flex flex-col justify-between">
              {leftAxisLabels.map((label) => (
                <span key={label} className="h-px w-full bg-slate-200/80" />
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-between gap-5 px-2">
              {growthBars.map(({ month, value }) => (
                <div
                  key={month}
                  className="flex h-full flex-1 items-end justify-center"
                >
                  <span
                    className="block w-full max-w-[48px] rounded-t-md bg-[var(--color-primary)]"
                    style={{ height: `${(value / 50) * 100}%` }}
                  />
                </div>
              ))}
            </div>

            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
              role="img"
              aria-label="Tenant retention trend from January to June"
            >
              <path
                d={retentionPath}
                fill="none"
                stroke="#7ea08b"
                strokeLinecap="round"
                strokeWidth="1.4"
                vectorEffect="non-scaling-stroke"
              />
              {retentionPoints.map((point) => (
                <circle
                  key={`${point.x}-${point.y}`}
                  cx={point.x}
                  cy={point.y}
                  r="1.3"
                  fill="#7ea08b"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
          </div>

          <div className="mt-2 grid grid-cols-6 text-center text-[0.7rem] font-medium text-slate-400">
            {months.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>

        <div className="flex h-[185px] flex-col justify-between text-right text-[0.7rem] font-medium text-slate-400">
          {rightAxisLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TenantGrowthRetention;
