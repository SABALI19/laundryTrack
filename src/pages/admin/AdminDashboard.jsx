import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../../components/Button";
import AlertsNotification from "../../components/common/Alerts&Notification.jsx";
import CurrentOrderStatus from "../../components/common/CurrentOrderStatus.jsx";
import OrdervolumeTrend from "../../components/common/OrdervolumeTrend.jsx";
import RecentActivity from "../../components/common/RecentActivity.jsx";
import StatsCards from "../../components/common/StatsCards.jsx";
import Card from "../../components/Card.jsx";
import FabButton from "../../components/common/FabButton.jsx";
import useAdminDashboard from "../../hooks/useAdminDashboard.js";
import AdminSidebar from "../../layouts/AdminSidebar.jsx";
import { useDashboardLayout } from "../../layouts/DashboardLayoutContext.jsx";
import { useLocation } from "react-router-dom";
import {
  Clock3,
  DollarSign,
  Download,
  Package,
  PanelRightOpen,
  RefreshCw,
  Star,
} from "lucide-react";

const statIconMap = {
  "active-orders": Clock3,
  "customer-satisfaction": Star,
  "fulfillment-rate": Star,
  "orders-today": Package,
  "revenue-today": DollarSign,
};

const fallbackReviewCount = 32;

const parseCountValue = (value) => {
  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : null;
};

const getReviewCount = (dashboard, stat) => {
  const reviewCountCandidates = [
    stat?.reviewCount,
    stat?.reviewsCount,
    stat?.reviews?.length,
    dashboard?.customerSatisfaction?.reviewCount,
    dashboard?.customerSatisfaction?.reviewsCount,
    dashboard?.reviewsCount,
    dashboard?.reviewCount,
    dashboard?.reviews?.length,
  ];

  for (const candidate of reviewCountCandidates) {
    const parsedCount = parseCountValue(candidate);

    if (parsedCount !== null) {
      return parsedCount;
    }
  }

  return fallbackReviewCount;
};

const normalizeAdminStat = (stat, dashboard) => {
  if (!["fulfillment-rate", "customer-satisfaction"].includes(stat.id)) {
    return stat;
  }

  const reviewCount = getReviewCount(dashboard, stat);

  return {
    ...stat,
    change: undefined,
    id: "customer-satisfaction",
    subtitle: `${reviewCount} reviews`,
    title: "Customer Satisfaction",
  };
};

const formatGeneratedAt = (value) => {
  if (!value) {
    return "Dashboard unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

const fallbackQuickActions = [
  "View All Orders",
  "Dispute Management",
  "Performance Reports",
  "Staff Schedule",
];

const buildExportFileName = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  return `washa-admin-dashboard-${timestamp}.json`;
};

const AdminDashboard = () => {
  const location = useLocation();
  const dashboardLayout = useDashboardLayout();
  const closeMobileSidebar = dashboardLayout?.closeMobileSidebar;
  const setMobileSidebarContent = dashboardLayout?.setMobileSidebarContent;
  const { dashboard, error, isLoading, refreshDashboard } = useAdminDashboard();
  const [activeDateRange, setActiveDateRange] = useState("today");
  const stats = useMemo(
    () => (dashboard?.stats || []).map((stat) => normalizeAdminStat(stat, dashboard)),
    [dashboard],
  );
  const quickActions = dashboard?.quickActions || fallbackQuickActions;
  const sidebarContent = useMemo(
    () => (
      <AdminSidebar
        activeRange={activeDateRange}
        onNavigate={closeMobileSidebar}
        onRangeChange={setActiveDateRange}
      />
    ),
    [activeDateRange, closeMobileSidebar],
  );

  useEffect(() => {
    if (!setMobileSidebarContent) {
      return undefined;
    }

    setMobileSidebarContent(sidebarContent);

    return () => {
      setMobileSidebarContent(null);
      closeMobileSidebar?.();
    };
  }, [closeMobileSidebar, location.pathname, setMobileSidebarContent, sidebarContent]);

  const handleExportData = useCallback(() => {
    const exportPayload = {
      activeDateRange,
      dashboard: dashboard || {},
      exportedAt: new Date().toISOString(),
      stats,
    };
    const exportBlob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const exportUrl = URL.createObjectURL(exportBlob);
    const exportLink = document.createElement("a");

    exportLink.href = exportUrl;
    exportLink.download = buildExportFileName();
    exportLink.click();
    URL.revokeObjectURL(exportUrl);
  }, [activeDateRange, dashboard, stats]);

  return (
    <section className="min-h-screen bg-[var(--color-surface)]">
      <FabButton
        Icon={PanelRightOpen}
        ariaLabel="Open admin sidebar"
        onClick={dashboardLayout?.openMobileSidebar}
        shapeClassName="rounded-xl"
      />

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6">
        <div className="grid gap-6 xl:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="hidden xl:block">{sidebarContent}</aside>

          <div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-slate-900">
                  Admin Dashboard
                </h1>
                <p className="mt-1.5 text-[0.72rem] text-slate-500">
                  {formatGeneratedAt(dashboard?.generatedAt)}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleExportData}
                  disabled={!dashboard}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[0.75rem] font-medium"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Data</span>
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => refreshDashboard()}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[0.75rem] font-medium"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-[1rem] bg-red-50 px-4 py-3 text-[0.82rem] text-red-600">
                {error}
              </div>
            )}

            {isLoading && (
              <div className="mt-4 rounded-[1rem] bg-white px-4 py-3 text-[0.82rem] text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
                Loading admin dashboard...
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {stats.map((stat) => (
                <StatsCards
                  key={stat.id}
                  {...stat}
                  Icon={statIconMap[stat.id] || Package}
                />
              ))}
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
              <OrdervolumeTrend
                dataPoints={dashboard?.orderVolumeTrend?.dataPoints}
                labels={dashboard?.orderVolumeTrend?.labels}
                title="Today’s Intake Trend"
              />
              <CurrentOrderStatus items={dashboard?.currentOrderStatus?.items} />
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
              <RecentActivity activities={dashboard?.recentActivity} />

              <div className="space-y-4">
                <AlertsNotification alerts={dashboard?.alerts} />

                <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
                  <h2 className="text-[1rem] font-semibold text-slate-900">Quick Actions</h2>

                  <div className="mt-4 space-y-2.5">
                    {quickActions.map((action, index) => (
                      <button
                        key={action}
                        type="button"
                        className="flex w-full items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 text-left text-[0.8rem] font-medium text-slate-800 transition-colors hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-soft)] text-[0.72rem] text-[var(--color-primary)]">
                          {index + 1}
                        </span>
                        <span>{action}</span>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
