import { useState } from "react";
import { Search } from "lucide-react";

const tenants = [
  {
    id: 1,
    name: "Clean Express Pro",
    orderVolumeRank: 1,
    revenueRank: 1,
    userEngagement: 95,
    tier: "Elite",
    tierStyle:
      "bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-[var(--color-primary)]/20",
  },
  {
    id: 2,
    name: "Premium Wash Co.",
    orderVolumeRank: 3,
    revenueRank: 2,
    userEngagement: 87,
    tier: "High",
    tierStyle: "bg-slate-100 text-slate-600 border border-slate-200",
  },
  {
    id: 3,
    name: "Super Clean Hub",
    orderVolumeRank: 2,
    revenueRank: 3,
    userEngagement: 82,
    tier: "High",
    tierStyle: "bg-slate-100 text-slate-600 border border-slate-200",
  },
];

const ITEMS_PER_PAGE = 3;
const TOTAL_TENANTS = 247;
const TOTAL_PAGES = 3;

const TenantPerformanceBenchmarking = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = tenants.filter((tenant) =>
    tenant.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="w-full min-w-0 rounded-xl bg-white shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <div className="flex flex-col gap-3 px-5 pb-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          Tenant Performance Benchmarking
        </h2>
        <div className="relative w-full sm:w-[220px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tenants..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[0.78rem] text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
          />
        </div>
      </div>

      <div className="overflow-x-auto overscroll-x-contain scrollbar-hide [touch-action:pan-x]">
        <table className="w-full min-w-[860px] text-left">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50/60">
              {[
                "Tenant Name",
                "Order Volume Rank",
                "Revenue Rank",
                "User Engagement",
                "Performance Tier",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-5 py-3 text-[0.72rem] font-semibold tracking-wide text-slate-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-4 text-[0.85rem] font-semibold text-slate-900">
                  {tenant.name}
                </td>
                <td className="px-5 py-4 text-[0.85rem] text-slate-600">
                  #{tenant.orderVolumeRank}
                </td>
                <td className="px-5 py-4 text-[0.85rem] text-slate-600">
                  #{tenant.revenueRank}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-[160px] overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-[var(--color-primary)]"
                        style={{ width: `${tenant.userEngagement}%` }}
                      />
                    </div>
                    <span className="text-[0.82rem] text-slate-600">
                      {tenant.userEngagement}%
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[0.72rem] font-semibold ${tenant.tierStyle}`}
                  >
                    {tenant.tier}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600"
                    aria-label={`Actions for ${tenant.name}`}
                  >
                    <span className="text-lg font-bold tracking-widest">...</span>
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-[0.82rem] text-slate-400"
                >
                  No tenants match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.75rem] text-slate-500">
          Showing 1-{ITEMS_PER_PAGE} of {TOTAL_TENANTS} tenants
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 disabled:opacity-30"
            aria-label="Previous page"
          >
            &lt;
          </button>

          {Array.from({ length: TOTAL_PAGES }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`flex h-7 w-7 items-center justify-center rounded-md text-[0.78rem] font-medium transition ${
                  currentPage === page
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(page + 1, TOTAL_PAGES))
            }
            disabled={currentPage === TOTAL_PAGES}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 disabled:opacity-30"
            aria-label="Next page"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
};

export default TenantPerformanceBenchmarking;
