import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  LifeBuoy,
  UserPlus,
  Zap,
} from "lucide-react";

const activities = [
  {
    title: "New tenant registered",
    body: "SuperWash joined with Premium plan",
    time: "2 minutes ago",
    Icon: UserPlus,
    className: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Subscription upgraded",
    body: "Clean Express upgraded to Premium",
    time: "15 minutes ago",
    Icon: BadgeCheck,
    className: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  },
  {
    title: "System alert",
    body: "Database response time increased",
    time: "1 hour ago",
    Icon: AlertTriangle,
    className: "bg-red-100 text-red-600",
  },
  {
    title: "Support ticket",
    body: "Fresh Laundry Co. requested help",
    time: "2 hours ago",
    Icon: LifeBuoy,
    className: "bg-amber-100 text-amber-600",
  },
  {
    title: "Performance issue",
    body: "API response time spike detected",
    time: "3 hours ago",
    Icon: Zap,
    className: "bg-slate-100 text-[var(--color-primary)]",
  },
];

const RecentActivities = () => {
  return (
    <section className="rounded-xl bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <h2 className="text-[0.95rem] font-semibold text-slate-900">Recent Activity</h2>
      <div className="mt-4 space-y-3">
        {activities.map(({ title, body, time, Icon, className }) => (
          <article key={title} className="flex gap-2.5">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${className}`}>
              <Icon className="h-3 w-3" />
            </span>
            <div className="min-w-0">
              <h3 className="text-[0.76rem] font-bold leading-tight text-slate-900">{title}</h3>
              <p className="mt-0.5 text-[0.66rem] leading-snug text-slate-600">{body}</p>
              <p className="mt-0.5 text-[0.62rem] text-slate-400">{time}</p>
            </div>
          </article>
        ))}
      </div>
      <button
        type="button"
        className="mx-auto mt-5 flex items-center gap-1.5 text-[0.68rem] font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
      >
        View all activity
        <ArrowRight className="h-3 w-3" />
      </button>
    </section>
  );
};

export default RecentActivities;
