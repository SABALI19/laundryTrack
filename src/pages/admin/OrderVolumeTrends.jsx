import Card from "../../components/Card.jsx";

const fallbackLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fallbackTotalOrders = [145, 162, 138, 175, 190, 205, 160];
const fallbackNewCustomers = [32, 40, 28, 45, 50, 48, 35];
const fallbackReturning = [105, 118, 108, 128, 138, 155, 122];

const width = 560;
const height = 180;
const padLeft = 36;
const padRight = 16;
const padTop = 12;
const padBottom = 28;

const Dot = ({ color }) => (
  <span className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: color }} />
);

const buildPath = (values, maxValue) => {
  const innerWidth = width - padLeft - padRight;
  const innerHeight = height - padTop - padBottom;
  const toX = (index, total) => padLeft + (index / Math.max(total - 1, 1)) * innerWidth;
  const toY = (value) => padTop + ((maxValue - value) / maxValue) * innerHeight;
  const points = values.map((value, index) => ({ x: toX(index, values.length), y: toY(value) }));

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const controlX = (points[index].x + points[index + 1].x) / 2;
    path += ` C ${controlX} ${points[index].y}, ${controlX} ${points[index + 1].y}, ${points[index + 1].x} ${points[index + 1].y}`;
  }

  return { path, points };
};

const buildAreaPath = (linePath, points) =>
  `${linePath} L ${points[points.length - 1].x} ${height - padBottom} L ${points[0].x} ${height - padBottom} Z`;

const OrderVolumeTrends = ({
  labels = fallbackLabels,
  newCustomers = fallbackNewCustomers,
  returning = fallbackReturning,
  totalOrders = fallbackTotalOrders,
}) => {
  const resolvedLabels = labels.length > 0 ? labels : fallbackLabels;
  const resolvedTotalOrders = totalOrders.length > 0 ? totalOrders : fallbackTotalOrders;
  const resolvedNewCustomers = newCustomers.length > 0 ? newCustomers : fallbackNewCustomers;
  const resolvedReturning = returning.length > 0 ? returning : fallbackReturning;
  const maxValue = Math.max(
    ...resolvedTotalOrders,
    ...resolvedNewCustomers,
    ...resolvedReturning,
    1,
  );
  const totalLine = buildPath(resolvedTotalOrders, maxValue);
  const newLine = buildPath(resolvedNewCustomers, maxValue);
  const returningLine = buildPath(resolvedReturning, maxValue);
  const yTicks = Array.from({ length: 6 }, (_, index) => Math.round((maxValue / 5) * index));

  return (
    <Card className="rounded-[1rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[1rem] font-semibold text-slate-900">Order Volume Trends</h2>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Dot color="#0f766e" /> Total Orders
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Dot color="#2dd4bf" /> New Customers
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Dot color="#94a3b8" /> Returning
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[400px]"
          style={{ height: 180 }}
          role="img"
          aria-label="Order volume trends chart"
        >
          <defs>
            <linearGradient id="grad-total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f766e" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0f766e" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="grad-return" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => {
            const y = padTop + ((maxValue - tick) / maxValue) * (height - padTop - padBottom);

            return (
              <g key={tick}>
                <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#e2e8f0" strokeWidth="0.8" />
                <text x={padLeft - 6} y={y + 4} fontSize="9" textAnchor="end" fill="#94a3b8">
                  {tick}
                </text>
              </g>
            );
          })}

          <path d={buildAreaPath(totalLine.path, totalLine.points)} fill="url(#grad-total)" />
          <path d={buildAreaPath(returningLine.path, returningLine.points)} fill="url(#grad-return)" />
          <path d={returningLine.path} fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          <path d={newLine.path} fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          <path d={totalLine.path} fill="none" stroke="#0f766e" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

          {resolvedLabels.map((label, index) => (
            <g key={label}>
              <circle cx={totalLine.points[index].x} cy={totalLine.points[index].y} r="2.5" fill="white" stroke="#0f766e" strokeWidth="1.5" />
              <circle cx={newLine.points[index].x} cy={newLine.points[index].y} r="2.5" fill="white" stroke="#2dd4bf" strokeWidth="1.5" />
              <circle cx={returningLine.points[index].x} cy={returningLine.points[index].y} r="2.5" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
              <text x={totalLine.points[index].x} y={height - 6} fontSize="9.5" textAnchor="middle" fill="#94a3b8">
                {label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
};

export default OrderVolumeTrends;
