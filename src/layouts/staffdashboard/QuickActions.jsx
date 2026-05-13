import Button from "../../components/Button";
import { AlertTriangle, QrCode, Search } from "lucide-react";

const iconMap = {
  issue: AlertTriangle,
  lookup: Search,
  scan: QrCode,
};

const fallbackQuickActionItems = [
  {
    count: 0,
    id: "scan",
    label: "Scan Order QR Code",
    variant: "primary",
  },
  {
    count: 0,
    id: "lookup",
    label: "Manual Order Lookup",
    variant: "secondary",
  },
  {
    count: 0,
    id: "issue",
    label: "Report Issue",
    variant: "secondary",
  },
];

const activePrimaryActionBtn =
  "bg-[#243f6b] text-white shadow-[inset_0_2px_6px_rgba(0,0,0,0.18)]";
const activeSecondaryActionBtn =
  "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] shadow-[inset_0_2px_4px_rgba(44,74,125,0.12)]";

const QuickActions = ({
  activeActionId = null,
  items = fallbackQuickActionItems,
  onActionClick,
  title = "Quick Actions",
}) => {
  return (
    <section className="rounded-[1.4rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
      <h2 className="text-[0.95rem] font-semibold text-slate-900">
        {title}
      </h2>

      <div className="mt-4 space-y-3">
        {items.map((action) => {
          const Icon = action.Icon || iconMap[action.id] || Search;
          const isActive = activeActionId === action.id || action.isActive;
          const showCount = action.count !== undefined && action.count !== null;

          return (
            <Button
              key={action.id}
              type="button"
              variant={action.variant}
              size="md"
              onClick={() => onActionClick?.(action.id, action)}
              className={`flex w-full items-center justify-between gap-3 rounded-[0.9rem] px-4 py-2.5 text-left text-[0.8rem] font-semibold transition-all duration-150 active:scale-[0.97] ${
                action.variant === "primary"
                  ? isActive
                    ? activePrimaryActionBtn
                    : ""
                  : isActive
                    ? activeSecondaryActionBtn
                    : "border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="h-3.5 w-3.5" />
                <span>{action.label}</span>
              </span>
              {showCount && (
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-[0.72rem] font-semibold">
                  {action.count}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;
