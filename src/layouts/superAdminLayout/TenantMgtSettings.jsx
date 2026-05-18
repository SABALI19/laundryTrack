import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, RotateCcw, Save } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/Button";
import TenantGeneralSetting from "../../components/common/superadmindashboard/TenantGeneralSetting";
import { apiRequest } from "../../utils/auth";
import {
  normalizeTenantDetailResponse,
  normalizeTenantSettingsResponse,
} from "../../utils/superadminTenants";

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

const tabs = [
  { id: "general", label: "General Settings" },
  { id: "features", label: "Feature Flags" },
  { id: "resources", label: "Resource Limits" },
  { id: "custom", label: "Custom Configuration" },
  { id: "security", label: "Security Settings" },
  { id: "notifications", label: "Email & Notifications" },
];

const featureFlags = [
  {
    name: "Customer self-service portal",
    description: "Allow tenant customers to place orders and track status.",
    enabled: true,
  },
  {
    name: "Automated pickup scheduling",
    description: "Enable recurring pickup windows and reminders.",
    enabled: true,
  },
  {
    name: "Advanced revenue analytics",
    description: "Expose deeper trend reports in the tenant dashboard.",
    enabled: false,
  },
];

const resourceLimits = [
  { label: "Monthly orders", value: "5,000", usage: "68%" },
  { label: "Active users", value: "75", usage: "37%" },
  { label: "Storage allocation", value: "120 GB", usage: "54%" },
];

const ToggleRow = ({ name, description, enabled }) => (
  <div className="flex flex-col gap-4 rounded-lg border border-slate-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h3 className="text-sm font-bold text-slate-950">{name}</h3>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
    <label
      className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors ${
        enabled ? "bg-[var(--color-primary)]" : "bg-[var(--color-primary-soft)]"
      }`}
    >
      <input type="checkbox" defaultChecked={enabled} className="peer sr-only" />
      <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
    </label>
  </div>
);

const FeatureFlags = () => (
  <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:p-6">
    <h2 className="text-lg font-semibold text-slate-950">Feature Flags</h2>
    <p className="mt-2 text-sm text-slate-500">
      Control which tenant capabilities are available for Clean Express.
    </p>
    <div className="mt-6 space-y-3">
      {featureFlags.map((feature) => (
        <ToggleRow key={feature.name} {...feature} />
      ))}
    </div>
  </section>
);

const ResourceLimits = () => (
  <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:p-6">
    <h2 className="text-lg font-semibold text-slate-950">Resource Limits</h2>
    <p className="mt-2 text-sm text-slate-500">
      Review allocation limits and current utilization for this tenant.
    </p>
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {resourceLimits.map((item) => (
        <article
          key={item.label}
          className="rounded-lg border border-slate-100 bg-white p-4"
        >
          <p className="text-xs font-semibold text-slate-500">{item.label}</p>
          <p className="mt-3 text-2xl font-bold text-slate-950">{item.value}</p>
          <div className="mt-4 h-2 rounded-full bg-[var(--color-primary-soft)]">
            <div
              className="h-full rounded-full bg-[var(--color-primary)]"
              style={{ width: item.usage }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">{item.usage} used</p>
        </article>
      ))}
    </div>
  </section>
);

const ComingSoonPanel = ({ label }) => (
  <section className="rounded-xl bg-white p-6 text-center shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
    <h2 className="text-lg font-semibold text-slate-950">{label}</h2>
    <p className="mt-2 text-sm text-slate-500">
      This settings area is ready for its controls.
    </p>
  </section>
);

const TenantMgtSettings = () => {
  const { tenantSlug } = useParams();
  const [tenant, setTenant] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const tenantName = tenant?.name || formatTenantName(tenantSlug);
  const tenantStatus = tenant?.status || "Active";
  const activeTabLabel =
    tabs.find((tab) => tab.id === activeTab)?.label || "General Settings";

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      setIsLoading(true);
      setSettingsError("");

      try {
        const [tenantData, settingsData] = await Promise.all([
          apiRequest(`/superadmin/tenants/${tenantSlug}`),
          apiRequest(`/superadmin/tenants/${tenantSlug}/settings`),
        ]);

        if (isMounted) {
          setTenant(normalizeTenantDetailResponse(tenantData));
          setSettings(normalizeTenantSettingsResponse(settingsData));
        }
      } catch (error) {
        if (isMounted) {
          setSettingsError(error.message || "Unable to load tenant settings.");
          setTenant(null);
          setSettings(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, [tenantSlug]);

  const handleSaveGeneralSettings = async (generalSettings) => {
    const data = await apiRequest(
      `/superadmin/tenants/${tenantSlug}/settings/general`,
      {
        body: JSON.stringify(generalSettings),
        method: "PATCH",
      },
    );
    setSettings(normalizeTenantSettingsResponse(data));
  };

  const renderActiveTab = () => {
    if (activeTab === "general") {
      return (
        <TenantGeneralSetting
          settings={settings}
          onSave={handleSaveGeneralSettings}
        />
      );
    }
    if (activeTab === "features") return <FeatureFlags />;
    if (activeTab === "resources") return <ResourceLimits />;

    return <ComingSoonPanel label={activeTabLabel} />;
  };

  return (
    <div className="space-y-6">
      <section className="space-y-5">
        <nav className="flex flex-wrap items-center gap-2 text-[0.78rem]">
          <Link
            to="/super-admin/tenants"
            className="font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
          >
            Tenant Management
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <Link
            to={`/super-admin/tenants/${tenantSlug}`}
            className="font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
          >
            {tenantName}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-500">Settings</span>
        </nav>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-950">
                {tenantName} Settings
              </h1>
              <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {isLoading ? "Loading" : tenantStatus}
              </span>
            </div>
            <p className="mt-5 text-sm text-slate-500">
              Last modified: December 15, 2024, 2:30 PM by{" "}
              <span className="font-bold text-slate-900">Sarah Chen</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="sm"
              fontWeight="bold"
              className="inline-flex h-11 items-center gap-2 rounded-lg px-6 text-xs"
            >
              <Save className="h-3.5 w-3.5" />
              Save All Changes
            </Button>
            <Button
              variant="secondary"
              size="sm"
              fontWeight="bold"
              className="inline-flex h-11 items-center gap-2 rounded-lg px-6 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset to Defaults
            </Button>
            <Link
              to={`/super-admin/tenants/${tenantSlug}`}
              className="inline-flex h-11 items-center gap-2 rounded-lg px-2 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Tenant Details
            </Link>
          </div>
        </div>
      </section>

      {settingsError && (
        <p className="rounded-lg bg-orange-50 px-4 py-3 text-xs font-medium text-orange-700">
          {settingsError} Showing mock tenant settings until the API responds.
        </p>
      )}

      <section className="border-b border-slate-200">
        <div className="flex items-center gap-5 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`h-11 shrink-0 border-b-2 px-1 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                    : "border-transparent text-slate-500 hover:text-[var(--color-primary)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {renderActiveTab()}
    </div>
  );
};

export default TenantMgtSettings;
