import {
  Box,
  CreditCard,
  Database,
  Download,
  UsersRound,
  UserRoundCog,
  Zap,
} from "lucide-react";

const statTiles = [
  { label: "Total Orders", value: "2,847", detail: "342 last 30d", Icon: Box },
  { label: "Active Customers", value: "1,245", Icon: UsersRound },
  { label: "Staff Members", value: "28", Icon: UserRoundCog },
  { label: "Total Revenue", value: "$156K", Icon: CreditCard },
  { label: "Storage Used", value: "8.2 GB", progress: 78, Icon: Database },
  { label: "API Calls", value: "847K", detail: "Last 30 days", Icon: Zap },
];

const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const orderPoints = [
  { x: 0, y: 70 },
  { x: 20, y: 49 },
  { x: 40, y: 38 },
  { x: 60, y: 46 },
  { x: 80, y: 26 },
  { x: 100, y: 22 },
];
const orderPath =
  "M 0 70 C 8 64, 13 55, 20 49 S 33 39, 40 38 S 52 43, 60 46 S 72 31, 80 26 S 92 23, 100 22";
const orderAreaPath = `${orderPath} L 100 100 L 0 100 Z`;

const revenueBars = [18000, 21500, 24500, 22800, 26200, 24200];
const revenueMax = 30000;
const yAxisLabels = ["30,000", "25,000", "20,000", "15,000", "10,000", "5,000", "0"];

const UsageStatistics = () => {
  return (
    <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          Usage Statistics
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-2 text-[0.76rem] font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
        >
          <Download className="h-3.5 w-3.5" />
          Export Usage Report
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {statTiles.map(({ label, value, detail, progress, Icon }) => (
          <article key={label} className="rounded-lg bg-slate-50 px-4 py-4">
            <div className="flex items-center gap-2 text-[0.76rem] text-slate-500">
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
            {detail && <p className="mt-1 text-[0.66rem] text-slate-400">{detail}</p>}
            {typeof progress === "number" && (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-primary-soft)]">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="mt-7 grid gap-8 xl:grid-cols-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Order Volume Trend
          </h3>
          <div className="mt-4 grid grid-cols-[34px_1fr] gap-x-3">
            <div className="flex h-[165px] flex-col justify-between text-[0.68rem] text-slate-400">
              {["350", "300", "250", "200", "150", "100", "50", "0"].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <div>
              <div className="relative h-[165px]">
                <div className="absolute inset-0 flex flex-col justify-between">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <span key={index} className="h-px w-full bg-slate-200/80" />
                  ))}
                </div>
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full"
                  role="img"
                  aria-label="Order volume trend chart"
                >
                  <path d={orderAreaPath} fill="var(--color-primary)" opacity="0.08" />
                  <path
                    d={orderPath}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeLinecap="round"
                    strokeWidth="1.4"
                    vectorEffect="non-scaling-stroke"
                  />
                  {orderPoints.map((point) => (
                    <circle
                      key={`${point.x}-${point.y}`}
                      cx={point.x}
                      cy={point.y}
                      r="1.4"
                      fill="var(--color-primary)"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </svg>
              </div>
              <div className="mt-2 grid grid-cols-6 text-center text-[0.7rem] text-slate-400">
                {months.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Revenue Trend
          </h3>
          <div className="mt-4 grid grid-cols-[46px_1fr] gap-x-3">
            <div className="flex h-[165px] flex-col justify-between text-[0.68rem] text-slate-400">
              {yAxisLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <div>
              <div className="relative h-[165px]">
                <div className="absolute inset-0 flex flex-col justify-between">
                  {yAxisLabels.map((label) => (
                    <span key={label} className="h-px w-full bg-slate-200/80" />
                  ))}
                </div>
                <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-between gap-4 px-2">
                  {revenueBars.map((value, index) => (
                    <span
                      key={`${months[index]}-${value}`}
                      className="block w-full max-w-[42px] rounded-t-md bg-[var(--color-primary)]"
                      style={{ height: `${(value / revenueMax) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-2 grid grid-cols-6 text-center text-[0.7rem] text-slate-400">
                {months.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsageStatistics;
