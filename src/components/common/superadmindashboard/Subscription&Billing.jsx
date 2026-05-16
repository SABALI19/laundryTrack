import { CreditCard, RefreshCw } from "lucide-react";

const billingRows = [
  ["Base Subscription", "$99.00"],
  ["Usage Charges", "$125.50"],
];

const SubscriptionBilling = () => {
  return (
    <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <h2 className="text-base font-semibold text-slate-900">
        Subscription & Billing
      </h2>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-[0.72rem] font-semibold text-[var(--color-primary)]">
          Professional
        </span>
        <span className="text-[0.78rem] text-slate-500">Monthly Billing</span>
      </div>
      <p className="mt-3 text-[0.78rem] text-slate-600">
        Next billing: April 15, 2024
      </p>

      <div className="mt-6">
        <p className="text-[0.76rem] font-medium text-slate-600">
          Payment Method
        </p>
        <div className="mt-3 flex items-center gap-3 text-[0.82rem] font-semibold text-slate-900">
          <CreditCard className="h-3.5 w-3.5 text-slate-500" />
          <span>•••• •••• •••• 4567</span>
        </div>
      </div>

      <div className="mt-6 space-y-4 border-b border-slate-100 pb-4">
        {billingRows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 text-[0.82rem]">
            <span className="text-slate-600">{label}</span>
            <span className="font-semibold text-slate-900">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 text-[0.88rem]">
        <span className="font-bold text-slate-900">Total Monthly Cost</span>
        <span className="font-bold text-slate-950">$224.50</span>
      </div>

      <button
        type="button"
        className="mt-7 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-primary)] bg-white px-4 text-xs font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)]"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Change Subscription Tier
      </button>

      <div className="mt-4 flex items-center justify-around gap-4 text-[0.76rem] font-medium text-[var(--color-primary)]">
        <button type="button" className="transition-colors hover:text-[var(--color-primary-hover)]">
          View Billing History
        </button>
        <button type="button" className="transition-colors hover:text-[var(--color-primary-hover)]">
          Update Payment
        </button>
      </div>
    </section>
  );
};

export default SubscriptionBilling;
