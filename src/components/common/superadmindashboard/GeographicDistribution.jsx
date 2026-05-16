import worldMapUrl from "../../../assets/maps/world.svg";

const regionSummary = [
  { region: "North America", tenants: 156 },
  { region: "Europe", tenants: 78 },
  { region: "Asia Pacific", tenants: 13 },
];

const locationMarkers = [
  { x: 22, y: 45, value: 19 },
  { x: 26, y: 47, value: 10 },
  { x: 29, y: 48, value: 43 },
  { x: 33, y: 67, value: 41 },
  { x: 49, y: 40, value: 23 },
  { x: 53, y: 42, value: 6 },
  { x: 65, y: 46, value: 12 },
  { x: 70, y: 49, value: 96 },
];

const legendItems = [
  ["19", "Resort"],
  ["19", "Farming"],
  ["43", "City"],
  ["19", "Billing"],
  ["14", "Country"],
  ["115", "Faring"],
  ["235", "Long"],
  ["3", "LJoy"],
  ["72", "Peaa"],
  ["57", "Atlay"],
];

const GeographicDistribution = () => {
  return (
    <section className="h-full rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <h2 className="mb-4 text-base font-semibold text-slate-900">
        Geographic Distribution
      </h2>

      <div className="overflow-hidden rounded-lg bg-slate-100">
        {/* Reduced map height from h-[245px] to h-[180px] */}
        <div className="relative h-[180px] overflow-hidden bg-[#104768]">
          <img
            src={worldMapUrl}
            alt="World map"
            className="absolute inset-0 h-full w-full object-cover opacity-95 [filter:brightness(0)_saturate(100%)_invert(48%)_sepia(84%)_saturate(1047%)_hue-rotate(151deg)_brightness(94%)_contrast(97%)]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_40%,rgba(34,211,238,0.24),transparent_34%),linear-gradient(180deg,rgba(8,47,73,0.04),rgba(8,47,73,0.18))]" />

          {locationMarkers.map((marker) => (
            <span
              key={`${marker.x}-${marker.y}`}
              className="absolute flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-cyan-300 text-[0.45rem] font-bold leading-none text-[#0f3b5c] shadow-[0_0_0_3px_rgba(34,211,238,0.22)]"
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            >
              {marker.value}
            </span>
          ))}

          <div className="absolute bottom-5 left-4 w-[108px] rounded-md bg-[#0a2a3f]/80 px-3 py-2 text-white backdrop-blur-sm">
            <p className="mb-1.5 text-[0.58rem] font-bold text-cyan-100">
              Order locations
            </p>
            <div className="space-y-0.5">
              {legendItems.map(([value, label], index) => (
                <div key={`${value}-${label}-${index}`} className="flex items-center gap-1.5">
                  <span
                    className={`flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full text-[0.38rem] font-bold ${
                      index > 7 ? "bg-orange-400" : "bg-cyan-200"
                    } text-[#0f3b5c]`}
                  >
                    {value.slice(0, 1)}
                  </span>
                  <span className="text-[0.54rem] leading-none text-cyan-50">
                    {value} {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map footer legend */}
        <div className="flex h-8 items-center gap-4 border-t border-slate-200 bg-slate-50 px-4 text-[0.65rem] text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            Tenant Location
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0f3b5c]" />
            0
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
            Tenant Country
          </span>
        </div>
      </div>

      {/* Region summary */}
      <div className="mt-4 grid gap-x-8 gap-y-3 text-[0.82rem] sm:grid-cols-2">
        {regionSummary.map(({ region, tenants }) => (
          <div key={region} className="flex items-baseline justify-between gap-4">
            <span className="text-slate-500">{region}</span>
            <span className="font-bold text-slate-900">{tenants} tenants</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GeographicDistribution;