import Card from "../Card";
import { AlertTriangle, Clock3, UserRoundCheck } from "lucide-react";

const fallbackAlerts = [
  {
    id: "overdue",
    text: "3 orders past pickup time",
    title: "Overdue Orders",
    tone: "danger",
  },
  {
    id: "disputes",
    text: "2 disputes need resolution",
    title: "Pending Disputes",
    tone: "warning",
  },
  {
    id: "approvals",
    text: "5 items need approval",
    title: "Staff Approvals",
    tone: "info",
  },
];

const toneClassNameMap = {
  danger: "border border-[#fecaca] bg-[#fff1f2] text-[#dc2626]",
  info: "border border-[#bfdbfe] bg-[#eff6ff] text-[#2563eb]",
  warning: "border border-[#fde68a] bg-[#fffbeb] text-[#b45309]",
};

const iconMap = {
  approvals: UserRoundCheck,
  disputes: AlertTriangle,
  overdue: Clock3,
};

const AlertsNotification = ({ alerts = fallbackAlerts }) => {
  const resolvedAlerts = alerts.length > 0 ? alerts : fallbackAlerts;

  return (
    <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h2 className="text-[1rem] font-semibold text-slate-900">Alerts & Notifications</h2>

      <div className="mt-4 space-y-3">
        {resolvedAlerts.map((alert) => {
          const Icon = iconMap[alert.id] || AlertTriangle;
          const toneClassName = toneClassNameMap[alert.tone] || toneClassNameMap.info;

          return (
            <div key={alert.id} className={`rounded-xl px-3 py-3 ${toneClassName}`}>
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="text-[0.82rem] font-semibold">{alert.title}</p>
                  <p className="mt-1 text-[0.72rem]">{alert.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default AlertsNotification;
