import {
  Building2,
  CreditCard,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  UsersRound,
  WashingMachine,
} from "lucide-react";

const stats = [
  {
    label: "Total Tenants",
    value: "247",
    change: "+12%",
    tone: "normal",
    Icon: Building2,
  },
  {
    label: "Active Subscriptions",
    value: "189",
    detail: "76.5%",
    tone: "normal",
    Icon: CreditCard,
  },
  {
    label: "Platform Revenue",
    value: "$89.2K",
    change: "+8.3%",
    tone: "normal",
    Icon: DollarSign,
  },
  {
    label: "System Health",
    value: "98.9%",
    detail: "Excellent",
    tone: "success",
    Icon: ShieldCheck,
  },
  {
    label: "Orders Processed",
    value: "15.8K",
    change: "+23%",
    tone: "normal",
    Icon: WashingMachine,
  },
  {
    label: "Active Users",
    value: "3.2K",
    change: "+15.7%",
    tone: "normal",
    Icon: UsersRound,
  },
];

const PlatformOverview = () => {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {stats.map(({ label, value, change, detail, tone, Icon }) => (
        <article
          key={label}
          className="rounded-2xl bg-white p-7 shadow-[0_4px_18px_rgba(15,23,42,0.10)]"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-bold text-slate-900">{label}</h3>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              <Icon className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-7 flex items-end gap-4">
            <p
              className={`text-4xl font-bold tracking-normal ${
                tone === "success" ? "text-emerald-600" : "text-slate-950"
              }`}
            >
              {value}
            </p>
            {change && (
              <span className="inline-flex items-center gap-1 pb-1 text-sm font-medium text-emerald-600">
                <TrendingUp className="h-4 w-4" />
                {change}
              </span>
            )}
            {detail && (
              <span className="pb-1 text-sm font-medium text-slate-500">
                {detail}
              </span>
            )}
          </div>
        </article>
      ))}
    </section>
  );
};

export default PlatformOverview;
