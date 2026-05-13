import Card from "../../components/Card.jsx";

const fallbackMetricBlocks = [
  { label: "Issue-Free Orders", tone: "primary", value: "94%" },
  { label: "Verified Orders", tone: "primary", value: "82%" },
  { label: "Dispute Rate", tone: "danger", value: "4.3%" },
];
const fallbackDistribution = [120, 205, 160, 92, 86, 128, 146];
const fallbackDistributionLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fallbackFeedbackWords = [
  { size: "text-[1.95rem]", text: "Wash & Fold" },
  { size: "text-[1.95rem]", text: "Dry Cleaning" },
  { size: "text-[1rem]", text: "Express" },
  { size: "text-[0.78rem]", text: "Ironing" },
  { size: "text-[0.78rem]", text: "Pickup" },
  { size: "text-[0.78rem]", text: "Beddings" },
];

const chartWidth = 220;
const chartHeight = 110;
const paddingLeft = 18;
const paddingBottom = 18;
const barWidth = 18;
const barGap = 9;

const CustomerExperience = ({
  distribution = fallbackDistribution,
  distributionLabel = "Daily Completions",
  distributionLabels = fallbackDistributionLabels,
  feedbackWords = fallbackFeedbackWords,
  metricBlocks = fallbackMetricBlocks,
  wordCloudLabel = "Most Requested Services",
}) => {
  const resolvedDistribution = distribution.length > 0 ? distribution : fallbackDistribution;
  const resolvedDistributionLabels =
    distributionLabels.length === resolvedDistribution.length
      ? distributionLabels
      : fallbackDistributionLabels.slice(0, resolvedDistribution.length);
  const resolvedFeedbackWords = feedbackWords.length > 0 ? feedbackWords : fallbackFeedbackWords;
  const resolvedMetricBlocks = metricBlocks.length > 0 ? metricBlocks : fallbackMetricBlocks;
  const maxValue = Math.max(...resolvedDistribution, 1);

  return (
    <Card className="rounded-[1rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h2 className="text-[1rem] font-semibold text-slate-900">Quality Signals</h2>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {resolvedMetricBlocks.map((metric) => (
          <MetricBlock key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div>
          <p className="text-[0.78rem] font-medium text-slate-700">{distributionLabel}</p>
          <div className="mt-2 overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-[104px] w-full min-w-[220px]"
              role="img"
              aria-label={`${distributionLabel} chart`}
            >
              {[0, Math.round(maxValue * 0.25), Math.round(maxValue * 0.5), Math.round(maxValue * 0.75), maxValue].map((tick) => {
                const y = 8 + ((maxValue - tick) / maxValue) * (chartHeight - 26);

                return (
                  <g key={tick}>
                    <line x1={paddingLeft} y1={y} x2={chartWidth - 8} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                    <text x={paddingLeft - 6} y={y + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                      {tick}
                    </text>
                  </g>
                );
              })}

              {resolvedDistribution.map((value, index) => {
                const x = paddingLeft + index * (barWidth + barGap);
                const barHeight = (value / maxValue) * (chartHeight - 26);
                const y = chartHeight - paddingBottom - barHeight;

                return (
                  <g key={resolvedDistributionLabels[index] || index}>
                    <rect x={x} y={y} width={barWidth} height={barHeight} rx="2" fill="#5b74c7" />
                    <text x={x + barWidth / 2} y={chartHeight - 5} fontSize="8" textAnchor="middle" fill="#94a3b8">
                      {index % 2 === 0 ? resolvedDistributionLabels[index] : ""}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div>
          <p className="text-[0.78rem] font-medium text-slate-700">{wordCloudLabel}</p>
          <div className="mt-2 flex min-h-[96px] flex-wrap items-center justify-center gap-x-2 gap-y-1 overflow-hidden rounded-md bg-[#20252d] px-4 py-4 text-white">
            {resolvedFeedbackWords.map((word) => (
              <span key={word.text} className={`${word.size} font-semibold leading-none`}>
                {word.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

const MetricBlock = ({ label, tone, value }) => {
  const toneClassName = tone === "danger" ? "text-[#dc2626]" : "text-[var(--color-primary)]";

  return (
    <div className="text-center">
      <p className={`text-[1.8rem] font-semibold leading-none ${toneClassName}`}>{value}</p>
      <p className="mt-1 text-[0.68rem] text-slate-500">{label}</p>
    </div>
  );
};

export default CustomerExperience;
