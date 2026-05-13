const Quickfilter = ({ activeFilter = "all", filters = [], onFilterChange }) => {
  return (
    <section className="rounded-[1.4rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
      <h2 className="text-[0.95rem] font-semibold text-slate-900">
        Quick Filters
      </h2>

      <div className="mt-4 space-y-2.5">
        {filters.map((filter) => (
          <button
            key={filter.key || filter.label}
            type="button"
            onClick={() => onFilterChange?.(filter.key)}
            className={`flex w-full items-center justify-between rounded-full border px-4 py-2.5 text-[0.82rem] font-medium transition-colors ${
              activeFilter === filter.key
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "border-slate-200 text-slate-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            }`}
          >
            <span>{filter.label}</span>
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-[0.72rem] font-semibold">
              {filter.count ?? 0}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Quickfilter;
