const pageCopy = {
  analytics: "System analytics",
  health: "System health",
  settings: "Platform settings",
  support: "Support and documentation",
  tenants: "Tenant management",
};

const SuperAdminPlaceholderPage = ({ page = "tenants" }) => {
  const title = pageCopy[page] || "Super admin";

  return (
    <section className="rounded-2xl bg-white p-8 shadow-[0_4px_18px_rgba(15,23,42,0.10)]">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
        Super Admin
      </p>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 max-w-2xl text-base text-slate-600">
        This page is ready to render inside the super admin dashboard layout.
      </p>
    </section>
  );
};

export default SuperAdminPlaceholderPage;
