import Card from "../Card";
import { Building2, CirclePower, UsersRound } from "lucide-react";

const BussinessInformation = () => {
  return (
    <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h2 className="text-[0.95rem] font-semibold text-slate-900">
        Business Information
      </h2>

      <div className="mt-4 space-y-3.5">
        <div className="flex items-center gap-3">
          <Building2 className="h-4 w-4 text-[var(--color-primary)]" />
          <span className="text-[0.9rem] font-semibold text-slate-900">
            Clean & Fresh Laundry
          </span>
        </div>
        <div className="flex items-center gap-3">
          <CirclePower className="h-4 w-4 text-[#22c55e]" />
          <span className="text-[0.82rem] text-slate-600">Operating</span>
        </div>
        <div className="flex items-center gap-3">
          <UsersRound className="h-4 w-4 text-[var(--color-primary)]" />
          <span className="text-[0.82rem] text-slate-600">8 staff on duty</span>
        </div>
      </div>
    </Card>
  );
};

export default BussinessInformation;
