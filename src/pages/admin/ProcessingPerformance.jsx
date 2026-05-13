import Card from "../../components/Card.jsx";

const fallbackBars = [
  { label: "Pending", value: 12 },
  { label: "Confirmed", value: 45 },
  { label: "In Progress", value: 38 },
  { label: "Completed", value: 26 },
  { label: "Cancelled", value: 8 },
];

const chartWidth = 360;
const chartHeight = 175;
const paddingLeft = 34;
const paddingRight = 12;
const paddingTop = 16;
const paddingBottom = 24;
const barGap = 18;

const ProcessingPerformance = ({
  bars = fallbackBars,
  bottleneck = "Confirmed queue is currently the heaviest",
  efficiencyText = "68% completed in this range",
}) => {
  const resolvedBars = bars.length > 0 ? bars : fallbackBars;
  const maxValue = Math.max(...resolvedBars.map((bar) => bar.value), 1);
  const barWidth =
    (chartWidth - paddingLeft - paddingRight - barGap * (resolvedBars.length - 1)) /
    Math.max(resolvedBars.length, 1);

  return (
    <Card className="rounded-[1rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h2 className="text-[1rem] font-semibold text-slate-900">Workflow Distribution</h2>

      <div className="mt-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-[170px] w-full min-w-[360px]"
          role="img"
          aria-label="Workflow distribution chart"
        >
          {[0, Math.round(maxValue * 0.25), Math.round(maxValue * 0.5), Math.round(maxValue * 0.75), maxValue].map((tick) => {
            const y = paddingTop + ((maxValue - tick) / maxValue) * (chartHeight - paddingTop - paddingBottom);

            return (
              <g key={tick}>
                <line x1={paddingLeft} y1={y} x2={chartWidth - paddingRight} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                <text x={paddingLeft - 8} y={y + 4} fontSize="10" textAnchor="end" fill="#94a3b8">
                  {tick}
                </text>
              </g>
            );
          })}

          {resolvedBars.map((bar, index) => {
            const x = paddingLeft + index * (barWidth + barGap);
            const barHeight = (bar.value / maxValue) * (chartHeight - paddingTop - paddingBottom);
            const y = chartHeight - paddingBottom - barHeight;

            return (
              <g key={bar.label}>
                <rect x={x} y={y} width={barWidth} height={barHeight} rx="3" fill="var(--color-primary)" />
                <text x={x + barWidth / 2} y={chartHeight - 8} fontSize="9" textAnchor="middle" fill="#94a3b8">
                  {bar.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[0.72rem] font-medium text-slate-700">Bottleneck</p>
          <p className="mt-1 text-[0.72rem] text-[#d97706]">{bottleneck}</p>
        </div>
        <div>
          <p className="text-[0.72rem] font-medium text-slate-700">Efficiency</p>
          <p className="mt-1 text-[0.72rem] text-[#16a34a]">{efficiencyText}</p>
        </div>
      </div>
    </Card>
  );
};

export default ProcessingPerformance;
