import {
  Box,
  ChevronDown,
  Download,
  DollarSign,
  Percent,
  RefreshCw,
  Star,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import RevenueAnalytics from "../../components/common/superadmindashboard/RevenueAnalytics";
import TenantGrowthRetention from "../../components/common/superadmindashboard/TenantGrowth&Retention";
import FeatureAdoption from "../../components/common/superadmindashboard/FeatureAdoption";
import SystemPerformance from "../../components/common/superadmindashboard/SystemPerformance";
import TopRevenueTenants from "../../components/common/superadmindashboard/TopRevenueTenants";
import GeographicDistribution from "../../components/common/superadmindashboard/GeographicDistribution";
import CustomerSuccessMetrics from "../../components/common/superadmindashboard/CustomerSuccessMetrics";
import TenantPerformanceBenchmarking from "../../components/common/superadmindashboard/TenantPerformanceBenchmarking";

const analyticsStats = [
  {
    label: "Total Platform Revenue",
    value: "$2.4M",
    change: "+18.3%",
    Icon: DollarSign,
    iconClass: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  },
  {
    label: "Total Orders Processed",
    value: "487K",
    change: "+23.7%",
    Icon: Box,
    iconClass: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  },
  {
    label: "Avg Revenue Per Tenant",
    value: "$9.8K",
    change: "+12.4%",
    Icon: TrendingUp,
    iconClass: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  },
  {
    label: "Platform Growth Rate",
    value: "34.2%",
    detail: "YoY",
    Icon: Percent,
    iconClass: "bg-emerald-100 text-emerald-600",
    valueClass: "text-emerald-600",
  },
  {
    label: "Total Active Users",
    value: "127K",
    change: "+29.1%",
    Icon: UsersRound,
    iconClass: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  },
  {
    label: "Customer Satisfaction",
    value: "4.8",
    detail: "Average",
    Icon: Star,
    iconClass: "bg-blue-100 text-blue-600",
    valueClass: "text-blue-600",
  },
];

const SystemAnalytics = () => {
  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-950">
            System Analytics
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            Comprehensive platform metrics and performance insights
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-medium text-slate-900 shadow-sm transition-colors hover:border-[var(--color-primary)]"
          >
            Last 7 days
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg px-2 text-xs font-semibold text-slate-900 transition-colors hover:bg-white"
          >
            <Download className="h-3.5 w-3.5" />
            Export
            <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-900 transition-colors hover:bg-white"
            aria-label="Refresh analytics"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {analyticsStats.map(
          ({ label, value, change, detail, Icon, iconClass, valueClass }) => (
            <article
              key={label}
              className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-medium text-slate-950">{label}</h2>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-5 flex items-end gap-3">
                <p
                  className={`text-3xl font-bold tracking-normal ${
                    valueClass || "text-slate-950"
                  }`}
                >
                  {value}
                </p>
                {change && (
                  <span className="inline-flex items-center gap-1 pb-1 text-xs font-medium text-emerald-600">
                    <TrendingUp className="h-3 w-3" />
                    {change}
                  </span>
                )}
                {detail && (
                  <span className="pb-1 text-xs font-medium text-slate-500">
                    {detail}
                  </span>
                )}
              </div>
            </article>
          ),
        )}
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <RevenueAnalytics />
        <TenantGrowthRetention />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <FeatureAdoption />
        <SystemPerformance />
        <TopRevenueTenants />
      </section>

      <section className="grid items-stretch gap-5 xl:grid-cols-2">
        <GeographicDistribution />
        <CustomerSuccessMetrics />
      </section>
      <section>
        <TenantPerformanceBenchmarking />
      </section>
    </div>
  );
};

export default SystemAnalytics;
