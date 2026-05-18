export const getTenantId = (tenant) =>
  tenant?._id || tenant?.id || tenant?.tenantId || tenant?.slug || "";

export const formatTenantNameFromSlug = (slug = "") =>
  String(slug || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Tenant";

export const normalizeTenant = (tenant = {}) => {
  const tenantId = getTenantId(tenant);
  const name =
    tenant.name ||
    tenant.businessName ||
    tenant.legalName ||
    tenant.tradingName ||
    formatTenantNameFromSlug(tenant.slug || tenantId);
  const subscriptionTier =
    tenant.subscriptionTier || tenant.tier || tenant.plan || "Basic";
  const status = tenant.status || "Active";
  const orders =
    tenant.orders30d ??
    tenant.ordersLast30Days ??
    tenant.orderCount ??
    tenant.orders ??
    0;
  const activeUsers =
    tenant.activeUsers ??
    tenant.userCount ??
    tenant.users ??
    tenant.staffCount ??
    0;
  const revenue =
    tenant.monthlyRevenue ??
    tenant.revenue ??
    tenant.currentMonthRevenue ??
    0;

  return {
    ...tenant,
    id: tenantId,
    name,
    slug: tenant.slug || tenantId,
    subscriptionTier,
    status,
    orders,
    activeUsers,
    monthlyRevenue: revenue,
  };
};

export const normalizeTenantListResponse = (data) => {
  const source =
    data?.tenants ||
    data?.data?.tenants ||
    data?.data ||
    data?.items ||
    (Array.isArray(data) ? data : []);

  return Array.isArray(source) ? source.map(normalizeTenant) : [];
};

export const normalizeTenantDetailResponse = (data) =>
  normalizeTenant(data?.tenant || data?.data?.tenant || data?.data || data);

export const normalizeTenantSettingsResponse = (data) =>
  data?.settings || data?.data?.settings || data?.data || data || {};

export const formatCurrency = (value) => {
  if (typeof value === "string") {
    return value.startsWith("$") ? value : value;
  }

  const numberValue = Number(value || 0);

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(numberValue);
};
