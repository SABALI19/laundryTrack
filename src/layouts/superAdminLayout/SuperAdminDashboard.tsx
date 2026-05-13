import { Download, Plus, RefreshCw } from "lucide-react";
import Button from "../../components/Button";
import PlatformOverview from "./PlatformOverview";
import RecentActivities from "./RecentActivities";
import SystemHealthIndicators from "./SystemHealthIndicators";
import TenantGrowth from "./TenantGrowth";
import TenantStatusOverView from "./TenantStatusOverView";

const SuperAdminDashboard = () => {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Platform Overview
          </h1>
          <p className="mt-3 text-base text-slate-600">Last updated: Today at 2:45 PM</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button className="inline-flex h-14 items-center gap-3 shadow-sm" fontWeight="bold">
            <Plus className="h-5 w-5" />
            Add New Tenant
          </Button>
          <Button
            variant="secondary"
            className="inline-flex h-14 items-center gap-3 rounded-xl"
            fontWeight="bold"
          >
            <Download className="h-5 w-5" />
            Export Report
          </Button>
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full text-slate-900 transition-colors hover:bg-white"
            aria-label="Refresh dashboard"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </section>

      <PlatformOverview />

      <section className="grid gap-8 xl:grid-cols-[minmax(0,2fr)_370px]">
        <TenantStatusOverView />
        <RecentActivities />
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <SystemHealthIndicators />
        <TenantGrowth />
      </section>
    </div>
  );
};

export default SuperAdminDashboard;
