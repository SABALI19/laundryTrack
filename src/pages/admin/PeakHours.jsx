import Card from "../../components/Card.jsx";

const fallbackRows = [
  { label: "6-9 AM", value: 124 },
  { label: "9-12 PM", value: 189 },
  { label: "12-3 PM", value: 156 },
  { label: "3-6 PM", value: 142 },
  { label: "6-9 PM", value: 98 },
];

const PeakHours = ({ rows = fallbackRows }) => {
  const resolvedRows = rows.length > 0 ? rows : fallbackRows;
  const peakMax = Math.max(...resolvedRows.map((row) => row.value), 1);

  return (
    <Card className="rounded-[1rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h2 className="mb-4 text-[1rem] font-semibold text-slate-900">Peak Hours</h2>

      <div className="space-y-3">
        {resolvedRows.map((row) => {
          const percent = (row.value / peakMax) * 100;

          return (
            <div key={row.label} className="flex items-center gap-3">
              <span className="w-14 flex-shrink-0 text-xs text-gray-600">{row.label}</span>
              <div className="h-2 flex-1 rounded-full bg-gray-100">
                <div className="h-2 rounded-full" style={{ width: `${percent}%`, backgroundColor: "var(--color-primary)" }} />
              </div>
              <span className="w-8 text-right text-xs font-semibold text-gray-700">{row.value}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PeakHours;
