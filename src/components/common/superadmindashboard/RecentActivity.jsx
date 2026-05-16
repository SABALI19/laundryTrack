import { Box, CalendarClock, CreditCard, UserPlus } from "lucide-react";

const activities = [
  {
    title: "New customer registration",
    meta: "By: System",
    time: "2 hours ago",
    Icon: UserPlus,
    iconClass: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Order completed - #ORD-2024-0847",
    meta: "By: Staff Member",
    time: "4 hours ago",
    Icon: Box,
    iconClass: "bg-blue-100 text-blue-600",
  },
  {
    title: "Business hours configuration updated",
    meta: "By: sarah@cleanexpress.com",
    time: "1 day ago",
    Icon: CalendarClock,
    iconClass: "bg-orange-100 text-orange-600",
  },
  {
    title: "Monthly subscription payment processed",
    meta: "By: Payment System",
    time: "2 days ago",
    Icon: CreditCard,
    iconClass: "bg-emerald-100 text-emerald-600",
  },
];

const RecentActivity = () => {
  return (
    <section className="rounded-xl bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-slate-900">
          Recent Activity
        </h2>
        <button
          type="button"
          className="text-[0.76rem] font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
        >
          View Full Audit Log
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {activities.map(({ title, meta, time, Icon, iconClass }) => (
          <article
            key={title}
            className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-4"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-[0.86rem] font-semibold text-slate-900">
                {title}
              </h3>
              <p className="mt-1 text-[0.72rem] text-slate-500">
                {meta}
                <span className="ml-3">{time}</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RecentActivity;
