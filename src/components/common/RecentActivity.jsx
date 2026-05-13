import Card from "../Card";
import {
  AlertTriangle,
  CheckCircle2,
  PackagePlus,
  RefreshCcw,
} from "lucide-react";

const fallbackActivities = [
  {
    id: 1,
    text: "New order #LT-2024-1287 submitted by Sarah Chen",
    time: "2 minutes ago",
    type: "order-created",
  },
  {
    id: 2,
    text: "Order #LT-2024-1285 completed and ready for pickup",
    time: "5 minutes ago",
    type: "order-completed",
  },
  {
    id: 3,
    text: "Order #LT-2024-1284 moved to drying stage",
    time: "8 minutes ago",
    type: "processing",
  },
  {
    id: 4,
    text: "Dispute reported for order #LT-2024-1280",
    time: "12 minutes ago",
    type: "dispute",
  },
];

const activityStyleMap = {
  dispute: {
    Icon: AlertTriangle,
    iconClassName: "bg-[#fef3c7] text-[#d97706]",
  },
  "order-completed": {
    Icon: CheckCircle2,
    iconClassName: "bg-[#dcfce7] text-[#16a34a]",
  },
  "order-created": {
    Icon: PackagePlus,
    iconClassName: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  },
  processing: {
    Icon: RefreshCcw,
    iconClassName: "bg-[#dbeafe] text-[#2563eb]",
  },
};

const RecentActivity = ({ activities = fallbackActivities }) => {
  const resolvedActivities = activities.length > 0 ? activities : fallbackActivities;

  return (
    <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h2 className="text-[1rem] font-semibold text-slate-900">Recent Activity</h2>

      <div className="mt-4 space-y-4">
        {resolvedActivities.map((activity) => {
          const style = activityStyleMap[activity.type] || activityStyleMap.processing;
          const Icon = style.Icon;

          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.iconClassName}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[0.82rem] text-slate-800">{activity.text}</p>
                <p className="mt-0.5 text-[0.72rem] text-slate-500">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RecentActivity;
