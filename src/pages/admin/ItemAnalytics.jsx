import Card from "../../components/Card.jsx";

const ItemAnalytics = () => {
  return (
    <Card className="rounded-[1rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h2 className="text-[1rem] font-semibold text-slate-900">Item Analytics</h2>

      <div className="mt-3 flex justify-center">
        <svg
          viewBox="0 0 220 170"
          className="h-[130px] w-full max-w-[220px]"
          role="img"
          aria-label="Item analytics donut chart"
        >
          <g transform="translate(110,82)">
            <circle r="45" fill="none" stroke="#e2e8f0" strokeWidth="18" />
            <circle
              r="45"
              fill="none"
              stroke="#157f85"
              strokeWidth="18"
              strokeDasharray="113.1 282.7"
              strokeDashoffset="0"
              transform="rotate(-90)"
            />
            <circle
              r="45"
              fill="none"
              stroke="#1f9fa6"
              strokeWidth="18"
              strokeDasharray="73.5 282.7"
              strokeDashoffset="-113.1"
              transform="rotate(-90)"
            />
            <circle
              r="45"
              fill="none"
              stroke="#8dad8f"
              strokeWidth="18"
              strokeDasharray="56.5 282.7"
              strokeDashoffset="-186.6"
              transform="rotate(-90)"
            />
            <circle
              r="45"
              fill="none"
              stroke="#6e8aa1"
              strokeWidth="18"
              strokeDasharray="39.6 282.7"
              strokeDashoffset="-243.1"
              transform="rotate(-90)"
            />
            <circle r="26" fill="white" />
          </g>

          <g className="text-[10px] fill-slate-500">
            <path d="M154 44 H182" stroke="#94a3b8" strokeWidth="1.2" fill="none" />
            <text x="186" y="47">Sh...</text>

            <path d="M134 126 H160" stroke="#94a3b8" strokeWidth="1.2" fill="none" />
            <text x="164" y="129">Pants</text>

            <path d="M66 118 H41" stroke="#94a3b8" strokeWidth="1.2" fill="none" />
            <text x="20" y="121">Ja...</text>

            <path d="M88 34 H61" stroke="#94a3b8" strokeWidth="1.2" fill="none" />
            <text x="44" y="37">Others</text>
          </g>
        </svg>
      </div>

      <div className="mt-3 space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[0.76rem] text-slate-500">Total Items</span>
          <span className="text-[0.82rem] font-medium text-slate-900">3,847</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[0.76rem] text-slate-500">Avg per Order</span>
          <span className="text-[0.82rem] font-medium text-slate-900">3.1</span>
        </div>
      </div>
    </Card>
  );
};

export default ItemAnalytics;
