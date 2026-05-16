import { Save } from "lucide-react";

const featureFlags = [
  "Advanced Analytics",
  "API Access",
  "Multi-location Support",
];

const Toggle = () => (
  <button
    type="button"
    className="relative h-7 w-14 rounded-full bg-[var(--color-primary-soft)] transition-colors"
    aria-label="Toggle setting"
  >
    <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm" />
  </button>
);

const Configuration = () => {
  return (
    <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-base font-semibold text-slate-900">Configuration</h2>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          <Save className="h-3.5 w-3.5" />
          Save Configuration
        </button>
      </div>

      <div className="mt-7">
        <h3 className="text-[0.82rem] font-semibold text-slate-900">
          Feature Flags
        </h3>
        <div className="mt-4 space-y-4">
          {featureFlags.map((flag) => (
            <div key={flag} className="flex items-center justify-between gap-5">
              <span className="text-[0.82rem] text-slate-800">{flag}</span>
              <Toggle />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-[0.82rem] font-semibold text-slate-900">
          Operational Settings
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-[0.76rem] text-slate-500">Timezone</span>
            <input
              value="EST (UTC-5)"
              readOnly
              className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[0.82rem] text-slate-800 outline-none"
            />
          </label>
          <label>
            <span className="text-[0.76rem] text-slate-500">Currency</span>
            <input
              value="USD"
              readOnly
              className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[0.82rem] text-slate-800 outline-none"
            />
          </label>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-[0.82rem] font-semibold text-slate-900">
          Custom Limits
        </h3>
        <div className="mt-4 space-y-4 text-[0.82rem]">
          {[
            ["Max Staff Users", "50"],
            ["Max Customers", "Unlimited"],
            ["Storage Quota", "10 GB"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <span className="text-slate-600">{label}</span>
              <span className="font-semibold text-slate-900">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Configuration;
