import Card from "../../components/Card.jsx";

const fallbackSlots = [
  { label: "Morning", value: 78 },
  { label: "Afternoon", value: 92 },
  { label: "Evening", value: 66 },
];

const fallbackSummaryItems = [
  { label: "Overdue Share", value: "3.2%" },
  { label: "Unscheduled Orders", value: "4" },
];

const chartWidth = 320;
const chartHeight = 175;
const paddingLeft = 34;
const paddingRight = 16;
const paddingTop = 16;
const paddingBottom = 24;
const maxValue = 100;
const barWidth = 56;
const barGap = 28;

const PickupTimeUtilization = ({
  slots = fallbackSlots,
  summaryItems = fallbackSummaryItems,
}) => {
  const resolvedSlots = slots.length > 0 ? slots : fallbackSlots;
  const resolvedSummaryItems = summaryItems.length > 0 ? summaryItems : fallbackSummaryItems;

  return (
    <Card className="rounded-[1rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h2 className="text-[1rem] font-semibold text-slate-900">Pickup Time Utilization</h2>

      <div className="mt-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-[170px] w-full min-w-[320px]"
          role="img"
          aria-label="Pickup time utilization chart"
        >
          {[0, 20, 40, 60, 80, 100].map((tick) => {
            const y =
              paddingTop +
              ((maxValue - tick) / maxValue) * (chartHeight - paddingTop - paddingBottom);

            return (
              <g key={tick}>
                <line x1={paddingLeft} y1={y} x2={chartWidth - paddingRight} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                <text x={paddingLeft - 8} y={y + 4} fontSize="10" textAnchor="end" fill="#94a3b8">
                  {tick}
                </text>
              </g>
            );
          })}

          {resolvedSlots.map((slot, index) => {
            const x = paddingLeft + 14 + index * (barWidth + barGap);
            const barHeight = (slot.value / maxValue) * (chartHeight - paddingTop - paddingBottom);
            const y = chartHeight - paddingBottom - barHeight;

            return (
              <g key={slot.label}>
                <rect x={x} y={y} width={barWidth} height={barHeight} rx="3" fill="var(--color-primary)" />
                <text x={x + barWidth / 2} y={chartHeight - 8} fontSize="9" textAnchor="middle" fill="#94a3b8">
                  {slot.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 space-y-2">
        {resolvedSummaryItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3">
            <span className="text-[0.72rem] text-slate-600">{item.label}</span>
            <span className="text-[0.72rem] font-medium text-slate-900">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PickupTimeUtilization;
