import Button from "../../components/Button";
import Card from "../../components/Card";
import useAdminDisputes from "../../hooks/useAdminDisputes.js";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  TrendingDown,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

const fallbackStatusFilters = ["All", "Open", "In Review", "Resolved", "Closed"];
const fallbackDisputes = [
  {
    assignedTo: "Operations Team",
    createdAtLabel: "Dec 15, 2024 at 10:30 AM",
    customer: "Sarah Chen",
    description: "Customer claims missing white dress shirt from dry cleaning order.",
    id: "DIS-2024-001",
    orderId: "LT-2024-1280",
    priority: "High Priority",
    status: "Open",
    type: "Missing Item",
    updatedAt: "2 hours ago",
  },
];

const statusClassNameMap = {
  Closed: "bg-slate-100 text-slate-600",
  "In Review": "bg-[#eff6ff] text-[#1d4ed8]",
  Open: "bg-[#fffbeb] text-[#a16207]",
  Resolved: "bg-[#ecfdf5] text-[#047857]",
};

const priorityClassNameMap = {
  "High Priority": "bg-[#fff1f2] text-[#dc2626]",
  "Low Priority": "bg-slate-100 text-slate-600",
  "Medium Priority": "bg-[#fff7ed] text-[#a16207]",
};

const typeClassNameMap = {
  Damage: "bg-[#fff1f2] text-[#dc2626]",
  "Missing Item": "bg-[#eff6ff] text-[#1d4ed8]",
  "Quality Issue": "bg-[#f5f3ff] text-[#7c3aed]",
  "Wrong Item": "bg-[#f5f3ff] text-[#7c3aed]",
};

const colorPalette = ["#157f85", "#1f9fa6", "#8dad8f", "#6e8aa1", "#cbd5e1"];

const buildDisputesExportFileName = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  return `washa-disputes-${timestamp}.json`;
};

const DisputeManagement = () => {
  const { disputesDashboard, error, isLoading } = useAdminDisputes();
  const [activeStatus, setActiveStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const statusFilters = disputesDashboard?.statusFilters || fallbackStatusFilters;
  const disputes = disputesDashboard?.disputes || fallbackDisputes;
  const filteredDisputes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return disputes.filter((dispute) => {
      const matchesStatus = activeStatus === "All" || dispute.status === activeStatus;
      const matchesQuery =
        !normalizedQuery ||
        dispute.customer.toLowerCase().includes(normalizedQuery) ||
        dispute.orderId.toLowerCase().includes(normalizedQuery) ||
        dispute.id.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [activeStatus, disputes, searchQuery]);
  const commonReasons = disputesDashboard?.summary?.commonReasons || [];
  const resolutionRates = disputesDashboard?.summary?.resolutionRates || [];
  const handleExportDisputes = useCallback(() => {
    const exportPayload = {
      activeStatus,
      disputes: filteredDisputes,
      exportedAt: new Date().toISOString(),
      searchQuery,
      summary: disputesDashboard?.summary || {},
      totalExported: filteredDisputes.length,
    };
    const exportBlob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const exportUrl = URL.createObjectURL(exportBlob);
    const exportLink = document.createElement("a");

    exportLink.href = exportUrl;
    exportLink.download = buildDisputesExportFileName();
    exportLink.style.display = "none";
    document.body.appendChild(exportLink);
    exportLink.click();
    exportLink.remove();
    window.setTimeout(() => URL.revokeObjectURL(exportUrl), 0);
  }, [activeStatus, disputesDashboard?.summary, filteredDisputes, searchQuery]);

  return (
    <section className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-slate-900">
              Dispute Management
            </h1>
            <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-[0.72rem] font-semibold text-[var(--color-primary)]">
              {disputesDashboard?.activeCount || 0} Active
            </span>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={handleExportDisputes}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[0.75rem] font-medium"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Disputes</span>
          </Button>
        </div>

        {error && (
          <div className="mt-4 rounded-[1rem] bg-red-50 px-4 py-3 text-[0.82rem] text-red-600">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="mt-4 rounded-[1rem] bg-white px-4 py-3 text-[0.82rem] text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
            Loading disputes...
          </div>
        )}

        <Card className="mt-4 rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
          <div className="grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[0.78rem] font-semibold text-slate-900">Status:</span>
              {statusFilters.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveStatus(status)}
                  className={`rounded-full border px-3 py-1.5 text-[0.72rem] transition-colors ${
                    activeStatus === status
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                      : "border-slate-200 text-slate-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[0.78rem] font-semibold text-slate-900">Customer:</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search customer or order..."
                className="min-w-[220px] rounded-xl border border-slate-200 px-3 py-2 text-[0.72rem] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </Card>

        <div className="mt-4 space-y-4">
          {filteredDisputes.map((dispute) => (
            <Card
              key={dispute.id}
              className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[1rem] font-semibold text-slate-900">#{dispute.id}</h2>
                    <span className={`rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${priorityClassNameMap[dispute.priority] || priorityClassNameMap["Low Priority"]}`}>
                      {dispute.priority}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${statusClassNameMap[dispute.status] || statusClassNameMap.Closed}`}>
                      {dispute.status}
                    </span>
                  </div>

                  <p className="mt-2 text-[0.72rem] text-slate-500">Created: {dispute.createdAtLabel}</p>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="rounded-xl px-4 py-2 text-[0.75rem] font-medium"
                >
                  Review
                </Button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="text-[0.7rem] text-slate-500">Customer</p>
                  <p className="mt-1.5 text-[0.82rem] font-semibold text-slate-900">{dispute.customer}</p>
                </div>
                <div>
                  <p className="text-[0.7rem] text-slate-500">Order ID</p>
                  <p className="mt-1.5 text-[0.82rem] font-semibold text-[var(--color-primary)]">#{dispute.orderId}</p>
                </div>
                <div>
                  <p className="text-[0.7rem] text-slate-500">Type</p>
                  <span className={`mt-1.5 inline-flex rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${typeClassNameMap[dispute.type] || typeClassNameMap["Quality Issue"]}`}>
                    {dispute.type}
                  </span>
                </div>
                <div>
                  <p className="text-[0.7rem] text-slate-500">Assigned to</p>
                  <p className="mt-1.5 text-[0.82rem] text-slate-900">{dispute.assignedTo}</p>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-[0.78rem] leading-6 text-slate-800">{dispute.description}</p>
                <p className="mt-2 text-[0.7rem] text-slate-500">Last updated: {dispute.updatedAt}</p>
              </div>
            </Card>
          ))}

          {filteredDisputes.length === 0 && (
            <Card className="rounded-[1.2rem] border-slate-100 p-4 text-[0.82rem] text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
              No disputes matched the selected filters.
            </Card>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button type="button" className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-[0.72rem] font-semibold text-white"
          >
            1
          </button>
          <button type="button" className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
            <h2 className="text-[1rem] font-semibold text-slate-900">Average Resolution Time</h2>

            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-[1.9rem] font-semibold tracking-[-0.03em] text-slate-900">
                  {disputesDashboard?.summary?.averageResolutionDays || "0.0"}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[0.72rem] font-medium text-[#16a34a]">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>{disputesDashboard?.summary?.averageResolutionDelta || "-0.0 days"}</span>
                  <span className="font-normal text-slate-500">vs baseline</span>
                </div>
              </div>
              <p className="pb-1 text-[0.78rem] text-slate-500">days</p>
            </div>
          </Card>

          <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
            <h2 className="text-[1rem] font-semibold text-slate-900">Resolution Rate</h2>

            <div className="mt-4 space-y-3">
              {resolutionRates.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4">
                  <span className="text-[0.78rem] text-slate-600">{item.label}</span>
                  <span className="text-[0.78rem] font-semibold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
            <h2 className="text-[1rem] font-semibold text-slate-900">Common Reasons</h2>

            <div className="mt-4 flex justify-center">
              <div
                className="relative h-28 w-28 rounded-full"
                style={{
                  background:
                    commonReasons.length > 0
                      ? `conic-gradient(${commonReasons
                          .map((reason, index) => {
                            const total = commonReasons.reduce((sum, item) => sum + item.value, 0) || 1;
                            const start = commonReasons
                              .slice(0, index)
                              .reduce((sum, item) => sum + item.value, 0);
                            const end = start + reason.value;
                            return `${colorPalette[index % colorPalette.length]} ${(start / total) * 100}% ${(end / total) * 100}%`;
                          })
                          .join(", ")})`
                      : "conic-gradient(#157f85 0% 100%)",
                }}
              >
                <div className="absolute inset-4 rounded-full bg-white" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {commonReasons.map((reason, index) => (
                <div key={reason.label} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
                  />
                  <span className="text-[0.7rem] text-slate-600">{reason.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DisputeManagement;
