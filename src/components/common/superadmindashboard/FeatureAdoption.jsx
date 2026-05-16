const features = [
  { label: "API", value: 45 },
  { label: "Mobile App", value: 92 },
  { label: "Automation", value: 68 },
  { label: "Reports", value: 76 },
  { label: "Analytics", value: 84 },
];

const axisLabels = [0, 20, 40, 60, 80, 100];

const FeatureAdoption = () => {
  return (
    <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <h2 className="text-base font-semibold text-slate-900">
        Feature Adoption
      </h2>

      <div className="mt-6 grid grid-cols-[74px_1fr] gap-x-3">
        <div className="space-y-4 pt-1 text-right text-[0.72rem] font-medium text-slate-500">
          {features.map((feature) => (
            <p key={feature.label}>{feature.label}</p>
          ))}
        </div>

        <div>
          <div className="relative space-y-3.5">
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 grid grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className="border-l border-slate-200/80 first:border-l-0"
                />
              ))}
            </div>

            {features.map((feature) => (
              <div key={feature.label} className="relative h-5">
                <span
                  className="block h-full rounded-sm bg-[var(--color-primary)]"
                  style={{ width: `${feature.value}%` }}
                />
              </div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-6 text-center text-[0.68rem] font-medium text-slate-400">
            {axisLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureAdoption;
