import { ExternalLink, MoreVertical, Pencil } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import BusinessProfile from "./BusinessProfile";
import SubscriptionBilling from "./Subscription&Billing";
import UsageStatistics from "./UsageStatistics";
import Configuration from "./Configuration";
import AdministrativeControl from "./AdministrativeControl";
import RecentActivity from "./RecentActivity";

const tenantNameBySlug = {
  "clean-express": "Clean Express",
  "wash-go": "Wash & Go",
  "quickclean-pro": "QuickClean Pro",
  "fresh-laundry-co": "Fresh Laundry Co.",
  "sparkle-suds": "Sparkle Suds",
  "bubble-bliss": "Bubble Bliss",
};

const formatTenantName = (slug = "") =>
  tenantNameBySlug[slug] ||
  slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") ||
  "Tenant";

const detailTabs = [
  "Overview",
  "Settings",
  "Usage & Billing",
  "Audit Log",
  "Support Tickets",
];

const TenantDetails = () => {
  const { tenantSlug } = useParams();
  const tenantName = formatTenantName(tenantSlug);

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4">
        <nav className="flex items-center gap-2 text-[0.78rem]">
          <Link
            to="/super-admin/tenants"
            className="font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
          >
            Tenant Management
          </Link>
          <span className="text-slate-400">&gt;</span>
          <span className="text-slate-600">{tenantName}</span>
        </nav>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-slate-950">
              {tenantName}
            </h1>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[0.72rem] font-semibold text-emerald-700">
              Active
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Access Tenant Dashboard
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-primary)] bg-white px-6 text-xs font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)]"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Tenant
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-primary)] bg-white px-6 text-xs font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)]"
            >
              <MoreVertical className="h-3.5 w-3.5" />
              More Actions
            </button>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {detailTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`h-10 shrink-0 rounded-t-lg px-5 text-[0.78rem] font-medium transition-colors ${
                tab === "Overview"
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-slate-600 hover:bg-white hover:text-[var(--color-primary)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <BusinessProfile />
        <SubscriptionBilling />
      </section>

      <UsageStatistics />

      <section className="grid gap-5 xl:grid-cols-2">
        <Configuration />
        <AdministrativeControl />
      </section>

      <RecentActivity />
    </div>
  );
};

export default TenantDetails;
