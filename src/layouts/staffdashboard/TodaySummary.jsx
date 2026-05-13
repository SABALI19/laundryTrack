const TodaySummary = ({ summaryItems = [] }) => {
  return (
    <section className="rounded-[1.4rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
      <h2 className="text-[0.95rem] font-semibold text-slate-900">
        Today's Summary
      </h2>

      <div className="mt-4 space-y-3.5">
        {summaryItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3">
            <span className="text-[0.8rem] leading-5 text-slate-500">
              {item.label}
            </span>
            <span className="text-[0.95rem] font-semibold text-[var(--color-primary)]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TodaySummary;
