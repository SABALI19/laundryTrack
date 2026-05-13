import Card from "../Card";

const fallbackDataPoints = [12, 28, 45, 38, 52, 31];
const fallbackLabels = ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"];

const chartWidth = 680;
const chartHeight = 220;
const paddingX = 44;
const paddingTop = 20;
const paddingBottom = 28;

const OrdervolumeTrend = ({
  dataPoints = fallbackDataPoints,
  labels = fallbackLabels,
  title = "Order Volume Trends",
}) => {
  const resolvedDataPoints = dataPoints.length > 0 ? dataPoints : fallbackDataPoints;
  const resolvedLabels =
    labels.length === resolvedDataPoints.length ? labels : fallbackLabels.slice(0, resolvedDataPoints.length);
  const maxValue = Math.max(...resolvedDataPoints, 1);
  const stepX =
    resolvedDataPoints.length > 1
      ? (chartWidth - paddingX * 2) / (resolvedDataPoints.length - 1)
      : chartWidth - paddingX * 2;
  const points = resolvedDataPoints.map((value, index) => {
    const x = paddingX + index * stepX;
    const y = paddingTop + ((maxValue - value) / maxValue) * (chartHeight - paddingTop - paddingBottom);

    return { x, y, value };
  });
  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingBottom} L ${points[0].x} ${chartHeight - paddingBottom} Z`
      : "";
  const yTicks = Array.from({ length: 6 }, (_, index) => Math.round((maxValue / 5) * index));

  return (
    <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-[1.15rem] font-semibold text-slate-900">{title}</h2>
        <div className="rounded-xl bg-slate-100 px-4 py-2 text-[0.78rem] font-medium text-slate-600">
          Live data
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-[240px] w-full min-w-[680px]"
          role="img"
          aria-label={`${title} chart`}
        >
          <defs>
            <linearGradient id="order-volume-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.24" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => {
            const y = paddingTop + ((maxValue - tick) / maxValue) * (chartHeight - paddingTop - paddingBottom);

            return (
              <g key={tick}>
                <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="#dbeafe" strokeWidth="1" />
                <text x={paddingX - 18} y={y + 4} fontSize="11" textAnchor="end" fill="#64748b">
                  {tick}
                </text>
              </g>
            );
          })}

          {areaPath && <path d={areaPath} fill="url(#order-volume-fill)" />}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {points.map((point, index) => (
            <g key={resolvedLabels[index] || index}>
              <circle cx={point.x} cy={point.y} r="2.8" fill="white" stroke="var(--color-primary)" strokeWidth="1.8" />
              <text x={point.x} y={chartHeight - 8} fontSize="11" textAnchor="middle" fill="#64748b">
                {resolvedLabels[index]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
};

export default OrdervolumeTrend;
