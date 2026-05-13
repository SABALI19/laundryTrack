import { createElement } from "react";
import Card from "../Card";
import { TrendingUp } from "lucide-react";

const StatsCards = ({ title, value, change, subtitle, Icon, className = "" }) => {
  return (
    <Card
      className={`min-w-0 overflow-hidden rounded-[1rem] border-slate-100 p-3 shadow-[0_6px_20px_rgba(15,23,42,0.06)] sm:p-4 ${className}`}
    >
      <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-3">
        <p className="min-w-0 break-words text-[0.72rem] leading-4 text-slate-600 sm:text-[0.78rem]">
          {title}
        </p>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] sm:h-8 sm:w-8">
          {Icon && createElement(Icon, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4" })}
        </div>
      </div>

      <div className="mt-3 flex min-w-0 items-end justify-between gap-2 sm:mt-5 sm:gap-3">
        <p className="min-w-0 break-words text-[1.35rem] font-semibold leading-none tracking-normal text-slate-900 [overflow-wrap:anywhere] sm:text-[1.75rem]">
          {value}
        </p>
        <div className="shrink-0 text-right">
          {change && (
            <div className="inline-flex max-w-[6rem] items-center justify-end gap-1 text-right text-[0.68rem] font-medium text-[#16a34a] sm:max-w-[8rem] sm:gap-1.5 sm:text-[0.75rem]">
              <TrendingUp className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
              <span className="break-words [overflow-wrap:anywhere]">{change}</span>
            </div>
          )}
          {!change && subtitle && (
            <p className="break-words text-[0.68rem] text-slate-500 [overflow-wrap:anywhere] sm:text-[0.75rem]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatsCards;