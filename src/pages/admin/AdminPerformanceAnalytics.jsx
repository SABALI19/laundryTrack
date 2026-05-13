import { createElement, useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Clock3,
  Download,
  DollarSign,
  Package,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import Card from "../../components/Card.jsx";
import useAdminAnalytics from "../../hooks/useAdminAnalytics.js";
import OrderVolumeTrends from "./OrderVolumeTrends.jsx";
import PeakHours from "./PeakHours.jsx";
import CustomerExperience from "./CustomerExperience.jsx";
import FinancialPerformance from "./FinancialPerformance.jsx";
import PickupTimeUtilization from "./PickupTimeUtilization.jsx";
import ProcessingPerformance from "./ProcessingPerformance.jsx";
import StaffMetrics from "./StaffMetrics.jsx";
import { useDashboardLayout } from "../../layouts/DashboardLayoutContext.jsx";

const rangeTabs = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "quarter", label: "Quarter" },
  { key: "year", label: "Year" },
];

const metricIconMap = {
  orders: Package,
  processing: Clock3,
  returning: UsersRound,
  revenue: DollarSign,
};

const fallbackMetrics = [
  {
    change: "+0%",
    detail: "Waiting for live data",
    id: "orders",
    title: "Total Orders",
    value: "0",
  },
  {
    change: "+0%",
    detail: "Waiting for live data",
    id: "processing",
    title: "Avg Completion Time",
    value: "0.0h",
  },
  {
    change: "+0%",
    detail: "Waiting for live data",
    id: "returning",
    title: "Returning Customers",
    value: "0",
  },
  {
    change: "+0%",
    detail: "Waiting for live data",
    id: "revenue",
    title: "Revenue",
    value: "$0.00",
  },
];

const MiniSparkline = () => {
  return (
    <div className="mt-1 overflow-hidden rounded-sm bg-slate-900/5">
      <svg viewBox="0 0 82 18" className="h-[18px] w-[82px]" role="img" aria-label="Orders trend">
        <path
          d="M1 15 L12 11 L22 13 L31 8 L42 10 L53 5 L64 7 L81 2"
          fill="none"
          stroke="#111827"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M1 18 H82 V8 L64 10 L53 7 L42 12 L31 10 L22 15 L12 13 L1 17 Z" fill="#111827" opacity="0.08" />
      </svg>
    </div>
  );
};

const buildReportFileName = (range) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  return `washa-performance-analytics-${range}-${timestamp}.json`;
};

const getHeaderRangeLabel = (range) => {
  const labelMap = {
    day: "Today",
    month: "Last 30 days",
    quarter: "Last 90 days",
    week: "Last 7 days",
    year: "Last 12 months",
  };

  return labelMap[range] || "Last 7 days";
};

const AdminPerformanceAnalytics = () => {
  const [activeRange, setActiveRange] = useState("week");
  const { analytics, error, isLoading } = useAdminAnalytics({ range: activeRange });
  const dashboardLayout = useDashboardLayout();
  const metrics = analytics?.metrics?.length ? analytics.metrics : fallbackMetrics;
  const activeRangeLabel = useMemo(
    () => rangeTabs.find((tab) => tab.key === activeRange)?.label || "Week",
    [activeRange],
  );
  const handleDownloadReport = useCallback(() => {
    const reportPayload = {
      analytics: analytics || {},
      exportedAt: new Date().toISOString(),
      range: activeRange,
      rangeLabel: activeRangeLabel,
    };
    const reportBlob = new Blob([JSON.stringify(reportPayload, null, 2)], {
      type: "application/json",
    });
    const reportUrl = URL.createObjectURL(reportBlob);
    const reportLink = document.createElement("a");

    reportLink.href = reportUrl;
    reportLink.download = buildReportFileName(activeRange);
    reportLink.style.display = "none";
    document.body.appendChild(reportLink);
    reportLink.click();
    reportLink.remove();
    window.setTimeout(() => URL.revokeObjectURL(reportUrl), 0);
  }, [activeRange, activeRangeLabel, analytics]);
  const analyticsHeaderUtility = useMemo(
    () => (
      <div className="flex flex-wrap items-center gap-3 text-[0.75rem]">
        <label className="flex items-center gap-2">
          <span className="text-slate-500">Date Range:</span>
          <select
            value={activeRange}
            onChange={(event) => setActiveRange(event.target.value)}
            disabled={isLoading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 outline-none transition-colors hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Analytics date range"
          >
            {rangeTabs.map((tab) => (
              <option key={tab.key} value={tab.key}>
                {getHeaderRangeLabel(tab.key)}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={handleDownloadReport}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-primary)] bg-white px-4 py-2 font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </button>
      </div>
    ),
    [activeRange, handleDownloadReport, isLoading],
  );

  useEffect(() => {
    if (!dashboardLayout?.setHeaderUtilityContent) {
      return undefined;
    }

    dashboardLayout.setHeaderUtilityContent(analyticsHeaderUtility);

    return () => {
      dashboardLayout.setHeaderUtilityContent(null);
    };
  }, [analyticsHeaderUtility, dashboardLayout]);

  return (
    <section className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-[0.95rem] font-semibold tracking-normal text-slate-900 sm:text-[1rem]">
              Performance Analytics
            </h1>
            <p className="mt-1.5 text-[0.72rem] text-slate-500">
              {analytics?.dateRangeLabel || `${activeRangeLabel} live range`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {rangeTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveRange(tab.key)}
                aria-pressed={activeRange === tab.key}
                disabled={isLoading && activeRange === tab.key}
                className={`rounded-lg px-3 py-2 text-[0.68rem] font-medium transition-colors sm:px-4 ${
                  activeRange === tab.key
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[0.68rem] font-medium text-slate-700 transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] sm:px-4"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Custom Range</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-[0.68rem] font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-[1rem] bg-red-50 px-4 py-3 text-[0.82rem] text-red-600">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="mt-5 rounded-[1rem] bg-white px-4 py-3 text-[0.82rem] text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
            Loading admin analytics...
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metricIconMap[metric.id] || Package;

            return (
              <Card
                key={metric.id}
                className="min-w-0 overflow-hidden rounded-[1rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]"
              >
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <p className="min-w-0 break-words text-[0.78rem] leading-4 text-slate-600">
                    {metric.title}
                  </p>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                    {createElement(Icon, { className: "h-4 w-4" })}
                  </div>
                </div>

                <div className="mt-5 flex min-w-0 items-end justify-between gap-3">
                  <p className="min-w-0 break-words text-[1.75rem] font-semibold leading-none tracking-normal text-slate-900 [overflow-wrap:anywhere]">
                    {metric.value}
                  </p>
                  <div className="shrink-0 text-right">
                    {metric.change ? (
                      <div className="inline-flex max-w-[8rem] items-center justify-end gap-1.5 text-right text-[0.75rem] font-medium text-[#16a34a]">
                        <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                        <span className="break-words [overflow-wrap:anywhere]">
                          {metric.change}
                        </span>
                      </div>
                    ) : (
                      <p className="break-words text-[0.75rem] text-slate-500 [overflow-wrap:anywhere]">
                        {metric.detail}
                      </p>
                    )}
                  </div>
                </div>

                {metric.id === "orders" && (
                  <div className="mt-3">
                    <MiniSparkline />
                  </div>
                )}
                {metric.id !== "orders" && metric.change && metric.detail && (
                  <p className="mt-3 break-words text-[0.72rem] leading-4 text-slate-500 [overflow-wrap:anywhere]">
                    {metric.detail}
                  </p>
                )}
              </Card>
            );
          })}
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <OrderVolumeTrends
            labels={analytics?.orderVolumeTrends?.labels}
            newCustomers={analytics?.orderVolumeTrends?.newCustomers}
            returning={analytics?.orderVolumeTrends?.returning}
            totalOrders={analytics?.orderVolumeTrends?.totalOrders}
          />
          <PeakHours rows={analytics?.peakHours} />
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <ProcessingPerformance
            bars={analytics?.processingPerformance?.bars}
            bottleneck={analytics?.processingPerformance?.bottleneck}
            efficiencyText={analytics?.processingPerformance?.efficiencyText}
          />
          <PickupTimeUtilization
            slots={analytics?.pickupTimeUtilization?.slots}
            summaryItems={analytics?.pickupTimeUtilization?.summaryItems}
          />
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
          <CustomerExperience
            distribution={analytics?.customerExperience?.distribution}
            distributionLabel={analytics?.customerExperience?.distributionLabel}
            distributionLabels={analytics?.customerExperience?.distributionLabels}
            feedbackWords={analytics?.customerExperience?.feedbackWords}
            metricBlocks={analytics?.customerExperience?.metricBlocks}
            wordCloudLabel={analytics?.customerExperience?.wordCloudLabel}
          />
          <StaffMetrics
            primaryColumnLabel={analytics?.staffMetrics?.primaryColumnLabel}
            rows={analytics?.staffMetrics?.rows}
            secondaryColumnLabel={analytics?.staffMetrics?.secondaryColumnLabel}
            tertiaryColumnLabel={analytics?.staffMetrics?.tertiaryColumnLabel}
          />
        </div>

        <div className="mt-5">
          <FinancialPerformance
            dataPoints={analytics?.financialPerformance?.dataPoints}
            metrics={analytics?.financialPerformance?.metrics}
          />
        </div>
      </div>
    </section>
  );
};

export default AdminPerformanceAnalytics;
