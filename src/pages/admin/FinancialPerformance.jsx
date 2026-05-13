import Card from "../../components/Card.jsx";

const fallbackDataPoints = [
  { label: "Week 1", value: 18500 },
  { label: "Week 2", value: 22000 },
  { label: "Week 3", value: 19800 },
  { label: "Week 4", value: 24850 },
];
const fallbackMetrics = [
  { label: "Average Order Value", value: "$19.93" },
  { label: "Revenue per Customer", value: "$67.24" },
  { label: "Growth Rate", tone: "positive", value: "+22%" },
];

const chartWidth = 420;
const chartHeight = 170;
const paddingLeft = 42;
const paddingRight = 18;
const paddingTop = 18;
const paddingBottom = 28;

const FinancialPerformance = ({
  dataPoints = fallbackDataPoints,
  metrics = fallbackMetrics,
}) => {
  const resolvedDataPoints = dataPoints.length > 0 ? dataPoints : fallbackDataPoints;
  const resolvedMetrics = metrics.length > 0 ? metrics : fallbackMetrics;
  const maxValue = Math.max(...resolvedDataPoints.map((point) => point.value), 1);
  const stepX =
    resolvedDataPoints.length > 1
      ? (chartWidth - paddingLeft - paddingRight) / (resolvedDataPoints.length - 1)
      : chartWidth - paddingLeft - paddingRight;
  const points = resolvedDataPoints.map((point, index) => {
    const x = paddingLeft + index * stepX;
    const y =
      paddingTop +
      (1 - point.value / maxValue) * (chartHeight - paddingTop - paddingBottom);

    return { ...point, x, y };
  });
  const linePath = points
    .map((point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }

      const previous = points[index - 1];
      const controlX = (previous.x + point.x) / 2;
      return `C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
    })
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingBottom} L ${points[0].x} ${chartHeight - paddingBottom} Z`;

  return (
    <Card className="rounded-[1rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h2 className="text-[1rem] font-semibold text-slate-900">Financial Performance</h2>

      <div className="mt-3 overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-[150px] w-full min-w-[420px]"
          role="img"
          aria-label="Financial performance chart"
        >
          {[0, Math.round(maxValue * 0.25), Math.round(maxValue * 0.5), Math.round(maxValue * 0.75), maxValue].map((tick) => {
            const y =
              paddingTop +
              (1 - tick / maxValue) * (chartHeight - paddingTop - paddingBottom);

            return (
              <g key={tick}>
                <line x1={paddingLeft} y1={y} x2={chartWidth - paddingRight} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                <text x={paddingLeft - 8} y={y + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                  {tick.toLocaleString()}
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill="rgba(44,74,125,0.14)" />
          <path d={linePath} fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((point) => (
            <circle key={point.label} cx={point.x} cy={point.y} r="2.5" fill="var(--color-primary)" />
          ))}

          {points.map((point) => (
            <text key={`${point.label}-label`} x={point.x} y={chartHeight - 8} fontSize="8" textAnchor="middle" fill="#94a3b8">
              {point.label}
            </text>
          ))}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {resolvedMetrics.map((metric) => (
          <Metric key={metric.label} {...metric} />
        ))}
      </div>
    </Card>
  );
};

const Metric = ({ label, tone, value }) => (
  <div>
    <p className="text-[0.74rem] text-slate-500">{label}</p>
    <p className={`mt-1 text-[1.1rem] font-semibold ${tone === "positive" ? "text-[#16a34a]" : "text-slate-900"}`}>
      {value}
    </p>
  </div>
);

export default FinancialPerformance;
