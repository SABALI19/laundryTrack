import {
  KeyRound,
  Play,
  RefreshCw,
  Server,
  Trash2,
} from "lucide-react";

const adminActions = [
  {
    label: "Reactivate Tenant Account",
    Icon: Play,
    className: "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600",
  },
  {
    label: "Reset Tenant Password",
    Icon: KeyRound,
    className:
      "border-[var(--color-primary)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]",
  },
  {
    label: "Clear Tenant Cache",
    Icon: Server,
    className:
      "border-[var(--color-primary)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]",
  },
  {
    label: "Generate API Key",
    Icon: KeyRound,
    className:
      "border-[var(--color-primary)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]",
  },
  {
    label: "Suspend Tenant Account",
    Icon: RefreshCw,
    className: "border-orange-500 bg-orange-500 text-white hover:bg-orange-600",
  },
  {
    label: "Delete Tenant Permanently",
    Icon: Trash2,
    className: "border-red-500 bg-red-500 text-white hover:bg-red-600",
  },
];

const AdministrativeControl = () => {
  return (
    <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <h2 className="text-base font-semibold text-slate-900">
        Administrative Controls
      </h2>

      <div className="mt-6 space-y-3">
        {adminActions.map(({ label, Icon, className }) => (
          <button
            key={label}
            type="button"
            className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border px-4 text-xs font-bold transition-colors ${className}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-7">
        <label className="text-[0.82rem] font-medium text-slate-600">
          Admin Notes
          <textarea
            defaultValue={
              "Tenant migrated from legacy system on March 15, 2023. Customer service rating: Excellent. Payment history: No issues."
            }
            className="mt-2 min-h-[110px] w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-[0.78rem] leading-relaxed text-slate-800 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
          />
        </label>
      </div>

      <button
        type="button"
        className="mt-4 inline-flex h-9 items-center rounded-lg bg-[var(--color-primary)] px-4 text-xs font-bold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
      >
        Save Notes
      </button>

      <p className="mt-6 border-t border-slate-100 pt-4 text-[0.72rem] text-slate-400">
        Last action: Configuration updated by Admin User on March 28, 2024 at
        2:45 PM EST
      </p>
    </section>
  );
};

export default AdministrativeControl;
