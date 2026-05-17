import { Download, Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import PlatformOverview from "./PlatformOverview";
import RecentActivities from "./RecentActivities";
import SystemHealthIndicators from "./SystemHealthIndicators";
import TenantGrowth from "./TenantGrowth";
import TenantStatusOverView from "./TenantStatusOverView";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-5 ">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Platform Overview
          </h1>
          <p className="mt-2 text-xs text-slate-500">Last updated: Today at 2:45 PM</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-lg px-5 text-xs"
            fontWeight="bold"
            onClick={() => navigate("/super-admin/tenants/new")}
          >
            <Plus className="h-3.5 w-3.5" />
            Add New Tenant
          </Button>
          <Button
            variant="secondary"
            className="inline-flex h-10 items-center gap-2 rounded-lg px-5 text-xs"
            fontWeight="bold"
          >
            <Download className="h-3.5 w-3.5" />
            Export Report
          </Button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-900 transition-colors hover:bg-white"
            aria-label="Refresh dashboard"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </section>

      <PlatformOverview />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_320px]">
        <TenantStatusOverView />
        <RecentActivities />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <SystemHealthIndicators />
        <TenantGrowth />
      </section>
    </div>
  );
};

export default SuperAdminDashboard;
