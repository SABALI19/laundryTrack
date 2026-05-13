import { Download } from "lucide-react";
import Button from "../../components/Button";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const points = [
  { x: 8, y: 70 },
  { x: 24, y: 52 },
  { x: 40, y: 61 },
  { x: 56, y: 31 },
  { x: 72, y: 39 },
  { x: 88, y: 17 },
];

const linePath = "M 8 70 C 13 60, 19 54, 24 52 S 35 55, 40 61 S 51 55, 56 31 S 68 36, 72 39 S 84 31, 88 17";
const areaPath = `${linePath} L 88 100 L 8 100 Z`;

const TenantGrowth = () => {
  return (
    <section className="min-h-[310px] rounded-2xl bg-white p-7 shadow-[0_4px_18px_rgba(15,23,42,0.10)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-slate-900">Tenant Growth</h2>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            fontWeight="normal"
            className="rounded-lg border-slate-200 text-slate-700 hover:border-[var(--color-primary)]"
          >
            Last 6 months
          </Button>
          <Button variant="regular" size="sm" className="inline-flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-[32px_1fr] gap-x-4">
        <div className="flex h-[220px] flex-col justify-between text-sm font-bold text-slate-400">
          <span>50</span>
          <span>40</span>
          <span>30</span>
          <span>20</span>
          <span>10</span>
          <span>0</span>
        </div>
        <div>
          <div className="relative h-[220px]">
            <div className="absolute inset-0 flex flex-col justify-between">
              {Array.from({ length: 6 }).map((_, index) => (
                <span key={index} className="h-px w-full bg-slate-200" />
              ))}
            </div>
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
              role="img"
              aria-label="Tenant growth chart from January to June"
            >
              <path d={areaPath} fill="var(--color-primary)" opacity="0.1" />
              <path
                d={linePath}
                fill="none"
                stroke="var(--color-primary)"
                strokeLinecap="round"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
              />
              {points.map((point) => (
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
          <div className="mt-3 grid grid-cols-6 text-center text-sm font-bold text-slate-400">
            {months.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TenantGrowth;
