import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  LifeBuoy,
  UserPlus,
  Zap,
} from "lucide-react";
import Button from "../../components/Button";

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
    <section className="rounded-2xl bg-white p-6 shadow-[0_4px_18px_rgba(15,23,42,0.10)]">
      <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
      <div className="mt-7 space-y-6">
        {activities.map(({ title, body, time, Icon, className }) => (
          <article key={title} className="flex gap-4">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${className}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{body}</p>
              <p className="mt-2 text-sm text-slate-400">{time}</p>
            </div>
          </article>
        ))}
      </div>
      <Button variant="regular" size="sm" className="mx-auto mt-9 flex items-center gap-2">
        View all activity
        <ArrowRight className="h-4 w-4" />
      </Button>
    </section>
  );
};

export default RecentActivities;
