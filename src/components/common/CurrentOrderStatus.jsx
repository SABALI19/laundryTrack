import Card from "../Card";

const fallbackItems = [
  { color: "#157f85", label: "Pending Verification", value: "29%" },
  { color: "#1f9fa6", label: "Washing", value: "23%" },
  { color: "#8dad8f", label: "Ready for Pickup", value: "14%" },
  { color: "#6e8aa1", label: "Drying", value: "18%" },
  { color: "#7ea0b0", label: "Ironing", value: "16%" },
];

const getNumericPercent = (value) => {
  const parsedValue = Number.parseFloat(String(value || "").replace("%", ""));
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const buildGradient = (items) => {
  const segments = [];
  let currentOffset = 0;

  items.forEach((item) => {
    const nextOffset = currentOffset + getNumericPercent(item.value);
    segments.push(`${item.color} ${currentOffset}% ${nextOffset}%`);
    currentOffset = nextOffset;
  });

  return `conic-gradient(${segments.join(", ")})`;
};

const CurrentOrderStatus = ({ items = fallbackItems, title = "Current Order Status" }) => {
  const resolvedItems = items.length > 0 ? items : fallbackItems;

  return (
    <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h2 className="text-[1.15rem] font-semibold text-slate-900">{title}</h2>

      <div className="mt-5 flex justify-center">
        <div
          className="relative h-36 w-36 rounded-full"
          style={{
            background: buildGradient(resolvedItems),
          }}
        >
          <div className="absolute inset-5 rounded-full bg-white" />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {resolvedItems.slice(0, 4).map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[0.82rem] text-slate-600">{item.label}</span>
            </div>
            <span className="text-[0.82rem] font-semibold text-slate-900">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CurrentOrderStatus;
